import React, { useState } from 'react';
import { Kanban, Plus, Trash2, MapPin, Calendar, Mail, ExternalLink, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Application } from '../types';

interface TrackingBoardProps {
  applications: Application[];
  onUpdateStatus: (id: string, newStatus: Application['status']) => void;
  onDeleteApplication: (id: string) => void;
  onOpenAddModal: () => void;
}

const COLUMNS: { id: Application['status']; label: string; color: string; badgeColor: string }[] = [
  { id: 'saved', label: 'Saved / Considering', color: '#94a3b8', badgeColor: 'rgba(148, 163, 184, 0.2)' },
  { id: 'applied', label: 'Applied', color: '#60a5fa', badgeColor: 'rgba(59, 130, 246, 0.2)' },
  { id: 'interview', label: 'Interview Scheduled', color: '#facc15', badgeColor: 'rgba(250, 204, 21, 0.2)' },
  { id: 'offer', label: 'Offer Received', color: '#34d399', badgeColor: 'rgba(16, 185, 129, 0.2)' },
  { id: 'rejected', label: 'Rejected / Archived', color: '#f87171', badgeColor: 'rgba(239, 68, 68, 0.2)' },
];

export const TrackingBoard: React.FC<TrackingBoardProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onOpenAddModal
}) => {
  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: '#facc15', marginBottom: '0.5rem' }}>
            <Kanban size={14} /> PIPELINE WORKSPACE
          </div>
          <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            Personal Application Board
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Track application progression across the 100 Law Firms, Live Aggregators, or custom external applications.
          </p>
        </div>

        <button onClick={onOpenAddModal} className="btn-gold" style={{ padding: '0.75rem 1.25rem' }}>
          <Plus size={16} />
          <span>+ Add External Application</span>
        </button>
      </div>

      {/* Kanban Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1.25rem',
        alignItems: 'flex-start'
      }}>
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id);

          return (
            <div
              key={col.id}
              style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '680px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-luxury)'
              }}
            >
              {/* Column Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: `2px solid ${col.color}`
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: col.color }}>
                  {col.label}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: col.badgeColor,
                  color: col.color,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}>
                  {colApps.length}
                </span>
              </div>

              {/* Cards inside Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {colApps.map(app => (
                  <div
                    key={app.id}
                    className="glass-card"
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      background: 'var(--bg-card-hover)',
                      boxShadow: 'var(--shadow-luxury)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8'
                      }}>
                        {app.source}
                      </span>

                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Remove from board"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {app.companyName}
                    </h4>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {app.roleTitle}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <MapPin size={11} color="var(--gold-primary)" />
                      <span>{app.location}</span>
                    </div>

                    {app.appliedDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--accent-blue)' }}>
                        <Clock size={11} />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    )}

                    {app.notes && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-subtle)',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        fontStyle: 'italic',
                        marginTop: '2px'
                      }}>
                        "{app.notes}"
                      </div>
                    )}

                    {/* Move to next stage button row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.5rem',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.5rem'
                    }}>
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as any)}
                        style={{
                          fontSize: '0.7rem',
                          backgroundColor: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          padding: '2px 4px'
                        }}
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      {app.portalUrl && (
                        <a
                          href={app.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#fbbf24', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}
                        >
                          <ExternalLink size={12} />
                          <span>Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
