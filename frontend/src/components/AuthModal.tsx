import React, { useState } from 'react';
import { Scale, Lock, User, KeyRound, AlertCircle, X } from 'lucide-react';
import { User as UserType } from '../types';
import { API_BASE } from '../config';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Unable to reach backend server. Please verify the API is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#101726] border-2 border-amber-500/40 rounded-2xl w-full max-w-md shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-inner">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-white tracking-wide">
            Chambers Authentication
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Access your personalized tracking board and administrative controls
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. soham arora"
                required
                className="w-full bg-[#0b0f19] border border-[#232f48] focus:border-amber-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0b0f19] border border-[#232f48] focus:border-amber-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg text-sm transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In to Chambers'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1e293b] text-center text-xs text-gray-500">
          Fixed Principal Admin: <code className="text-amber-400/80 bg-[#0b0f19] px-1.5 py-0.5 rounded">soham arora</code>
        </div>
      </div>
    </div>
  );
};
