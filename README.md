# 🏛️ LegalJobs — India's Premier Legal Internship & Chambers Platform

A fullstack application tracking and autonomous assistance suite tailored for law students applying to leading Indian law firms, appellate chambers, boutique practices, and live aggregated opportunities (with specialized focus on **Bangalore** and National BigLaw).

---

## 🌟 Key Architecture & Features

### 1. 100 Legal Companies & Chambers Directory
- **Tiers**: Tier A (National BigLaw e.g. SAM, CAM, Trilegal, Khaitan, AZB, JSA), Tier B (Elite Specialists e.g. Nishith Desai, S&R, TT&A, Spice Route), Tier C (Boutiques, High Court Chambers, and Bangalore Leaders e.g. King & Partridge, Poovayya & Co., Justlaw, IndusLaw).
- **Modalities**:
  - `button_form`: Direct application form on firm website.
  - `web_portal`: Dedicated career application system.
  - `direct_email`: Direct submission to designated HR/partner recruitment desk.
  - `chamber_outreach`: Formal chamber cover letter outreach.
- **Strict Advance Notice & Instructions**: Highlights 3-month or 6-month advance notice windows (e.g. AZB's 6-month requirement).
- **Anti-Mistake Warnings**: Explicit alerts distinguishing **Application Emails** from **Query-Only / Media Inquiries** (prevents immediate rejection).

### 2. Direct Email Assistant (Safe Clipboard + Mailto)
- "Send Mail" action auto-formats a tailored cover letter using the candidate's active profile (law school, CGPA, graduation year, preferred practice area, availability) and firm specifics.
- Automatically copies the personalized body to clipboard.
- Opens system email client (`mailto:`) with recipient and custom subject pre-filled.
- **Safety guarantee**: Strictly **never** sends emails automatically in the background.

### 3. Aggregators (LawBhoomi & Lawctopus) Polite Scraper
- Automatically crawls **LawBhoomi** (Category 20) and **Lawctopus** (Category 82692) via WP REST API.
- **Polite Limit**: Restricted strictly to the **top 3 pages** (`per_page=12`, total 72 latest items per cycle). Zero website bombardment or captchas.
- **Deterministic Deduplication**: Uses slug IDs (`lawbhoomi-<slug>`, `lawctopus-<slug>`) to update existing entries without wiping user saves.
- **Sanitized Extraction**: Cleans HTML tags, extracts stipends, locations, modes (onsite/remote/hybrid), and direct HR contact emails.
- Runs daily at **04:00 AM** via cron schedule, with a manual **Sync Latest** trigger in the UI and admin dashboard.

### 4. Personal Tracking Board (Kanban)
- 5 columns: `Saved`, `Applied`, `Interview`, `Offer`, `Rejected`.
- 1-click addition from the 100 Firms Directory.
- 1-click addition from the Live Aggregators Feed.
- "+ Add External Application" modal to manually log outsourced opportunities (e.g., direct partner referrals, LinkedIn DM outreach, chamber walk-ins).

### 5. Candidate Profile & Safe Chrome Extension (Manifest V3)
- Profile management for personal info, university credentials, CGPA, preferred practice, availability, and cover letter template.
- **Safe Autofill Chrome Extension** (`extension/`):
  - Manifest V3 with fuzzy aliasing dictionary matching name, email, phone, college, degree, graduation year, CGPA, practice area, location, and statement of purpose.
  - Highlights populated inputs with clean visual green feedback.
  - **Safety guarantee**: Strictly **never** auto-clicks submit buttons; full candidate review remains mandatory.

### 6. Principal Administration Suite
- **Fixed Admin Credentials**:
  - **Username**: `soham arora`
  - **Password**: `easypeasy`
- Master user management: provision new users with custom passwords, override/reset passwords on demand, delete users, and copy formatted credential share cards with one click.
- Scraper manual trigger and live sync statistics.

---

## 🚀 Quickstart Guide

### Option A: Local Development (Node.js)

1. **Start Backend (Port 5000)**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

2. **Start Frontend (Port 5173)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

### Option B: 1-Command Docker Deployment

Run with Docker Compose:
```bash
docker compose up --build
```
The application will be built via a multi-stage Docker container and served on `http://localhost:5000`.

---

## 🧩 Installing the Chrome Extension

1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** toggle in the top right.
3. Click **Load unpacked**.
4. Select the directory: `d:\legaljobs\extension`.
5. When on any law firm career or internship portal (e.g., Google Form, law firm web portal), click the **LegalJobs** extension icon in your toolbar and press **Autofill Current Page**.
