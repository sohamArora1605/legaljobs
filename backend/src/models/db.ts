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

// Mongoose Schemas & Models for Native MongoDB Collections
const UserSchema = new mongoose.Schema<User>({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: String, default: () => new Date().toISOString() },
}, { versionKey: false });

const LegalFirmSchema = new mongoose.Schema<LegalFirm>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  tier: { type: String, default: 'Tier B' },
  website: { type: String, default: '' },
  career_url: { type: String, default: '' },
  internship_url: { type: String, default: '' },
  modality: { type: String, default: 'button_form' },
  button_interaction: { type: String, default: '' },
  application_email: { type: String, default: '' },
  query_only_email: { type: String, default: '' },
  location: { type: String, default: '' },
  instructions: { type: String, default: '' },
}, { versionKey: false });

const OpportunitySchema = new mongoose.Schema<Opportunity>({
  id: { type: String, required: true },
  externalId: { type: String, required: true, unique: true, index: true },
  source: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, default: 'Legal Chambers / Firm' },
  location: { type: String, default: 'India' },
  mode: { type: String, default: 'onsite' },
  stipend: { type: String, default: 'Not specified' },
  applyUrl: { type: String, default: '' },
  applyEmail: { type: String, default: '' },
  description: { type: String, default: '' },
  publishedAt: { type: String, default: () => new Date().toISOString() },
  scrapedAt: { type: String, default: () => new Date().toISOString() },
  tags: { type: [String], default: [] },
}, { versionKey: false });

const ApplicationSchema = new mongoose.Schema<Application>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  companyName: { type: String, required: true },
  opportunityId: { type: String, default: '' },
  source: { type: String, default: 'outsourced' },
  roleTitle: { type: String, default: 'Legal Intern' },
  location: { type: String, default: 'Bengaluru' },
  status: { type: String, enum: ['saved', 'applied', 'interview', 'offer', 'rejected'], default: 'saved' },
  appliedDate: { type: String, default: '' },
  deadline: { type: String, default: '' },
  notes: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  portalUrl: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
}, { versionKey: false });

const CandidateProfileSchema = new mongoose.Schema<CandidateProfile>({
  userId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, default: 'Legal Candidate' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  college: { type: String, default: 'National Law School / Law University' },
  degree: { type: String, default: 'B.A. LL.B. (Hons.)' },
  yearOfStudy: { type: String, default: '4th Year' },
  passingYear: { type: String, default: '2027' },
  cgpa: { type: String, default: '8.4 / 10' },
  preferredPractice: { type: String, default: 'Corporate & M&A, Commercial Litigation' },
  preferredLocation: { type: String, default: 'Bengaluru, Mumbai' },
  availability: { type: String, default: 'May - July 2026' },
  linkedIn: { type: String, default: 'https://linkedin.com/in/' },
  coverLetterTemplate: {
    type: String,
    default: `Dear Recruitment Team at {firm_name},\n\nI am writing to express my strong interest in an internship opportunity at {firm_name} in {practice_area} at your {location} office for the period of {availability}.\n\nI am currently a {year} student pursuing {degree} at {college}, with a CGPA of {cgpa}. Having closely tracked {firm_name}'s stellar work in commercial transactions and disputes, I am eager to contribute with high-rigor legal research and drafting.\n\nThank you for your consideration.\n\nSincerely,\n{full_name}\n{phone}\n{email}`,
  },
  resumePath: { type: String, default: '' },
  resumeFileName: { type: String, default: '' },
  resumeFileSize: { type: Number, default: 0 },
  resumeBase64: { type: String, default: '' },
  achievements: { type: String, default: 'National Moot Court semi-finalist; Published 2 articles on corporate governance.' },
  updatedAt: { type: String, default: () => new Date().toISOString() },
}, { versionKey: false });

const ScraperStatsSchema = new mongoose.Schema<ScraperStats & { key: string }>({
  key: { type: String, unique: true, default: 'global_stats' },
  lastScrapedAt: { type: String, default: null },
  totalScraped: { type: Number, default: 0 },
  lawbhoomiCount: { type: Number, default: 0 },
  lawctopusCount: { type: Number, default: 0 },
  status: { type: String, enum: ['idle', 'running', 'error'], default: 'idle' },
  lastError: { type: String, default: '' },
}, { versionKey: false });

export const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema);
export const FirmModel = mongoose.models.LegalFirm || mongoose.model<LegalFirm>('LegalFirm', LegalFirmSchema);
export const OpportunityModel = mongoose.models.Opportunity || mongoose.model<Opportunity>('Opportunity', OpportunitySchema);
export const ApplicationModel = mongoose.models.Application || mongoose.model<Application>('Application', ApplicationSchema);
export const ProfileModel = mongoose.models.CandidateProfile || mongoose.model<CandidateProfile>('CandidateProfile', CandidateProfileSchema);
export const ScraperStatsModel = mongoose.models.ScraperStats || mongoose.model<ScraperStats & { key: string }>('ScraperStats', ScraperStatsSchema);

class MongoDatabase {
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.connectionPromise = this.init();
  }

  public async init(): Promise<void> {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('⚠️ MONGODB_URI not found in environment. Running without persistent database.');
      return;
    }

    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
      }
      this.isConnected = true;
      console.log('🍃 MongoDB Atlas connected successfully to native collections.');

      // Check for legacy single-document data in legaljobsstates and migrate if needed
      await this.checkAndMigrateLegacyData();

      // Seed Legal Firms from firms.json if collection is empty
      await this.seedFirmsIfEmpty();

      // Seed Default Admin if missing
      await this.seedDefaultAdmin();

      // Seed Initial Scraper Stats if missing
      await this.seedScraperStats();
    } catch (err: any) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
      this.isConnected = false;
    }
  }

  public async waitForConnection(): Promise<void> {
    if (this.connectionPromise) {
      await this.connectionPromise;
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  private async checkAndMigrateLegacyData() {
    try {
      const collections = await mongoose.connection.db!.listCollections().toArray();
      const hasLegacy = collections.some(c => c.name === 'legaljobsstates');
      if (!hasLegacy) return;

      const legacyDoc = await mongoose.connection.db!.collection('legaljobsstates').findOne({ key: 'main_state' });
      if (!legacyDoc || !legacyDoc.data) return;

      const { users, opportunities, applications, profiles } = legacyDoc.data;

      // Migrate Users
      if (Array.isArray(users) && users.length > 0) {
        const userCount = await UserModel.countDocuments();
        if (userCount === 0) {
          console.log(`[Migration] Migrating ${users.length} users from legacy state to 'users' collection...`);
          for (const u of users) {
            await UserModel.updateOne(
              { username: u.username.toLowerCase() },
              { $setOnInsert: u },
              { upsert: true }
            );
          }
        }
      }

      // Migrate Opportunities
      if (Array.isArray(opportunities) && opportunities.length > 0) {
        const oppCount = await OpportunityModel.countDocuments();
        if (oppCount === 0) {
          console.log(`[Migration] Migrating ${opportunities.length} opportunities from legacy state to 'opportunities' collection...`);
          const bulkOps = opportunities.map((o: Opportunity) => ({
            updateOne: {
              filter: { externalId: o.externalId },
              update: { $setOnInsert: o },
              upsert: true,
            }
          }));
          await OpportunityModel.bulkWrite(bulkOps);
        }
      }

      // Migrate Applications
      if (Array.isArray(applications) && applications.length > 0) {
        const appCount = await ApplicationModel.countDocuments();
        if (appCount === 0) {
          console.log(`[Migration] Migrating ${applications.length} applications from legacy state...`);
          for (const a of applications) {
            await ApplicationModel.updateOne({ id: a.id }, { $setOnInsert: a }, { upsert: true });
          }
        }
      }

      // Migrate Profiles
      if (Array.isArray(profiles) && profiles.length > 0) {
        const profCount = await ProfileModel.countDocuments();
        if (profCount === 0) {
          console.log(`[Migration] Migrating ${profiles.length} candidate profiles from legacy state...`);
          for (const p of profiles) {
            await ProfileModel.updateOne({ userId: p.userId }, { $setOnInsert: p }, { upsert: true });
          }
        }
      }

      console.log('🍃 Legacy state migration check completed.');
    } catch (migErr: any) {
      console.warn('[Migration] Notice during legacy data check:', migErr.message);
    }
  }

  private async seedFirmsIfEmpty() {
    try {
      const firmCount = await FirmModel.countDocuments();
      if (firmCount > 0) return;

      const candidatePaths = [
        path.resolve(__dirname, '../data/firms.json'),
        path.resolve(__dirname, '../../src/data/firms.json'),
        path.resolve(process.cwd(), 'src/data/firms.json'),
        path.resolve(process.cwd(), 'dist/data/firms.json')
      ];
      const firmsJsonPath = candidatePaths.find(p => fs.existsSync(p));

      if (firmsJsonPath) {
        const firmsData: LegalFirm[] = JSON.parse(fs.readFileSync(firmsJsonPath, 'utf-8'));
        if (firmsData.length > 0) {
          await FirmModel.insertMany(firmsData);
          console.log(`🍃 Seeded ${firmsData.length} legal firms into 'firms' collection from ${firmsJsonPath}.`);
        }
      }
    } catch (e: any) {
      console.error('Error seeding firms into MongoDB:', e.message);
    }
  }

  private async seedDefaultAdmin() {
    try {
      const adminUsername = (process.env.ADMIN_USERNAME || 'soham arora').trim().toLowerCase();
      const adminPassword = process.env.ADMIN_PASSWORD || 'easypeasy';

      const existingAdmin = await UserModel.findOne({ username: adminUsername });
      if (!existingAdmin) {
        const passwordHash = bcrypt.hashSync(adminPassword, 10);
        await UserModel.create({
          id: 'admin_1',
          username: adminUsername,
          passwordHash,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });
        console.log(`🍃 Default admin seeded in MongoDB: ${adminUsername}`);
      }
    } catch (e: any) {
      console.error('Error seeding default admin:', e.message);
    }
  }

  private async seedScraperStats() {
    try {
      const stats = await ScraperStatsModel.findOne({ key: 'global_stats' });
      if (!stats) {
        const total = await OpportunityModel.countDocuments();
        const lbCount = await OpportunityModel.countDocuments({ source: 'lawbhoomi' });
        const lcCount = await OpportunityModel.countDocuments({ source: 'lawctopus' });
        await ScraperStatsModel.create({
          key: 'global_stats',
          lastScrapedAt: new Date().toISOString(),
          totalScraped: total,
          lawbhoomiCount: lbCount,
          lawctopusCount: lcCount,
          status: 'idle',
        });
      }
    } catch (e: any) {
      console.error('Error seeding scraper stats:', e.message);
    }
  }

  // --- Users ---
  public async getUsers(): Promise<User[]> {
    return UserModel.find({}, { _id: 0, __v: 0 }).lean();
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    return UserModel.findOne(
      { username: username.trim().toLowerCase() },
      { _id: 0, __v: 0 }
    ).lean();
  }

  public async getUserById(id: string): Promise<User | null> {
    return UserModel.findOne({ id }, { _id: 0, __v: 0 }).lean();
  }

  public async addUser(user: User): Promise<User> {
    const created = await UserModel.create(user);
    return created.toObject();
  }

  public async updateUserPassword(userId: string, newHash: string): Promise<boolean> {
    const res = await UserModel.updateOne({ id: userId }, { $set: { passwordHash: newHash } });
    return res.matchedCount > 0;
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const res = await UserModel.deleteOne({ id: userId });
    return res.deletedCount > 0;
  }

  // --- Firms ---
  public async getFirms(): Promise<LegalFirm[]> {
    return FirmModel.find({}, { _id: 0, __v: 0 }).lean();
  }

  // --- Opportunities ---
  public async getOpportunities(): Promise<Opportunity[]> {
    return OpportunityModel.find({}, { _id: 0, __v: 0 })
      .sort({ publishedAt: -1, scrapedAt: -1 })
      .lean();
  }

  public async upsertOpportunities(newItems: Opportunity[]): Promise<{ added: number; updated: number }> {
    if (!newItems || newItems.length === 0) return { added: 0, updated: 0 };

    let added = 0;
    let updated = 0;

    const bulkOps = newItems.map(item => ({
      updateOne: {
        filter: { externalId: item.externalId },
        update: {
          $set: {
            source: item.source,
            title: item.title,
            company: item.company,
            location: item.location,
            mode: item.mode,
            stipend: item.stipend,
            applyUrl: item.applyUrl,
            applyEmail: item.applyEmail,
            description: item.description,
            tags: item.tags,
            scrapedAt: new Date().toISOString(),
          },
          $setOnInsert: {
            id: item.id,
            externalId: item.externalId,
            publishedAt: item.publishedAt || new Date().toISOString(),
          }
        },
        upsert: true
      }
    }));

    const result = await OpportunityModel.bulkWrite(bulkOps);
    added = result.upsertedCount;
    updated = result.modifiedCount;

    // Refresh scraper stats directly from native collection counts
    const total = await OpportunityModel.countDocuments();
    const lbCount = await OpportunityModel.countDocuments({ source: 'lawbhoomi' });
    const lcCount = await OpportunityModel.countDocuments({ source: 'lawctopus' });

    await ScraperStatsModel.updateOne(
      { key: 'global_stats' },
      {
        $set: {
          lastScrapedAt: new Date().toISOString(),
          totalScraped: total,
          lawbhoomiCount: lbCount,
          lawctopusCount: lcCount,
          status: 'idle',
        }
      },
      { upsert: true }
    );

    return { added, updated };
  }

  public async getScraperStats(): Promise<ScraperStats> {
    const stats = await ScraperStatsModel.findOne({ key: 'global_stats' }, { _id: 0, __v: 0, key: 0 }).lean();
    if (stats) return stats as ScraperStats;

    const total = await OpportunityModel.countDocuments();
    const lbCount = await OpportunityModel.countDocuments({ source: 'lawbhoomi' });
    const lcCount = await OpportunityModel.countDocuments({ source: 'lawctopus' });
    return {
      lastScrapedAt: null,
      totalScraped: total,
      lawbhoomiCount: lbCount,
      lawctopusCount: lcCount,
      status: 'idle'
    };
  }

  public async setScraperStatus(status: 'idle' | 'running' | 'error', errorMsg?: string): Promise<void> {
    const update: any = { status };
    if (errorMsg !== undefined) update.lastError = errorMsg;
    await ScraperStatsModel.updateOne({ key: 'global_stats' }, { $set: update }, { upsert: true });
  }

  // --- Applications (Tracking Board) ---
  public async getApplications(userId: string): Promise<Application[]> {
    return ApplicationModel.find({ userId }, { _id: 0, __v: 0 })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();
  }

  public async addApplication(app: Application): Promise<Application> {
    const created = await ApplicationModel.create(app);
    return created.toObject();
  }

  public async updateApplication(id: string, userId: string, updates: Partial<Application>): Promise<Application | null> {
    const updated = await ApplicationModel.findOneAndUpdate(
      { id, userId },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { new: true, projection: { _id: 0, __v: 0 } }
    ).lean();
    return updated;
  }

  public async deleteApplication(id: string, userId: string): Promise<boolean> {
    const res = await ApplicationModel.deleteOne({ id, userId });
    return res.deletedCount > 0;
  }

  // --- Candidate Profile ---
  public async getProfile(userId: string): Promise<CandidateProfile> {
    let p = await ProfileModel.findOne({ userId }, { _id: 0, __v: 0 }).lean();
    if (!p) {
      const defaultProfile: CandidateProfile = {
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
      await ProfileModel.create(defaultProfile);
      return defaultProfile;
    }
    return p as CandidateProfile;
  }

  public async updateProfile(userId: string, updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    const updated = await ProfileModel.findOneAndUpdate(
      { userId },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { new: true, upsert: true, projection: { _id: 0, __v: 0 } }
    ).lean();
    return updated as CandidateProfile;
  }
}

export const db = new MongoDatabase();
