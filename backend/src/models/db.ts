import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LegalFirm {
  id: string;
  name: string;
  tier: string;
  website: string;
  career_url: string;
  internship_url: string;
  modality: 'button_form' | 'direct_email' | 'web_portal' | 'chamber_outreach';
  button_interaction: string;
  application_email: string;
  query_only_email: string;
  location: string;
  instructions: string;
}

export interface Opportunity {
  id: string;
  externalId: string; // e.g. "lawbhoomi-1234", "lawctopus-5678"
  source: 'lawbhoomi' | 'lawctopus';
  title: string;
  company: string;
  location: string;
  mode: 'onsite' | 'remote' | 'hybrid' | 'unknown';
  stipend: string;
  applyUrl: string;
  applyEmail: string;
  description: string;
  publishedAt: string;
  scrapedAt: string;
  tags: string[];
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  opportunityId?: string;
  source: 'directory' | 'lawbhoomi' | 'lawctopus' | 'outsourced';
  roleTitle: string;
  location: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate?: string;
  deadline?: string;
  notes?: string;
  contactEmail?: string;
  portalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  yearOfStudy: string;
  passingYear: string;
  cgpa: string;
  preferredPractice: string;
  preferredLocation: string;
  availability: string;
  linkedIn: string;
  coverLetterTemplate: string;
  resumePath: string;
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeBase64?: string;
  achievements: string;
  updatedAt: string;
}

export interface ScraperStats {
  lastScrapedAt: string | null;
  totalScraped: number;
  lawbhoomiCount: number;
  lawctopusCount: number;
  status: 'idle' | 'running' | 'error';
  lastError?: string;
}

interface DatabaseSchema {
  users: User[];
  firms: LegalFirm[];
  opportunities: Opportunity[];
  applications: Application[];
  profiles: CandidateProfile[];
  scraperStats: ScraperStats;
}

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Mongoose schema for persistent MongoDB Atlas storage
const AtlasStateSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main_state' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const AtlasStateModel = mongoose.models.LegalJobsState || mongoose.model('LegalJobsState', AtlasStateSchema);

class JSONDatabase {
  private isAtlasConnected = false;
  private data: DatabaseSchema = {
    users: [],
    firms: [],
    opportunities: [],
    applications: [],
    profiles: [],
    scraperStats: {
      lastScrapedAt: null,
      totalScraped: 0,
      lawbhoomiCount: 0,
      lawctopusCount: 0,
      status: 'idle',
    }
  };

  constructor() {
    this.init();
    this.connectAtlas();
  }

  private async connectAtlas() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) return;

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
      this.isAtlasConnected = true;
      console.log('🍃 MongoDB Atlas connected successfully.');

      // Load state from Atlas if available
      const record = await AtlasStateModel.findOne({ key: 'main_state' });
      if (record && record.data) {
        // Merge cloud data with local memory
        this.data = { ...this.data, ...record.data };
        console.log(`🍃 Synced state from MongoDB Atlas (${this.data.opportunities.length} opportunities, ${this.data.users.length} users).`);
      } else {
        // Push initial state to Atlas
        await AtlasStateModel.findOneAndUpdate(
          { key: 'main_state' },
          { data: this.data, updatedAt: new Date() },
          { upsert: true }
        );
        console.log('🍃 Initial state uploaded to MongoDB Atlas.');
      }
    } catch (err: any) {
      console.warn(`[MongoDB Atlas] Connection notice (${err.message}). Using local database engine.`);
      this.isAtlasConnected = false;
    }
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse db.json, creating fresh:', err);
      }
    }

    // Always seed firms from firms.json if empty or incomplete
    const candidatePaths = [
      path.resolve(__dirname, '../data/firms.json'),
      path.resolve(__dirname, '../../src/data/firms.json'),
      path.resolve(process.cwd(), 'src/data/firms.json'),
      path.resolve(process.cwd(), 'dist/data/firms.json')
    ];
    let firmsJsonPath = candidatePaths.find(p => fs.existsSync(p));

    if (firmsJsonPath) {
      try {
        const firmsData: LegalFirm[] = JSON.parse(fs.readFileSync(firmsJsonPath, 'utf-8'));
        if (!this.data.firms || this.data.firms.length === 0) {
          this.data.firms = firmsData;
          console.log(`Seeded ${firmsData.length} legal firms into database from ${firmsJsonPath}.`);
        }
      } catch (e) {
        console.error('Error loading firms.json:', e);
      }
    }

    // Seed default admin: username "soham arora", password "easypeasy"
    const adminUsername = process.env.ADMIN_USERNAME || 'soham arora';
    const adminPassword = process.env.ADMIN_PASSWORD || 'easypeasy';
    const existingAdmin = this.data.users.find(u => u.username.toLowerCase() === adminUsername.toLowerCase());

    if (!existingAdmin) {
      const passwordHash = bcrypt.hashSync(adminPassword, 10);
      this.data.users.push({
        id: 'admin_1',
        username: adminUsername,
        passwordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      console.log(`Default admin seeded: ${adminUsername}`);
    }

    this.save();
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }

    // Dual-write to MongoDB Atlas in background if connected
    if (this.isAtlasConnected) {
      AtlasStateModel.findOneAndUpdate(
        { key: 'main_state' },
        { data: this.data, updatedAt: new Date() },
        { upsert: true }
      ).catch((err: any) => {
        console.error('Error syncing state to MongoDB Atlas:', err.message);
      });
    }
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserByUsername(username: string): User | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public addUser(user: User): void {
    this.data.users.push(user);
    this.save();
  }

  public updateUserPassword(userId: string, newHash: string): boolean {
    const u = this.getUserById(userId);
    if (!u) return false;
    u.passwordHash = newHash;
    this.save();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.save();
    return true;
  }

  // Firms
  public getFirms(): LegalFirm[] {
    return this.data.firms;
  }

  // Opportunities (Scraped)
  public getOpportunities(): Opportunity[] {
    return this.data.opportunities;
  }

  public upsertOpportunities(newItems: Opportunity[]): { added: number; updated: number } {
    let added = 0;
    let updated = 0;

    for (const item of newItems) {
      const existingIdx = this.data.opportunities.findIndex(o => o.externalId === item.externalId);
      if (existingIdx >= 0) {
        // Update timestamps and apply URLs without wiping user associations
        this.data.opportunities[existingIdx] = {
          ...this.data.opportunities[existingIdx],
          ...item,
          id: this.data.opportunities[existingIdx].id, // keep original ID
          scrapedAt: new Date().toISOString(),
        };
        updated++;
      } else {
        this.data.opportunities.unshift(item);
        added++;
      }
    }

    // Update stats
    this.data.scraperStats.lastScrapedAt = new Date().toISOString();
    this.data.scraperStats.totalScraped = this.data.opportunities.length;
    this.data.scraperStats.lawbhoomiCount = this.data.opportunities.filter(o => o.source === 'lawbhoomi').length;
    this.data.scraperStats.lawctopusCount = this.data.opportunities.filter(o => o.source === 'lawctopus').length;

    this.save();
    return { added, updated };
  }

  public getScraperStats(): ScraperStats {
    return this.data.scraperStats;
  }

  public setScraperStatus(status: 'idle' | 'running' | 'error', errorMsg?: string) {
    this.data.scraperStats.status = status;
    if (errorMsg) this.data.scraperStats.lastError = errorMsg;
    this.save();
  }

  // Tracking Board (Applications)
  public getApplications(userId: string): Application[] {
    return this.data.applications.filter(a => a.userId === userId);
  }

  public addApplication(app: Application): Application {
    this.data.applications.unshift(app);
    this.save();
    return app;
  }

  public updateApplication(id: string, userId: string, updates: Partial<Application>): Application | null {
    const app = this.data.applications.find(a => a.id === id && a.userId === userId);
    if (!app) return null;
    Object.assign(app, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return app;
  }

  public deleteApplication(id: string, userId: string): boolean {
    const idx = this.data.applications.findIndex(a => a.id === id && a.userId === userId);
    if (idx === -1) return false;
    this.data.applications.splice(idx, 1);
    this.save();
    return true;
  }

  // Candidate Profile
  public getProfile(userId: string): CandidateProfile {
    let p = this.data.profiles.find(prof => prof.userId === userId);
    if (!p) {
      p = {
        userId,
        fullName: 'Legal Candidate',
        email: '',
        phone: '',
        college: 'National Law School / Law University',
        degree: 'B.A. LL.B. (Hons.)',
        yearOfStudy: '4th Year',
        passingYear: '2027',
        cgpa: '8.4 / 10',
        preferredPractice: 'Corporate & M&A, Commercial Litigation',
        preferredLocation: 'Bengaluru, Mumbai',
        availability: 'May - July 2026',
        linkedIn: 'https://linkedin.com/in/',
        coverLetterTemplate: `Dear Recruitment Team at {firm_name},\n\nI am writing to express my strong interest in an internship opportunity at {firm_name} in {practice_area} at your {location} office for the period of {availability}.\n\nI am currently a {year} student pursuing {degree} at {college}, with a CGPA of {cgpa}. Having closely tracked {firm_name}'s stellar work in commercial transactions and disputes, I am eager to contribute with high-rigor legal research and drafting.\n\nThank you for your consideration.\n\nSincerely,\n{full_name}\n{phone}\n{email}`,
        resumePath: 'C:\\Users\\Soham\\Documents\\Resume.pdf',
        achievements: 'National Moot Court semi-finalist; Published 2 articles on corporate governance.',
        updatedAt: new Date().toISOString(),
      };
      this.data.profiles.push(p);
      this.save();
    }
    return p;
  }

  public updateProfile(userId: string, updates: Partial<CandidateProfile>): CandidateProfile {
    const p = this.getProfile(userId);
    Object.assign(p, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return p;
  }
}

export const db = new JSONDatabase();
