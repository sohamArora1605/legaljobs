import React, { useState } from 'react';
import { Scale, Building2, Globe, Kanban, UserCheck, ShieldAlert, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'directory' | 'aggregator' | 'tracker' | 'profile' | 'admin') => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header style={{
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-gold)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          onClick={() => handleTabClick('directory')}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#070a12',
            boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)',
            flexShrink: 0
          }}>
            <Scale size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-serif gold-gradient-text" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              LEGALJOBS
            </span>
            <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.6px', marginTop: '-2px' }}>
              CHAMBERS PORTAL
            </span>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="desktop-nav" style={{ alignItems: 'center', gap: '0.45rem' }}>
          <button
            onClick={() => handleTabClick('directory')}
            style={{
              background: currentTab === 'directory' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              border: currentTab === 'directory' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Building2 size={15} />
            <span>100 Legal Firms</span>
          </button>

          <button
            onClick={() => handleTabClick('aggregator')}
            style={{
              background: currentTab === 'aggregator' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              border: currentTab === 'aggregator' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Globe size={15} />
            <span>Live Feed</span>
          </button>

          <button
            onClick={() => handleTabClick('tracker')}
            style={{
              background: currentTab === 'tracker' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: currentTab === 'tracker' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              border: currentTab === 'tracker' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <Kanban size={15} />
            <span>Tracking Board</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            style={{
              background: currentTab === 'profile' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: currentTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              border: currentTab === 'profile' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={15} />
            <span>Autofill Profile</span>
          </button>

          {session.role === 'admin' && (
            <button
              onClick={() => handleTabClick('admin')}
              style={{
                background: currentTab === 'admin' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(244, 63, 94, 0.08)',
                color: currentTab === 'admin' ? '#fb7185' : '#fda4af',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              <ShieldAlert size={15} />
              <span>Admin Suite</span>
            </button>
          )}
        </nav>

        {/* Right Controls: Theme Toggle, User, Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-gold)',
              color: theme === 'dark' ? '#facc15' : '#b45309',
              borderRadius: '8px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              minHeight: '34px',
              transition: 'all 0.2s'
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span className="desktop-nav">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {/* Desktop User Info */}
          <div className="desktop-nav" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              <span>{session.username}</span>
              {session.role === 'admin' && (
                <span style={{ fontSize: '0.6rem', background: '#e11d48', color: '#fff', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Admin
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Chambers Workspace</div>
          </div>

          {/* Sign Out Button (Desktop) */}
          <button
            onClick={onLogout}
            title="Sign Out"
            className="desktop-nav"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '0.45rem',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={15} />
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only"
            aria-label="Toggle navigation menu"
            style={{
              background: mobileMenuOpen ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-gold)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '34px',
              minWidth: '34px'
            }}
          >
            {mobileMenuOpen ? <X size={18} color="var(--gold-primary)" /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu (Appears when Hamburger is tapped) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '56px',
          left: 0,
          right: 0,
          bottom: '62px',
          backgroundColor: 'var(--bg-primary)',
          zIndex: 49,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          overflowY: 'auto',
          borderBottom: '1px solid var(--border-gold)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* User Status Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {session.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {session.role === 'admin' ? 'Principal Administrator' : 'Legal Candidate'}
              </div>
            </div>
            {session.role === 'admin' && (
              <span style={{ fontSize: '0.65rem', background: '#e11d48', color: '#fff', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Admin
              </span>
            )}
          </div>

          <button
            onClick={() => handleTabClick('directory')}
            style={{
              background: currentTab === 'directory' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
              color: currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--text-primary)',
              border: '1px solid ' + (currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--border-color)'),
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            <Building2 size={18} color={currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--text-secondary)'} />
            <span>100 Legal Firms Directory</span>
          </button>

          <button
            onClick={() => handleTabClick('aggregator')}
            style={{
              background: currentTab === 'aggregator' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
              color: currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--text-primary)',
              border: '1px solid ' + (currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--border-color)'),
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            <Globe size={18} color={currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--text-secondary)'} />
            <span>Live Feed (LawBhoomi & Lawctopus)</span>
          </button>

          <button
            onClick={() => handleTabClick('tracker')}
            style={{
              background: currentTab === 'tracker' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
              color: currentTab === 'tracker' ? 'var(--gold-primary)' : 'var(--text-primary)',
              border: '1px solid ' + (currentTab === 'tracker' ? 'var(--gold-primary)' : 'var(--border-color)'),
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            <Kanban size={18} color={currentTab === 'tracker' ? 'var(--gold-primary)' : 'var(--text-secondary)'} />
            <span>Personal Tracking Board</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            style={{
              background: currentTab === 'profile' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
              color: currentTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-primary)',
              border: '1px solid ' + (currentTab === 'profile' ? 'var(--gold-primary)' : 'var(--border-color)'),
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            <UserCheck size={18} color={currentTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-secondary)'} />
            <span>Autofill Profile & Resume</span>
          </button>

          {session.role === 'admin' && (
            <button
              onClick={() => handleTabClick('admin')}
              style={{
                background: currentTab === 'admin' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(244, 63, 94, 0.08)',
                color: '#fb7185',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                textAlign: 'left'
              }}
            >
              <ShieldAlert size={18} />
              <span>Admin Suite & Provisioning</span>
            </button>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 700
              }}
            >
              <LogOut size={16} />
              <span>Sign Out of Chambers</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Ultra-responsive thumb navigation) */}
      <nav className="mobile-bottom-nav">
        <button
          onClick={() => handleTabClick('directory')}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentTab === 'directory' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.65rem',
            fontWeight: currentTab === 'directory' ? 700 : 500,
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          <Building2 size={18} />
          <span>Firms</span>
        </button>

        <button
          onClick={() => handleTabClick('aggregator')}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentTab === 'aggregator' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.65rem',
            fontWeight: currentTab === 'aggregator' ? 700 : 500,
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          <Globe size={18} />
          <span>Feed</span>
        </button>

        <button
          onClick={() => handleTabClick('tracker')}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentTab === 'tracker' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.65rem',
            fontWeight: currentTab === 'tracker' ? 700 : 500,
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          <Kanban size={18} />
          <span>Tracker</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentTab === 'profile' ? 'var(--gold-primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            fontSize: '0.65rem',
            fontWeight: currentTab === 'profile' ? 700 : 500,
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          <UserCheck size={18} />
          <span>Profile</span>
        </button>

        {session.role === 'admin' && (
          <button
            onClick={() => handleTabClick('admin')}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentTab === 'admin' ? '#fb7185' : 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              fontSize: '0.65rem',
              fontWeight: currentTab === 'admin' ? 700 : 500,
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            <ShieldAlert size={18} />
            <span>Admin</span>
          </button>
        )}
      </nav>
    </>
  );
};
