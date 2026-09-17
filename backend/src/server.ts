import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes.js';
import { initScraperScheduler, runScrapers } from './scrapers/scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', routes);

// Serve built frontend assets if public directory exists (Single-Container / Docker / Render)
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(publicDir, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) next();
  });
});

// Scraper scheduler
initScraperScheduler();

// Run initial scraper in the background if opportunities are empty
setTimeout(async () => {
  try {
    const { db } = await import('./models/db.js');
    if (db.getOpportunities().length === 0) {
      console.log('[Init] Opportunities table empty. Running initial background scrape (Top 3 pages)...');
      await runScrapers();
    }
  } catch (e) {
    console.error('[Init] Initial scrape failed:', e);
  }
}, 3000);

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`LegalJobs Backend Server running on http://localhost:${PORT}`);
  console.log(`Fixed Admin: username="soham arora", password="easypeasy"`);
  console.log(`====================================================`);
});
