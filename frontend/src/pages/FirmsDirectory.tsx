import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Mail, AlertTriangle, CheckCircle2, Bookmark, Filter, Shield } from 'lucide-react';
import { LegalFirm, CandidateProfile } from '../types';

interface FirmsDirectoryProps {
  firms: LegalFirm[];
  profile: CandidateProfile;
  onOpenEmailModal: (firm: LegalFirm) => void;
  onOpenPortalModal: (firm: LegalFirm) => void;
  onAddToTracker: (firm: LegalFirm) => void;
  appliedFirmNames: Set<string>;
}

export const FirmsDirectory: React.FC<FirmsDirectoryProps> = ({
  firms,
  profile,
  onOpenEmailModal,
  onOpenPortalModal,
  onAddToTracker,
  appliedFirmNames
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [modalityFilter, setModalityFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  const filteredFirms = firms.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || f.tier === tierFilter;
    const matchesModality = modalityFilter === 'ALL' || f.modality === modalityFilter;
    const matchesLocation = locationFilter === 'ALL' || 
                            (locationFilter === 'BLR' && (f.location.includes('Bengaluru') || f.location.includes('Bangalore')));

    return matchesSearch && matchesTier && matchesModality && matchesLocation;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-luxury)',
        transition: 'var(--transition-smooth)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-gold)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '0.75rem' }}>
            <Shield size={14} /> TIER-1 & BOUTIQUE DIRECTORY
          </div>
          <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Top 100 Legal Companies & Chambers
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '780px', lineHeight: 1.6 }}>
            Curated intelligence database of leading Indian law firms, appellate chambers, and commercial practices. View strict application modalities, eligibility criteria, HR vs query email warnings, and auto-generate tailored cover letters.
          </p>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-luxury)' }}>
            <span style={{ display: 'block', fontSize: '1.75rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
              {filteredFirms.length} / {firms.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Firms Filtered
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'var(--bg-subtle)',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-luxury)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by firm name, location, or practice area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Tier Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tier:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Tiers</option>
            <option value="Tier A">Tier A (National BigLaw)</option>
            <option value="Tier B">Tier B (Elite Specialists)</option>
            <option value="Tier C">Tier C (Boutiques & Chambers)</option>
          </select>
        </div>

        {/* Modality Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Modality:</span>
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Modalities</option>
            <option value="direct_email">Direct Email</option>
            <option value="button_form">Online Web Form</option>
            <option value="web_portal">Careers Portal</option>
            <option value="chamber_outreach">Chamber Outreach</option>
          </select>
        </div>

        {/* Location Quick Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setLocationFilter(locationFilter === 'BLR' ? 'ALL' : 'BLR')}
            style={{
              background: locationFilter === 'BLR' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card-hover)',
              border: locationFilter === 'BLR' ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
              color: locationFilter === 'BLR' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <MapPin size={14} />
            <span>Bangalore Only</span>
          </button>
        </div>
      </div>

      {/* Grid of Law Firms */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredFirms.map((firm) => {
          const isApplied = appliedFirmNames.has(firm.name);
          const isEmailModality = firm.modality === 'direct_email' || firm.modality === 'chamber_outreach';

          return (
            <div
              key={firm.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={
                      firm.tier === 'Tier A' ? 'badge-tier-a' :
                      firm.tier === 'Tier B' ? 'badge-tier-b' : 'badge-tier-c'
                    }>
                      {firm.tier}
                    </span>
                    <span className="badge-modality">
                      {firm.modality.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {isApplied && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald)',
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(16, 185, 129, 0.4)'
                    }}>
                      <CheckCircle2 size={12} /> Applied
                    </span>
                  )}
                </div>

                {/* Firm Name & Location */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {firm.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <MapPin size={13} color="var(--gold-primary)" />
                  <span>{firm.location}</span>
                </div>

                {/* Instructions Box */}
                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                  marginBottom: '0.85rem'
                }}>
                  <strong style={{ color: 'var(--gold-primary)' }}>Eligibility & Instructions: </strong>
                  {firm.instructions}
                </div>

                {/* Email Warnings & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  {firm.application_email && (
                    <div style={{ color: '#93c5fd' }}>
                      <strong>Application Email:</strong> {firm.application_email}
                    </div>
                  )}

                  {firm.query_only_email && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '4px',
                      color: '#f87171',
                      background: 'rgba(239, 68, 68, 0.08)',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                      <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{firm.query_only_email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.85rem',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => onAddToTracker(firm)}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.45rem 0.7rem' }}
                  title="Add to Tracking Board"
                >
                  <Bookmark size={14} />
                  <span>Track</span>
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isEmailModality ? (
                    <button
                      onClick={() => onOpenEmailModal(firm)}
                      className="btn-gold"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                    >
                      <Mail size={14} />
                      <span>Send Mail</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenPortalModal(firm)}
                      className="btn-gold"
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
                    >
                      <ExternalLink size={14} />
                      <span>Apply on Portal</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
