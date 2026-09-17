import cron from 'node-cron';
import { db } from '../models/db.js';
import { scrapeLawBhoomi } from './lawbhoomi.js';
import { scrapeLawctopus } from './lawctopus.js';

export async function runScrapers(): Promise<{ totalAdded: number; totalUpdated: number }> {
  console.log('[Scraper] Initiating scheduled scrape for LawBhoomi and Lawctopus (Max 3 pages each)...');
  await db.setScraperStatus('running');

  try {
    const [lbOpportunities, lcOpportunities] = await Promise.all([
      scrapeLawBhoomi(3),
      scrapeLawctopus(3),
    ]);

    const combined = [...lbOpportunities, ...lcOpportunities];
    const { added, updated } = await db.upsertOpportunities(combined);

    await db.setScraperStatus('idle');
    const totalCount = (await db.getOpportunities()).length;
    console.log(`[Scraper] Complete! Added: ${added}, Updated: ${updated}, Total in DB: ${totalCount}`);
    return { totalAdded: added, totalUpdated: updated };
  } catch (err: any) {
    console.error('[Scraper] Execution error:', err);
    await db.setScraperStatus('error', err.message || String(err));
    return { totalAdded: 0, totalUpdated: 0 };
  }
}

export function initScraperScheduler() {
  // Run automatically every 5 hours (e.g. 00:00, 05:00, 10:00, 15:00, 20:00)
  cron.schedule('0 */5 * * *', () => {
    console.log('[Cron] Triggering 5-hour automated legal internship sync...');
    runScrapers();
  });
  console.log('[Cron] Scraper scheduler registered (Every 5 hours: 0 */5 * * *).');
}
