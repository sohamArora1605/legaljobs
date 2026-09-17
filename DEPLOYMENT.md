# 🚀 LegalJobs Complete Deployment Guide

This guide gives step-by-step instructions for deploying LegalJobs.

---

## 🏗️ Deployment Architectures Overview

| Architecture | Setup Difficulty | Cost | Notes |
| :--- | :--- | :--- | :--- |
| **Option 1: Render All-in-One (Docker)** | ⭐ Easy (1 service) | **100% Free** | Builds both frontend & backend from `Dockerfile`. |
| **Option 2: Vercel (Frontend) + Render (Backend)** | ⭐⭐ Medium (2 services) | **100% Free** | Fastest frontend via Vercel Edge CDN + Backend API on Render. |
| **Option 3: Koyeb All-in-One (Docker)** | ⭐ Easy (1 service) | **100% Free** | Free tier container that does **not** sleep when idle. |

---

## 🛠️ Step-by-Step: Option 1 — Render (All-in-One Docker) [Recommended]

This builds the multi-stage [Dockerfile](file:///d:/legaljobs/Dockerfile) which serves the React frontend and Node backend together on a single URL.

### 1. Push Code to GitHub
Ensure all changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare LegalJobs for production deployment"
git push origin main
```

### 2. Create Service on Render
1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following fields:
   * **Name**: `legaljobs`
   * **Region**: Choose closest to you (e.g., Singapore or Frankfurt).
   * **Runtime / Environment**: **Docker** (Render detects the root `Dockerfile`).
   * **Instance Type**: **Free**.
5. **Environment Variables**:
   Under *Advanced* → *Add Environment Variable*, add:
   * `NODE_ENV` = `production`
   * `ADMIN_USERNAME` = `soham arora`
   * `ADMIN_PASSWORD` = `easypeasy`
   * `JWT_SECRET` = (enter any random secure string, e.g. `chambers_legaljobs_secret_2026_x99`)
6. Click **Deploy Web Service**.

Render will build both the frontend and backend, launch your service, and give you an active URL like:
👉 `https://legaljobs.onrender.com`

---

## ⚡ Step-by-Step: Option 2 — Vercel (Frontend) + Render (Backend)

If you prefer Vercel's fast global CDN for the frontend:

### 1. Deploy Backend on Render
1. Create a Web Service on Render pointing to your repo.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Note your backend URL (e.g. `https://legaljobs-api.onrender.com`).

### 2. Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In **Root Directory**, click *Edit* and select: `frontend`.
4. In **Environment Variables**, add:
   * `VITE_API_URL` = `https://legaljobs-api.onrender.com/api`
5. Click **Deploy**.

---

## ⏰ Keeping the 5-Hour Scraper Running for Free (cron-job.org)

Render free-tier containers go to sleep after 15 minutes of inactivity. When asleep, in-memory `node-cron` timers pause. 

To keep the scraper running **accurately every 5 hours for 100% free**:

1. Create a free account at **[cron-job.org](https://cron-job.org)**.
2. Click **Create Cronjob**.
3. Set the fields:
   * **Title**: `LegalJobs 5-Hour Internship Scraper`
   * **URL**: `https://<YOUR-RENDER-BACKEND-URL>/api/opportunities/scrape`
     *(Example: `https://legaljobs.onrender.com/api/opportunities/scrape`)*
   * **Request Method**: `POST`
   * **Schedule**: Choose **Every 5 hours** (or custom cron `0 */5 * * *`).
4. Click **Save**.

### Why this works:
1. Every 5 hours, `cron-job.org` sends an HTTP POST request to your scraper endpoint.
2. If Render is asleep, this request automatically **wakes it up**.
3. The scraper polls the top 3 pages of Bengaluru opportunities from Lawctopus and LawBhoomi, deduplicates them, updates the database, and returns `HTTP 200`.

---

## 🧩 Updating the Chrome Extension for Production

Once your live deployment URL is active:
1. Open [`extension/popup.js`](file:///d:/legaljobs/extension/popup.js).
2. Change the default backend URL:
   ```javascript
   const API_BASE = 'https://<YOUR-RENDER-BACKEND-URL>/api';
   ```
3. Load or reload the unpacked extension in `chrome://extensions`.
4. Log in with your credentials (`soham arora` / `easypeasy`). The extension will now communicate directly with your live cloud backend!
