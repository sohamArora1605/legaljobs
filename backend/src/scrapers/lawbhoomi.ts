import axios from 'axios';
import * as cheerio from 'cheerio';
import { Opportunity } from '../models/db.js';

interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
}

export async function scrapeLawBhoomi(maxPages = 3): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  const categoryId = 20; // Law/Legal Internship Opportunities

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  ];

  for (let page = 1; page <= maxPages; page++) {
    let pageFetched = false;

    // STRATEGY 1: Official WordPress REST API Endpoint
    try {
      const url = `https://lawbhoomi.com/wp-json/wp/v2/posts?categories=${categoryId}&per_page=12&page=${page}`;
      const response = await axios.get<WPPost[]>(url, {
        headers: {
          'User-Agent': userAgents[(page - 1) % userAgents.length],
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://lawbhoomi.com/'
        },
        timeout: 12000,
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        for (const post of response.data) {
          const rawTitle = post.title?.rendered || '';
          const title = cleanHtmlEntities(rawTitle);
          const htmlContent = post.content?.rendered || '';
          const $ = cheerio.load(htmlContent);

          let company = 'Legal Chambers / Firm';
          const atMatch = title.match(/(?:at|by|with)\s+([A-Za-z0-9\s&–\.\(\)\',]+?)(?:\s*[:\[\|\–\-]|$)/i);
          if (atMatch && atMatch[1]) {
            company = atMatch[1].trim();
          }

          let stipend = 'Not specified';
          const stipendMatch = (title + ' ' + $.text()).match(/(?:stipend(?:\s+of)?(?:\s+Rs\.?|\s+INR|\s+₹)?\s*([0-9kK,\s]+)|stipend\s*:\s*([A-Za-z0-9,\s]+)|paid\s+internship)/i);
          if (stipendMatch) {
            stipend = stipendMatch[0].trim();
          } else if (title.toLowerCase().includes('paid')) {
            stipend = 'Paid';
          }

          let location = 'India';
          const textToSearch = (title + ' ' + $.text().slice(0, 800)).toLowerCase();
          if (textToSearch.includes('bangalore') || textToSearch.includes('bengaluru')) {
            location = 'Bengaluru';
          } else if (textToSearch.includes('delhi')) {
            location = 'New Delhi';
          } else if (textToSearch.includes('mumbai')) {
            location = 'Mumbai';
          } else if (textToSearch.includes('remote') || textToSearch.includes('virtual') || textToSearch.includes('online')) {
            location = 'Remote / Online';
          }

          let mode: 'onsite' | 'remote' | 'hybrid' | 'unknown' = 'onsite';
          if (textToSearch.includes('remote') || textToSearch.includes('virtual') || textToSearch.includes('online')) {
            mode = 'remote';
          } else if (textToSearch.includes('hybrid')) {
            mode = 'hybrid';
          }

          let applyEmail = '';
          const emailMatch = htmlContent.match(/mailto:([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/i);
          if (emailMatch) {
            applyEmail = emailMatch[1];
          } else {
            const directEmailMatch = htmlContent.match(/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/);
            if (directEmailMatch && !directEmailMatch[1].includes('lawbhoomi')) {
              applyEmail = directEmailMatch[1];
            }
          }

          let applyUrl = post.link;
          $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('forms.gle') || href.includes('docs.google.com/forms') || href.includes('linkedin.com') || $(el).text().toLowerCase().includes('apply'))) {
              if (!href.includes('lawbhoomi') && !href.includes('whatsapp') && !href.includes('telegram')) {
                applyUrl = href;
              }
            }
          });

          const cleanDescription = $.text().replace(/\s+/g, ' ').slice(0, 1200).trim();

          opportunities.push({
            id: `lb_${post.id}`,
            externalId: `lawbhoomi-${post.slug || post.id}`,
            source: 'lawbhoomi',
            title,
            company,
            location,
            mode,
            stipend,
            applyUrl,
            applyEmail,
            description: cleanDescription,
            publishedAt: post.date || new Date().toISOString(),
            scrapedAt: new Date().toISOString(),
            tags: ['Internship', location, mode, stipend],
          });
        }
        pageFetched = true;
      }
    } catch (apiErr: any) {
      console.warn(`[LawBhoomi] API route failed on page ${page} (${apiErr.message}). Trying HTML fallback...`);
    }

    // STRATEGY 2: Clean HTML Category Archive (e.g. /category/internship-opportunities/page/2/)
    if (!pageFetched) {
      try {
        const htmlUrl = page === 1
          ? 'https://lawbhoomi.com/category/internship-opportunities/'
          : `https://lawbhoomi.com/category/internship-opportunities/page/${page}/`;

        const htmlRes = await axios.get<string>(htmlUrl, {
          headers: {
            'User-Agent': userAgents[(page - 1) % userAgents.length],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
          },
          timeout: 15000,
        });

        const $ = cheerio.load(htmlRes.data);
        const articleElements = $('article.entry-card, article[class*="post-"]');

        articleElements.each((_, elem) => {
          const postLink = $(elem).find('h2.entry-title a, a.ct-media-container').first().attr('href') || '';
          const postTitle = cleanHtmlEntities($(elem).find('h2.entry-title a').first().text().trim());

          if (postLink && postTitle && postTitle.length > 5 && !opportunities.some(o => o.applyUrl === postLink)) {
            const rawSlugMatch = postLink.match(/lawbhoomi\.com\/([^\/]+)\/?$/);
            const slug = rawSlugMatch ? rawSlugMatch[1] : `lb_post_${Date.now()}`;

            let location = 'India';
            const lowerTitle = postTitle.toLowerCase();
            if (lowerTitle.includes('bengaluru') || lowerTitle.includes('bangalore')) location = 'Bengaluru';
            else if (lowerTitle.includes('delhi')) location = 'New Delhi';
            else if (lowerTitle.includes('mumbai')) location = 'Mumbai';
            else if (lowerTitle.includes('remote') || lowerTitle.includes('online')) location = 'Remote / Online';

            let company = 'Legal Chambers / Firm';
            const atMatch = postTitle.match(/(?:at|by|with)\s+([A-Za-z0-9\s&–\.\(\)\',]+?)(?:\s*[:\[\|\–\-]|$)/i);
            if (atMatch && atMatch[1]) company = atMatch[1].trim();

            opportunities.push({
              id: `lb_${slug}`,
              externalId: `lawbhoomi-${slug}`,
              source: 'lawbhoomi',
              title: postTitle,
              company,
              location,
              mode: lowerTitle.includes('remote') ? 'remote' : 'onsite',
              stipend: lowerTitle.includes('paid') ? 'Paid' : 'Not specified',
              applyUrl: postLink,
              applyEmail: '',
              description: postTitle,
              publishedAt: new Date().toISOString(),
              scrapedAt: new Date().toISOString(),
              tags: ['Internship', location, 'onsite'],
            });
          }
        });
      } catch (fallbackErr: any) {
        console.error(`[LawBhoomi] HTML fallback failed on page ${page}:`, fallbackErr.message || fallbackErr);
      }
    }
  }

  return opportunities;
}

function cleanHtmlEntities(str: string): string {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}
