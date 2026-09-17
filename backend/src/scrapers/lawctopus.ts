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

export async function scrapeLawctopus(maxPages = 3): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  const categoryId = 82692; // Internships and Small Projects

  // User-Agents to simulate real desktop navigation
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0'
  ];

  for (let page = 1; page <= maxPages; page++) {
    let pageFetched = false;

    // STRATEGY 1: Official WordPress REST API Endpoint with Bengaluru city taxonomies
    // Term 161905 ('bengaluru') & 82774 ('bangalore') directly mirror ?tax=city:161905 without triggering Cloudflare blocks
    try {
      const apiUrl = `https://www.lawctopus.com/wp-json/wp/v2/posts?categories=${categoryId}&cities=161905,82774&per_page=12&page=${page}`;
      const response = await axios.get<WPPost[]>(apiUrl, {
        headers: {
          'User-Agent': userAgents[(page - 1) % userAgents.length],
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://www.lawctopus.com/',
          'Origin': 'https://www.lawctopus.com'
        },
        timeout: 12000,
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        for (const post of response.data) {
          const rawTitle = post.title?.rendered || '';
          const title = cleanHtmlEntities(rawTitle);
          const htmlContent = post.content?.rendered || '';
          const $ = cheerio.load(htmlContent);

          let company = 'Law Firm / Legal Org';
          const atMatch = title.match(/(?:at|by|with)\s+([A-Za-z0-9\s&–\.\(\)\',]+?)(?:\s*[:\[\|\–\-]|$)/i);
          if (atMatch && atMatch[1]) {
            company = atMatch[1].trim();
          } else {
            const orgTextMatch = $.text().match(/Organis?ation\s*:\s*([A-Za-z0-9\s&–\.\(\)\',]+?)(?:\n|\r|\.|\;)/i);
            if (orgTextMatch && orgTextMatch[1]) {
              company = orgTextMatch[1].trim();
            }
          }

          let stipend = 'Not specified';
          const stipendMatch = (title + ' ' + $.text()).match(/(?:stipend(?:\s+of)?(?:\s+Rs\.?|\s+INR|\s+₹)?\s*([0-9kK,\s]+)|stipend\s*:\s*([A-Za-z0-9,\s]+)|paid\s+internship|unpaid)/i);
          if (stipendMatch) {
            stipend = stipendMatch[0].trim();
          } else if (title.toLowerCase().includes('paid')) {
            stipend = 'Paid';
          }

          let location = 'Bengaluru';
          const textToSearch = (title + ' ' + $.text().slice(0, 800)).toLowerCase();
          if (textToSearch.includes('delhi')) {
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
            if (directEmailMatch && !directEmailMatch[1].includes('lawctopus')) {
              applyEmail = directEmailMatch[1];
            }
          }

          let applyUrl = post.link;
          $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('forms.gle') || href.includes('docs.google.com/forms') || href.includes('linkedin.com') || $(el).text().toLowerCase().includes('apply'))) {
              if (!href.includes('lawctopus') && !href.includes('whatsapp') && !href.includes('telegram')) {
                applyUrl = href;
              }
            }
          });

          const cleanDescription = $.text().replace(/\s+/g, ' ').slice(0, 1200).trim();

          opportunities.push({
            id: `lc_${post.id}`,
            externalId: `lawctopus-${post.slug || post.id}`,
            source: 'lawctopus',
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
      console.warn(`[Lawctopus] API route failed on page ${page} (${apiErr.message}). Attempting clean HTML fallback...`);
    }

    // STRATEGY 2: Clean Category HTML Archive with browser headers (Avoids JetEngine query parameters that trigger Cloudflare challenge)
    if (!pageFetched) {
      try {
        const htmlUrl = page === 1
          ? 'https://www.lawctopus.com/category/opportunities-events/internships-small-projects/'
          : `https://www.lawctopus.com/category/opportunities-events/internships-small-projects/page/${page}/`;

        const htmlRes = await axios.get<string>(htmlUrl, {
          headers: {
            'User-Agent': userAgents[(page - 1) % userAgents.length],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
          },
          timeout: 15000,
        });

        const $ = cheerio.load(htmlRes.data);
        const articleElements = $('article, .jet-listing-grid__item');

        articleElements.each((_, elem) => {
          const postLink = $(elem).find('a[href*="lawctopus.com/"]').first().attr('href') || '';
          const postTitle = cleanHtmlEntities($(elem).find('h2, h3, .jet-listing-dynamic-title, a').first().text().trim());

          if (postLink && postTitle && postTitle.length > 8 && !opportunities.some(o => o.applyUrl === postLink)) {
            const rawSlugMatch = postLink.match(/lawctopus\.com\/([^\/]+)\/?$/);
            const slug = rawSlugMatch ? rawSlugMatch[1] : `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

            let location = 'India';
            const lowerTitle = postTitle.toLowerCase();
            if (lowerTitle.includes('bengaluru') || lowerTitle.includes('bangalore')) location = 'Bengaluru';
            else if (lowerTitle.includes('delhi')) location = 'New Delhi';
            else if (lowerTitle.includes('mumbai')) location = 'Mumbai';
            else if (lowerTitle.includes('remote') || lowerTitle.includes('online')) location = 'Remote / Online';

            let company = 'Law Firm / Legal Org';
            const atMatch = postTitle.match(/(?:at|by|with)\s+([A-Za-z0-9\s&–\.\(\)\',]+?)(?:\s*[:\[\|\–\-]|$)/i);
            if (atMatch && atMatch[1]) company = atMatch[1].trim();

            opportunities.push({
              id: `lc_${slug}`,
              externalId: `lawctopus-${slug}`,
              source: 'lawctopus',
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
        console.error(`[Lawctopus] HTML fallback failed on page ${page}:`, fallbackErr.message || fallbackErr);
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
