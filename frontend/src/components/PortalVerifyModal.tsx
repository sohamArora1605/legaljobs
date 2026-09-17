import React, { useState } from 'react';
import { ExternalLink, Edit3, X, ShieldCheck } from 'lucide-react';
import { LegalFirm } from '../types';

interface PortalVerifyModalProps {
  firm: LegalFirm;
  onClose: () => void;
}

export const PortalVerifyModal: React.FC<PortalVerifyModalProps> = ({ firm, onClose }) => {
  const [url, setUrl] = useState(firm.internship_url || firm.career_url || firm.website);

  const handleLaunch = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade" style={{ maxWidth: '520px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Edit3 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Confirm Application URL
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {firm.name} ({firm.modality.replace('_', ' ')})
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1rem', lineHeight: 1.5 }}>
          You can verify or customize the exact careers page URL below before opening. Once opened, you can click the <strong>LegalJobs Extension</strong> to autofill your form with one click.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
            Destination URL:
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#070a12',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '0.65rem 0.75rem',
              color: '#38bdf8',
              fontSize: '0.85rem'
            }}
          />
        </div>

        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '0.75rem',
          borderRadius: '8px',
          display: 'flex',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#34d399',
          marginBottom: '1.25rem'
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0 }} />
          <span>Form Interaction Note: {firm.button_interaction}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={handleLaunch} className="btn-gold">
            <ExternalLink size={16} />
            <span>Open & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
