import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, AlertTriangle, X } from 'lucide-react';
import { LegalFirm, CandidateProfile } from '../types';

interface EmailTemplateModalProps {
  firm: LegalFirm;
  profile: CandidateProfile;
  onClose: () => void;
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({ firm, profile, onClose }) => {
  const recipientEmail = firm.application_email || 'hr@' + firm.website.replace('https://www.', '').replace('https://', '').replace('/', '');
  
  // Format subject line according to firm instructions if specified, else use standard Tier-1 format
  let subject = `Internship Application | ${profile.college} | ${profile.yearOfStudy} | ${profile.preferredPractice.split(',')[0]} | ${profile.availability}`;
  if (firm.instructions.toLowerCase().includes('subject')) {
    const strictSubjectMatch = firm.instructions.match(/['“]([^'”]+)['”]/);
    if (strictSubjectMatch) {
      subject = strictSubjectMatch[1]
        .replace(/Month Year of internship preference/i, profile.availability)
        .replace(/Location/i, 'Bengaluru')
        .replace(/Year of qualifying/i, profile.passingYear)
        .replace(/Preferred Practice Area/i, profile.preferredPractice.split(',')[0])
        .replace(/College Name/i, profile.college)
        .replace(/Year of Passing/i, profile.passingYear)
        .replace(/Preferred PA/i, profile.preferredPractice.split(',')[0]);
    }
  }

  // Pre-fill body from template
  const initialBody = profile.coverLetterTemplate
    .replace(/{firm_name}/g, firm.name)
    .replace(/{practice_area}/g, profile.preferredPractice)
    .replace(/{location}/g, firm.location.includes('Bengaluru') ? 'Bengaluru' : firm.location.split(',')[0])
    .replace(/{availability}/g, profile.availability)
    .replace(/{year}/g, profile.yearOfStudy)
    .replace(/{degree}/g, profile.degree)
    .replace(/{college}/g, profile.college)
    .replace(/{cgpa}/g, profile.cgpa)
    .replace(/{full_name}/g, profile.fullName)
    .replace(/{phone}/g, profile.phone)
    .replace(/{email}/g, profile.email);

  const [bodyText, setBodyText] = useState(initialBody);
  const [subjectText, setSubjectText] = useState(subject);
  const [copied, setCopied] = useState(false);
  const [openedClient, setOpenedClient] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenGmail = () => {
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, '_blank');
    setOpenedClient(true);
  };

  const handleOpenMailClient = () => {
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
    setOpenedClient(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade" style={{ maxWidth: '640px' }}>
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
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Mail size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              Direct Email Application: {firm.name}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Recruitment desk: <strong style={{ color: '#fbbf24' }}>{recipientEmail}</strong>
            </span>
          </div>
        </div>

        {/* Safety Warning */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '0.75rem',
          borderRadius: '8px',
          display: 'flex',
          gap: '0.6rem',
          fontSize: '0.8rem',
          color: '#fcd34d',
          marginBottom: '1rem',
          lineHeight: 1.4
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Important Rules for this Firm:</strong> {firm.instructions}
            <div style={{ marginTop: '4px', color: '#94a3b8' }}>
              Clicking "Send Mail" will copy your template to clipboard and open your default mail client with recipient and subject pre-filled. <strong>Emails are never sent automatically.</strong>
            </div>
          </div>
        </div>

        {/* Subject Line Input */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
            Email Subject Line:
          </label>
          <input
            type="text"
            value={subjectText}
            onChange={(e) => setSubjectText(e.target.value)}
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

        {/* Email Body Textarea */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
            Personalized Cover Letter / Email Body:
          </label>
          <textarea
            rows={10}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#070a12',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '0.75rem',
              color: '#f8fafc',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleCopy}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleOpenGmail}
              className="btn-gold"
              style={{ fontSize: '0.85rem' }}
              title="Open draft directly in Gmail (new Chrome tab)"
            >
              <ExternalLink size={16} />
              <span>Copy & Open in Gmail</span>
            </button>
            <button
              onClick={handleOpenMailClient}
              className="btn-secondary"
              style={{ fontSize: '0.8rem' }}
              title="Open in Outlook / default mail application"
            >
              <Mail size={15} />
              <span>System Mail App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
