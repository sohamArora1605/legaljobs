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
  externalId: string;
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

export interface UserSession {
  id: string;
  username: string;
  role: 'admin' | 'user';
  token: string;
}

export type User = {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
};

export type AggregatedJob = Opportunity;
