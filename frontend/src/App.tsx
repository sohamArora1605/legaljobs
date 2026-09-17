import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FirmsDirectory } from './pages/FirmsDirectory';
import { AggregatorFeed } from './pages/AggregatorFeed';
import { TrackingBoard } from './pages/TrackingBoard';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { EmailTemplateModal } from './components/EmailTemplateModal';
import { PortalVerifyModal } from './components/PortalVerifyModal';
import { AddCustomJobModal } from './components/AddCustomJobModal';
import { Sun, Moon } from 'lucide-react';
import { LegalFirm, Opportunity, Application, CandidateProfile, UserSession, User } from './types';
import { API_BASE } from './config';

function App() {
  const [currentTab, setCurrentTab] = useState<'directory' | 'aggregator' | 'tracker' | 'profile' | 'admin' | 'auth'>('directory');
  const [session, setSession] = useState<UserSession | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('legaljobs_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('legaljobs_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Core data states
  const [firms, setFirms] = useState<LegalFirm[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [scraperStats, setScraperStats] = useState<{ count: number; lastScrapedAt: string | null }>({ count: 0, lastScrapedAt: null });

  // Modals state
  const [emailModalFirm, setEmailModalFirm] = useState<LegalFirm | null>(null);
  const [portalModalFirm, setPortalModalFirm] = useState<LegalFirm | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('legaljobs_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('legaljobs_session');
      }
    }
  }, []);

  // Fetch initial public data (Firms & Opportunities)
  useEffect(() => {
    const loadFirms = async () => {
      try {
        const res = await fetch(`${API_BASE}/firms`);
        if (res.ok) {
          const data = await res.json();
          setFirms(data);
        }
      } catch (e) {
        console.error('Error fetching firms:', e);
      }
    };

    const loadOpportunities = async () => {
      try {
        const res = await fetch(`${API_BASE}/opportunities`);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
          setScraperStats({ count: data.length, lastScrapedAt: data[0]?.scrapedAt || null });
        }
      } catch (e) {
        console.error('Error fetching opportunities:', e);
      }
    };

    loadFirms();
    loadOpportunities();
  }, []);

  // Fetch authenticated user data (Tracking board & Profile)
  const loadUserData = useCallback(async (token: string) => {
    try {
      const [appsRes, profRes] = await Promise.all([
        fetch(`${API_BASE}/tracking`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (appsRes.ok) {
        const apps = await appsRes.json();
        setApplications(apps);
      }

      if (profRes.ok) {
        const prof = await profRes.json();
        setProfile(prof);
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  }, []);

  useEffect(() => {
    if (session?.token) {
      loadUserData(session.token);
    } else {
      setApplications([]);
      setProfile(null);
    }
  }, [session, loadUserData]);

  const handleLoginSuccess = (user: User, token: string) => {
    const newSession: UserSession = {
      id: user.id,
      username: user.username,
      role: user.role,
      token
    };
    setSession(newSession);
    localStorage.setItem('legaljobs_session', JSON.stringify(newSession));
    setCurrentTab(user.role === 'admin' ? 'admin' : 'tracker');
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('legaljobs_session');
    setCurrentTab('directory');
  };

  const handleAddToTrackerFromFirm = async (firm: LegalFirm) => {
    if (!session) {
      setCurrentTab('auth');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({
          companyName: firm.name,
          roleTitle: 'Legal Intern',
          status: 'applied',
          source: 'directory',
          location: firm.location,
          portalUrl: firm.internship_url || firm.career_url || firm.website,
          contactEmail: firm.application_email || undefined,
          notes: `Applied via ${firm.modality} (${firm.tier})`
        })
      });
      if (res.ok) {
        const newApp = await res.json();
        setApplications(prev => [newApp, ...prev]);
        alert(`Saved "${firm.name}" to your Tracking Board!`);
      }
    } catch {
      alert('Failed to save to tracker.');
    }
  };

  const handleAddToTrackerFromOpportunity = async (opp: Opportunity) => {
    if (!session) {
      setCurrentTab('auth');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({
          companyName: opp.company,
          roleTitle: opp.title,
          opportunityId: opp.id,
          status: 'saved',
          source: opp.source,
          location: opp.location,
          portalUrl: opp.applyUrl,
          contactEmail: opp.applyEmail || undefined,
          notes: `Added from ${opp.source} feed`
        })
      });
      if (res.ok) {
        const newApp = await res.json();
        setApplications(prev => [newApp, ...prev]);
        alert(`Saved "${opp.company}" to your Tracking Board!`);
      }
    } catch {
      alert('Failed to save to tracker.');
    }
  };

  const handleUpdateAppStatus = async (id: string, newStatus: Application['status']) => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/tracking/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      }
    } catch (e) {
      console.error('Failed to update application status:', e);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/tracking/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` }
      });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete application:', e);
    }
  };

  const handleAddCustomApp = async (appData: Partial<Application>) => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(appData)
      });
      if (res.ok) {
        const created = await res.json();
        setApplications(prev => [created, ...prev]);
      }
    } catch (e) {
      console.error('Failed to add custom job:', e);
    }
  };

  const handleSaveProfile = async (profileData: Partial<CandidateProfile>) => {
    if (!session) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
      }
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  const handleRefreshScraper = async () => {
    setIsScraping(true);
    try {
      const endpoint = session ? `${API_BASE}/admin/scrape` : `${API_BASE}/opportunities/scrape`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers
      });

      if (res.ok) {
        const oppRes = await fetch(`${API_BASE}/opportunities`);
        if (oppRes.ok) {
          const data = await oppRes.json();
          setOpportunities(data);
          setScraperStats({ count: data.length, lastScrapedAt: new Date().toISOString() });
        }
      }
    } catch (e) {
      console.error('Error refreshing scraper:', e);
    } finally {
      setIsScraping(false);
    }
  };

  const appliedFirmNames = new Set(applications.map(a => a.companyName));
  const trackedExternalIds = new Set(applications.filter(a => a.opportunityId).map(a => a.opportunityId as string));

  const activeProfile: CandidateProfile = profile || {
    userId: session?.id || 'guest',
    fullName: '',
    email: '',
    phone: '',
    college: 'National Law School / University',
    degree: 'B.A. LL.B. (Hons.)',
    yearOfStudy: '4th Year',
    passingYear: '2027',
    cgpa: '8.5 / 10',
    preferredPractice: 'Corporate & M&A, Commercial Litigation',
    preferredLocation: 'Bengaluru',
    availability: 'May – July 2026',
    linkedIn: 'https://linkedin.com/in/',
    coverLetterTemplate: `Dear Recruitment Team,\n\nI am writing to apply for a legal internship at {firm_name} in {location} for {availability}.\n\nI am currently a {year} student pursuing {degree} at {college}, with a CGPA of {cgpa}. My primary interests lie in {practice_area}.\n\nThank you for considering my application.\n\nSincerely,\n{full_name}\n{phone} | {email}`,
    resumePath: 'C:\\Users\\Candidate\\Documents\\LegalResume.pdf',
    achievements: 'Moot Court Semi-finalist; Published 2 articles on commercial law',
    updatedAt: new Date().toISOString()
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {session ? (
        <Navbar
          currentTab={currentTab === 'auth' ? 'directory' : currentTab}
          setCurrentTab={(tab) => setCurrentTab(tab)}
          session={session}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <header style={{
          backgroundColor: 'var(--bg-header)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-gold)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setCurrentTab('directory')}>
            <span className="font-serif gold-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px' }}>
              LEGALJOBS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setCurrentTab('directory')}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: currentTab === 'directory' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              100 Law Firms
            </button>
            <button
              onClick={() => setCurrentTab('aggregator')}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                fontWeight: currentTab === 'aggregator' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Live Feed
            </button>

            {/* Theme Toggle Button in Public Header */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-gold)',
                color: theme === 'dark' ? '#facc15' : '#b45309',
                borderRadius: '8px',
                padding: '0.45rem 0.65rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                transition: 'all 0.2s'
              }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('auth')}
              className="btn-gold"
              style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
            >
              Sign In to Chambers
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 w-full mx-auto">
        {currentTab === 'auth' && (
          <AuthPage
            onSuccess={handleLoginSuccess}
            onBackToPortal={() => setCurrentTab('directory')}
          />
        )}

        {currentTab === 'directory' && (
          <FirmsDirectory
            firms={firms}
            profile={activeProfile}
            onOpenEmailModal={(firm) => setEmailModalFirm(firm)}
            onOpenPortalModal={(firm) => setPortalModalFirm(firm)}
            onAddToTracker={handleAddToTrackerFromFirm}
            appliedFirmNames={appliedFirmNames}
          />
        )}

        {currentTab === 'aggregator' && (
          <AggregatorFeed
            opportunities={opportunities}
            onAddToTracker={handleAddToTrackerFromOpportunity}
            onRefreshScraper={handleRefreshScraper}
            isScraping={isScraping}
            trackedExternalIds={trackedExternalIds}
            scraperStats={scraperStats}
            isAdmin={session?.role === 'admin'}
          />
        )}

        {currentTab === 'tracker' && (
          <TrackingBoard
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
            onDeleteApplication={handleDeleteApp}
            onOpenAddModal={() => setIsAddCustomOpen(true)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            profile={activeProfile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard token={session?.token || null} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-secondary)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>&copy; {new Date().getFullYear()} LegalJobs &mdash; Premier Indian Legal Internship & Chambers Platform.</span>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>Tailored for Bangalore & National Chambers</span>
        </div>
      </footer>

      {/* Modals */}
      {emailModalFirm && (
        <EmailTemplateModal
          firm={emailModalFirm}
          profile={activeProfile}
          onClose={() => setEmailModalFirm(null)}
        />
      )}

      {portalModalFirm && (
        <PortalVerifyModal
          firm={portalModalFirm}
          onClose={() => setPortalModalFirm(null)}
        />
      )}

      {isAddCustomOpen && (
        <AddCustomJobModal
          onClose={() => setIsAddCustomOpen(false)}
          onAdd={handleAddCustomApp}
        />
      )}
    </div>
  );
}

export default App;
