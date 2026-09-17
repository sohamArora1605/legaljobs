import React, { useState } from 'react';
import { Scale, Lock, User, KeyRound, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { API_BASE } from '../config';

interface AuthPageProps {
  onSuccess: (user: UserType, token: string) => void;
  onBackToPortal: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onBackToPortal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data.user, data.token);
      } else {
        setError(data.message || data.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch {
      setError('Unable to reach authentication server on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 animate-fade">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Return to Public Directory</span>
        </button>

        {/* Card */}
        <div className="glass-card" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '16px',
          padding: '1.75rem 1.5rem',
          boxShadow: 'var(--shadow-modal)'
        }}>
          <div className="text-center mb-8">
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 83, 9, 0.1) 100%)',
              border: '1px solid var(--border-gold)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)',
              marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)'
            }}>
              <Scale size={28} />
            </div>
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Chambers Sign In
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Access your personalized tracking board, autofill settings & admin controls.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#fca5a5',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="Enter your registered username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.75rem 0.7rem 2.25rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.7rem 0.75rem 0.7rem 2.25rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.9rem' }}
              >
                <KeyRound size={16} />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#94a3b8',
            fontSize: '0.75rem'
          }}>
            <ShieldCheck size={14} color="#d4af37" />
            <span>Encrypted Session with Automated Chrome Extension Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
