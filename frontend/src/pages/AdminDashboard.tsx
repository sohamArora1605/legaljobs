import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Key, UserPlus, Trash2, RefreshCw, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { User as UserType } from '../types';
import { API_BASE } from '../config';

interface AdminDashboardProps {
  token: string | null;
  onRefreshStats?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [resetModalUser, setResetModalUser] = useState<UserType | null>(null);
  const [resetNewPass, setResetNewPass] = useState('');

  const [shareText, setShareText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [scraperLoading, setScraperLoading] = useState(false);
  const [scraperResult, setScraperResult] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setMsg({ type: 'error', text: 'Failed to load user roster.' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword, role })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: `User "${newUsername}" created successfully!` });
        setShareText(`🏛️ LegalJobs Portal Access\nUsername: ${newUsername}\nPassword: ${newPassword}\nURL: http://localhost:5173`);
        setNewUsername('');
        setNewPassword('');
        fetchUsers();
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to create user' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to reach server' });
    }
  };

  const handleResetPassword = async () => {
    if (!resetModalUser || !resetNewPass) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${resetModalUser.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: resetNewPass })
      });
      if (res.ok) {
        setMsg({ type: 'success', text: `Password updated for ${resetModalUser.username}` });
        setShareText(`🏛️ LegalJobs Password Updated\nUser: ${resetModalUser.username}\nNew Password: ${resetNewPass}`);
        setResetModalUser(null);
        setResetNewPass('');
      } else {
        setMsg({ type: 'error', text: 'Failed to update password' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error contacting server' });
    }
  };

  const handleDeleteUser = async (user: UserType) => {
    if (user.username === 'soham arora') {
      alert('Master admin account cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to remove user "${user.username}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMsg({ type: 'success', text: `User ${user.username} deleted.` });
        fetchUsers();
      } else {
        setMsg({ type: 'error', text: 'Failed to delete user' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error deleting user' });
    }
  };

  const triggerScrapeNow = async () => {
    setScraperLoading(true);
    setScraperResult(null);
    try {
      const res = await fetch(`${API_BASE}/admin/scrape`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setScraperResult(`Scrape Cycle Finished: ${data.itemsFound} items aggregated across LawBhoomi & Lawctopus.`);
      } else {
        setScraperResult('Scraper failed to execute.');
      }
    } catch {
      setScraperResult('Scrape trigger network failure.');
    } finally {
      setScraperLoading(false);
    }
  };

  const copyShareText = () => {
    if (!shareText) return;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="responsive-container space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#2d3748] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold font-serif text-white tracking-wide">
              Principal Administration
            </h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Master Console for user provisioning, password overrides, and ingestion orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerScrapeNow}
            disabled={scraperLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-semibold rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${scraperLoading ? 'animate-spin' : ''}`} />
            {scraperLoading ? 'Polling Portals...' : 'Trigger Scraper Now'}
          </button>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          msg.type === 'success' ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-300' : 'bg-red-950/50 border border-red-500/50 text-red-300'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {scraperResult && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-300 flex items-center gap-3">
          <Terminal className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-mono">{scraperResult}</span>
        </div>
      )}

      {/* Share Credentials Alert */}
      {shareText && (
        <div className="p-4 rounded-xl bg-[#1e293b] border-2 border-amber-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <Key className="w-4 h-4" /> Ready to Share Credentials
            </span>
            <button
              onClick={copyShareText}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Credentials'}
            </button>
          </div>
          <pre className="text-xs bg-[#0b0f19] p-3 rounded font-mono text-gray-300 whitespace-pre-wrap">
            {shareText}
          </pre>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="bg-[#121826] border border-[#232f48] rounded-xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-2 text-white font-serif font-bold text-lg mb-4">
            <UserPlus className="w-5 h-5 text-amber-500" />
            Provision New User
          </div>
          <p className="text-xs text-gray-400 mb-5">
            Create an account with direct credentials. You can immediately copy and share them with the user.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. advocate_rahul"
                required
                className="w-full bg-[#0b0f19] border border-[#2d3748] focus:border-amber-500 text-white rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Initial Password
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="e.g. legal2026"
                required
                className="w-full bg-[#0b0f19] border border-[#2d3748] focus:border-amber-500 text-white rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Permission Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                className="w-full bg-[#0b0f19] border border-[#2d3748] focus:border-amber-500 text-white rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              >
                <option value="user">Standard Candidate (User)</option>
                <option value="admin">Principal Authority (Admin)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-lg text-sm transition-all shadow-lg"
            >
              Generate User Account
            </button>
          </form>
        </div>

        {/* Existing Users Table */}
        <div className="lg:col-span-2 bg-[#121826] border border-[#232f48] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <User className="w-5 h-5 text-amber-500" />
              Authorized User Accounts ({users.length})
            </div>
            <button
              onClick={fetchUsers}
              className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0b0f19] text-xs uppercase font-semibold text-gray-400 border-b border-[#232f48]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#1a2234] transition-colors">
                      <td className="px-4 py-3.5 font-medium text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{u.username}</span>
                          {u.username === 'soham arora' && (
                            <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                              Principal
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setResetNewPass('');
                          }}
                          className="px-2.5 py-1 text-xs bg-[#243048] hover:bg-amber-500 hover:text-black text-gray-200 font-medium rounded transition-all inline-flex items-center gap-1"
                        >
                          <Key className="w-3 h-3" /> Reset Pass
                        </button>
                        {u.username !== 'soham arora' && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="px-2.5 py-1 text-xs bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white font-medium rounded transition-all inline-flex items-center gap-1 border border-red-500/30"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121826] border-2 border-amber-500/40 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              Reset Password for: <span className="text-amber-400">{resetModalUser.username}</span>
            </h3>
            <p className="text-xs text-gray-400">
              The administrator has direct override control. Input the new password below:
            </p>
            <input
              type="text"
              value={resetNewPass}
              onChange={(e) => setResetNewPass(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#0b0f19] border border-[#2d3748] focus:border-amber-500 text-white rounded-lg px-3.5 py-2.5 text-sm outline-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setResetModalUser(null)}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={!resetNewPass}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black disabled:opacity-50 transition-all"
              >
                Confirm & Overwrite Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
