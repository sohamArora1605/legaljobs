import React from 'react';
import { Scale, Building2, Globe, Kanban, UserCheck, ShieldAlert, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentTab: 'directory' | 'aggregator' | 'tracker' | 'profile' | 'admin';
  setCurrentTab: (tab: 'directory' | 'aggregator' | 'tracker' | 'profile' | 'admin') => void;
  session: UserSession;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, session, onLogout, theme, onToggleTheme }) => {
  return (
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
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setCurrentTab('directory')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070a12',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)'
        }}>
          <Scale size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-serif gold-gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px' }}>
            LEGALJOBS
          </span>
          <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.8px', marginTop: '-2px' }}>
            PREMIUM INTERNSHIP PORTAL
          </span>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setCurrentTab('directory')}
          style={{
            background: currentTab === 'directory' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            color: currentTab === 'directory' ? '#facc15' : '#94a3b8',
            border: currentTab === 'directory' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <Building2 size={16} />
          <span>100 Legal Firms</span>
        </button>

        <button
          onClick={() => setCurrentTab('aggregator')}
          style={{
            background: currentTab === 'aggregator' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            color: currentTab === 'aggregator' ? '#facc15' : '#94a3b8',
            border: currentTab === 'aggregator' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <Globe size={16} />
          <span>Live Feed (LawBhoomi & Lawctopus)</span>
        </button>

        <button
          onClick={() => setCurrentTab('tracker')}
          style={{
            background: currentTab === 'tracker' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            color: currentTab === 'tracker' ? '#facc15' : '#94a3b8',
            border: currentTab === 'tracker' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <Kanban size={16} />
          <span>Tracking Board</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          style={{
            background: currentTab === 'profile' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            color: currentTab === 'profile' ? '#facc15' : '#94a3b8',
            border: currentTab === 'profile' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.2s'
          }}
        >
          <UserCheck size={16} />
          <span>Autofill Profile</span>
        </button>

        {session.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('admin')}
            style={{
              background: currentTab === 'admin' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.08)',
              color: currentTab === 'admin' ? '#fb7185' : '#fda4af',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s'
            }}
          >
            <ShieldAlert size={16} />
            <span>Admin Suite</span>
          </button>
        )}
      </nav>

      {/* Theme Toggle & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
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

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <span>{session.username}</span>
            {session.role === 'admin' && (
              <span style={{ fontSize: '0.65rem', background: '#e11d48', color: '#fff', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                Admin
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Single-User Workspace</div>
        </div>

        <button
          onClick={onLogout}
          title="Sign Out"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
