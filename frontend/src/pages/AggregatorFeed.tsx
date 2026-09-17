import React, { useState } from 'react';
import { Globe, RefreshCw, MapPin, Calendar, DollarSign, Bookmark, ExternalLink, Mail, CheckCircle2, Search, Filter } from 'lucide-react';
import { Opportunity } from '../types';

interface AggregatorFeedProps {
  opportunities: Opportunity[];
  onAddToTracker: (opp: Opportunity) => void;
  onRefreshScraper: () => Promise<void>;
  isScraping: boolean;
  trackedExternalIds: Set<string>;
  scraperStats: any;
  isAdmin?: boolean;
}

export const AggregatorFeed: React.FC<AggregatorFeedProps> = ({
  opportunities,
  onAddToTracker,
  onRefreshScraper,
  isScraping,
  trackedExternalIds,
  scraperStats,
  isAdmin = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'lawbhoomi' | 'lawctopus'>('ALL');
  const [locationFilter, setLocationFilter] = useState('BLR');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleSyncClick = async () => {
    setSyncStatusMsg(null);
    await onRefreshScraper();
    setSyncStatusMsg('Top 3 pages successfully polled & synced!');
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = sourceFilter === 'ALL' || opp.source === sourceFilter;
    const matchesLocation = locationFilter === 'ALL' ||
                            (locationFilter === 'BLR' && opp.location.toLowerCase().includes('bengaluru')) ||
                            (locationFilter === 'REMOTE' && (opp.location.toLowerCase().includes('remote') || opp.mode === 'remote'));
    const matchesMode = modeFilter === 'ALL' || opp.mode === modeFilter;

    return matchesSearch && matchesSource && matchesLocation && matchesMode;
  });

  return (
    <div className="responsive-container">
      {/* Header Banner */}
      <div className="responsive-banner">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '0.75rem' }}>
            <Globe size={14} /> LIVE AGGREGATOR PIPELINE
          </div>
          <h1 className="font-serif gold-gradient-text responsive-title">
            Live Feed: LawBhoomi & Lawctopus
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '750px', lineHeight: 1.5 }}>
            Automated intelligence retrieval adhering to strict polite limits: polls the top 3 pages with deterministic slug deduplication. Zero site bombardment, clean metadata extraction with direct apply links and contact emails.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
          {isAdmin && (
            <button
              onClick={handleSyncClick}
              disabled={isScraping}
              className="btn-gold"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={16} className={isScraping ? 'animate-spin' : ''} />
              <span>{isScraping ? 'Polling Top 3 Pages...' : 'Sync Latest (Top 3 Pages)'}</span>
            </button>
          )}

          {isAdmin && syncStatusMsg && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> {syncStatusMsg}
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', display: 'inline-block' }} />
            <span>Auto-synced every 5h • Last: {scraperStats?.lastScrapedAt ? new Date(scraperStats.lastScrapedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ready'}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'var(--bg-subtle)',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-luxury)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search opportunities by role, firm, or keywords..."
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

        {/* Source Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Aggregators</option>
            <option value="lawbhoomi">LawBhoomi Only</option>
            <option value="lawctopus">Lawctopus Only</option>
          </select>
        </div>

        {/* Mode Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mode:</span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Modes</option>
            <option value="onsite">Work From Office</option>
            <option value="remote">Remote / Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Location Quick Toggle */}
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
          <span>Bengaluru Only</span>
        </button>
      </div>

      {/* Grid of Scraped Opportunities */}
      {filteredOpps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No opportunities found matching your filters.</p>
          <button onClick={onRefreshScraper} className="btn-gold">
            Run Initial Scrape
          </button>
        </div>
      ) : (
        <div className="responsive-card-grid">
          {filteredOpps.map((opp) => {
            const isTracked = trackedExternalIds.has(opp.externalId);

            return (
              <div
                key={opp.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Source & Mode Tags */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        background: opp.source === 'lawbhoomi' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: opp.source === 'lawbhoomi' ? '#f87171' : '#60a5fa',
                        border: `1px solid ${opp.source === 'lawbhoomi' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                      }}>
                        {opp.source === 'lawbhoomi' ? 'LawBhoomi' : 'Lawctopus'}
                      </span>

                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#cbd5e1'
                      }}>
                        {opp.mode.toUpperCase()}
                      </span>
                    </div>

                    {isTracked && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                        <CheckCircle2 size={13} /> On Board
                      </span>
                    )}
                  </div>

                  {/* Title & Company */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                    {opp.title}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {opp.company}
                  </div>

                  {/* Metadata row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="var(--gold-primary)" />
                      <span>{opp.location}</span>
                    </div>

                    {opp.stipend && opp.stipend !== 'Not specified' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                        <DollarSign size={12} />
                        <span>{opp.stipend}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>{new Date(opp.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {opp.description}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.85rem'
                }}>
                  <button
                    onClick={() => onAddToTracker(opp)}
                    disabled={isTracked}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                  >
                    <Bookmark size={14} />
                    <span>{isTracked ? 'Saved to Tracker' : '+ Add to Board'}</span>
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {opp.applyEmail && (
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(opp.applyEmail)}&su=${encodeURIComponent(`Application for Legal Internship - ${opp.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', textDecoration: 'none' }}
                        title="Compose email directly in Gmail"
                      >
                        <Mail size={13} />
                        <span>Email HR</span>
                      </a>
                    )}

                    <a
                      href={opp.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} />
                      <span>Open Post</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
