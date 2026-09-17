import React, { useState } from 'react';
import { UserCheck, Save, Copy, Check, FileText, Briefcase, GraduationCap, MapPin, Sparkles, Upload, Download, Trash2 } from 'lucide-react';
import { CandidateProfile } from '../types';

interface ProfilePageProps {
  profile: CandidateProfile;
  onSaveProfile: (profile: Partial<CandidateProfile>) => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveProfile(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 5MB max for lightweight JSON DB
    if (file.size > 5 * 1024 * 1024) {
      alert('Resume file size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name,
        resumeFileSize: file.size,
        resumeBase64: base64,
        resumePath: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setFormData(prev => ({
      ...prev,
      resumeFileName: undefined,
      resumeFileSize: undefined,
      resumeBase64: undefined
    }));
  };

  const copyExtensionConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 3000);
  };

  return (
    <div className="responsive-container" style={{ maxWidth: '1000px' }}>
      {/* Header Banner */}
      <div className="responsive-banner">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#facc15', marginBottom: '0.5rem' }}>
            <UserCheck size={14} /> USER-SPECIFIC AUTOFILL SETTINGS
          </div>
          <h1 className="font-serif gold-gradient-text responsive-title">
            Candidate Profile & Extension Engine
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '650px', lineHeight: 1.5 }}>
            Fill and save your personal, academic, and internship details here. When you open the <strong>LegalJobs Chrome Extension</strong>, log in with your username and password to automatically sync these exact details for 1-click form autofill.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
          <button onClick={copyExtensionConfig} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
            {copiedToken ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            <span>{copiedToken ? 'JSON Exported!' : 'Export Profile JSON'}</span>
          </button>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Direct sync available in extension</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Personal Details */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} /> Personal & Contact Info
          </h3>

          <div className="responsive-form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Phone / Mobile *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={e => setFormData({ ...formData, linkedIn: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} /> Law School & Academic Credentials
          </h3>

          <div className="responsive-form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Current Law School / University *</label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Degree Program *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5-Year Integrated B.A. LL.B. (Hons.)"
                value={formData.degree}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Current Year of Study *</label>
              <input
                type="text"
                required
                placeholder="e.g. 4th Year (8th Semester)"
                value={formData.yearOfStudy}
                onChange={e => setFormData({ ...formData, yearOfStudy: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Passing / Graduation Year *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2027"
                value={formData.passingYear}
                onChange={e => setFormData({ ...formData, passingYear: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Current CGPA / Percentage *</label>
              <input
                type="text"
                required
                placeholder="e.g. 8.4 / 10"
                value={formData.cgpa}
                onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Local Resume Path</label>
              <input
                type="text"
                value={formData.resumePath}
                onChange={e => setFormData({ ...formData, resumePath: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Resume Upload & Lightweight Storage */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>
              Candidate Resume Document (Stored in Lightweight Database)
            </label>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
              Upload your CV / Resume (PDF format, max 5MB). The document is stored directly in your profile so you and the extension can retrieve it on any device.
            </p>

            {formData.resumeFileName && formData.resumeBase64 ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={22} color="#34d399" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {formData.resumeFileName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {formData.resumeFileSize ? `${(formData.resumeFileSize / 1024).toFixed(1)} KB` : 'Attached'} • Saved in database
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <a
                    href={formData.resumeBase64}
                    download={formData.resumeFileName}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                border: '2px dashed rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                padding: '1.25rem',
                textAlign: 'center',
                background: 'rgba(10, 15, 29, 0.4)',
                cursor: 'pointer'
              }}>
                <input
                  type="file"
                  id="resumeUploadInput"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="resumeUploadInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <Upload size={24} color="#d4af37" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                    Click here to upload your Resume (PDF / Word)
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Max 5MB • Automatically encoded and stored in your profile
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Practice Preferences */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} /> Internship Preferences & Timeline
          </h3>

          <div className="responsive-form-grid-3">
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Preferred Practice Area</label>
              <input
                type="text"
                placeholder="Corporate & M&A, Disputes"
                value={formData.preferredPractice}
                onChange={e => setFormData({ ...formData, preferredPractice: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Preferred City</label>
              <input
                type="text"
                placeholder="Bengaluru, Mumbai"
                value={formData.preferredLocation}
                onChange={e => setFormData({ ...formData, preferredLocation: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Availability / Months</label>
              <input
                type="text"
                placeholder="e.g. May – July 2026"
                value={formData.availability}
                onChange={e => setFormData({ ...formData, availability: e.target.value })}
                style={{ width: '100%', backgroundColor: '#070a12', border: '1px solid #334155', borderRadius: '6px', padding: '0.6rem 0.75rem', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>

        {/* Cover Letter Template */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} /> Statement of Purpose & Cover Letter Template
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Supported placeholders: <code>{'{firm_name}'}</code>, <code>{'{practice_area}'}</code>, <code>{'{location}'}</code>, <code>{'{availability}'}</code>, <code>{'{year}'}</code>, <code>{'{degree}'}</code>, <code>{'{college}'}</code>, <code>{'{cgpa}'}</code>, <code>{'{full_name}'}</code>, <code>{'{phone}'}</code>, <code>{'{email}'}</code>
          </p>

          <textarea
            rows={10}
            value={formData.coverLetterTemplate}
            onChange={e => setFormData({ ...formData, coverLetterTemplate: e.target.value })}
            style={{
              width: '100%',
              backgroundColor: '#070a12',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.85rem',
              color: '#f8fafc',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {savedSuccess && (
            <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={16} /> Profile synced and saved!
            </span>
          )}

          <button type="submit" disabled={isSaving} className="btn-gold" style={{ padding: '0.75rem 2rem', minWidth: '180px' }}>
            <Save size={16} />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
