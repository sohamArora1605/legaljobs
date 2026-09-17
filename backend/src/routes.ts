import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, User, Application } from './models/db.js';
import { authenticate, requireAdmin, AuthRequest } from './middleware/auth.js';
import { runScrapers } from './scrapers/scheduler.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_legaljobs_jwt_key_2026';

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------
router.post('/auth/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const cleanUsername = typeof username === 'string' ? username.trim() : '';
  const cleanPassword = typeof password === 'string' ? password.trim() : '';

  const user = db.getUserByUsername(cleanUsername);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const isMatch = bcrypt.compareSync(cleanPassword, user.passwordHash) || bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

router.get('/auth/me', authenticate, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthenticated' });
    return;
  }
  const user = db.getUserById(req.user.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
  });
});

// -----------------------------------------------------------------------------
// LEGAL FIRMS (100 Directory)
// -----------------------------------------------------------------------------
router.get('/firms', (_req: Request, res: Response): void => {
  const firms = db.getFirms();
  res.json(firms);
});

// -----------------------------------------------------------------------------
// OPPORTUNITIES (Scraped from LawBhoomi & Lawctopus)
// -----------------------------------------------------------------------------
router.get('/opportunities', (req: Request, res: Response): void => {
  const opportunities = db.getOpportunities();
  const stats = db.getScraperStats();
  if (req.query.withStats === 'true') {
    res.json({ opportunities, stats });
  } else {
    res.json(opportunities);
  }
});

router.post('/opportunities/scrape', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await runScrapers();
    res.json({
      message: 'Scraping cycle executed successfully (Top 3 pages polled)',
      ...result,
      stats: db.getScraperStats(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Scraper failed' });
  }
});

router.post('/admin/scrape', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await runScrapers();
    res.json({
      message: 'Scraping cycle executed successfully (Top 3 pages polled)',
      ...result,
      stats: db.getScraperStats(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Scraper failed' });
  }
});

// -----------------------------------------------------------------------------
// TRACKING BOARD (Personal Applications)
// -----------------------------------------------------------------------------
router.get('/tracker', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const applications = db.getApplications(userId);
  res.json(applications);
});

router.post('/tracker', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const {
    companyName,
    roleTitle,
    location,
    status = 'saved',
    source = 'outsourced',
    opportunityId,
    appliedDate,
    deadline,
    notes,
    contactEmail,
    portalUrl,
  } = req.body;

  if (!companyName) {
    res.status(400).json({ error: 'Company name is required' });
    return;
  }

  const newApp: Application = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    companyName,
    roleTitle: roleTitle || 'Legal Intern',
    location: location || 'Bengaluru',
    status,
    source,
    opportunityId,
    appliedDate: appliedDate || (status === 'applied' ? new Date().toISOString().split('T')[0] : undefined),
    deadline,
    notes,
    contactEmail,
    portalUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = db.addApplication(newApp);
  res.status(201).json(saved);
});

router.put('/tracker/:id', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const { id } = req.params;
  const updated = db.updateApplication(id, userId, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Application entry not found' });
    return;
  }
  res.json(updated);
});

router.delete('/tracker/:id', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const { id } = req.params;
  const success = db.deleteApplication(id, userId);
  if (!success) {
    res.status(404).json({ error: 'Application entry not found' });
    return;
  }
  res.json({ message: 'Application deleted successfully' });
});

// -----------------------------------------------------------------------------
// CANDIDATE PROFILE (Used for Web & Extension Autofill)
// -----------------------------------------------------------------------------
router.get('/profile', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const profile = db.getProfile(userId);
  res.json(profile);
});

router.put('/profile', authenticate, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;
  const updated = db.updateProfile(userId, req.body);
  res.json(updated);
});

// Extension login authentication & profile retrieval
router.post('/extension/login', (req: Request, res: Response): void => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const user = db.getUserByUsername(username);
  if (!user) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  const profile = db.getProfile(user.id);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    profile
  });
});

// Authenticated or public profile sync for extension using API token
router.get('/extension/profile', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in through the extension popup.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const profile = db.getProfile(decoded.id);
    res.json(profile);
  } catch (e) {
    res.status(401).json({ error: 'Invalid extension token. Please log in again.' });
  }
});

// -----------------------------------------------------------------------------
// ADMIN SUITE (User & System Management)
// -----------------------------------------------------------------------------
router.get('/admin/users', authenticate, requireAdmin, (_req: AuthRequest, res: Response): void => {
  const users = db.getUsers().map((u: User) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.createdAt,
  }));
  res.json(users);
});

router.post('/admin/users', authenticate, requireAdmin, (req: AuthRequest, res: Response): void => {
  const { username, password, role = 'user' } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const existing = db.getUserByUsername(username);
  if (existing) {
    res.status(400).json({ error: 'Username already exists' });
    return;
  }

  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: username.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: role === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };

  db.addUser(newUser);
  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    createdAt: newUser.createdAt,
  });
});

router.put('/admin/users/:id/password', authenticate, requireAdmin, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    res.status(400).json({ error: 'Password must be at least 4 characters long' });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  const success = db.updateUserPassword(id, newHash);
  if (!success) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ message: 'Password updated successfully' });
});

router.delete('/admin/users/:id', authenticate, requireAdmin, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const user = db.getUserById(id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (user.username.toLowerCase() === 'soham arora') {
    res.status(400).json({ error: 'Cannot delete default primary admin account' });
    return;
  }

  db.deleteUser(id);
  res.json({ message: 'User deleted successfully' });
});

export default router;
