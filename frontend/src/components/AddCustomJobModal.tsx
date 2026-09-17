import React, { useState } from 'react';
import { PlusCircle, X, Building, MapPin, Calendar, Link as LinkIcon, Mail } from 'lucide-react';
import { Application } from '../types';

interface AddCustomJobModalProps {
  onClose: () => void;
  onAdd: (app: Partial<Application>) => void;
}

export const AddCustomJobModal: React.FC<AddCustomJobModalProps> = ({ onClose, onAdd }) => {
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Legal Intern');
  const [location, setLocation] = useState('Bengaluru');
  const [status, setStatus] = useState<Application['status']>('applied');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onAdd({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      location: location.trim(),
      status,
      source: 'outsourced',
      appliedDate: status === 'applied' ? appliedDate : undefined,
      deadline: deadline || undefined,
      contactEmail: contactEmail.trim() || undefined,
      portalUrl: portalUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade" style={{ maxWidth: '560px' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <PlusCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Add Outsourced / External Application
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Track any legal internship applied via email, LinkedIn, or referral
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Firm / Organization / Chamber Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chambers of Senior Advocate..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070a12',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.6rem 0.75rem',
                color: '#f8fafc',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div className="responsive-form-grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Role / Title
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div className="responsive-form-grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              >
                <option value="saved">Saved / Considering</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview Scheduled</option>
                <option value="offer">Offer Received</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Date Applied
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div className="responsive-form-grid-2" style={{ gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Contact / HR Email
              </label>
              <input
                type="email"
                placeholder="contact@lawfirm.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Portal / Careers URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#070a12',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '0.6rem 0.75rem',
                  color: '#f8fafc',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
              Notes & Follow-up Details
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Reached out via Partner referral, follow up on 25th..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#070a12',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.6rem 0.75rem',
                color: '#f8fafc',
                fontSize: '0.85rem',
                lineHeight: 1.4
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-gold">
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
