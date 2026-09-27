import React from 'react';
import StatusBadge from './StatusBadge';

export default function CandidateCard({ candidate, isSelected, onSelect, isRemoved }) {
  const currentStatus = isRemoved ? 'REMOVED' : candidate.status;

  return (
    <div
      onClick={() => onSelect(candidate.id)}
      style={{
        backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
        border: isSelected ? '1px solid var(--border-orange)' : '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isRemoved ? 0.45 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge status={currentStatus} />
          <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--orange)' }}>
            {candidate.id}
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {candidate.loc} LOC
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="font-mono" style={{
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          textDecoration: isRemoved ? 'line-through' : 'none',
        }}>
          {candidate.file}
        </span>
        <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          {candidate.symbol}
        </span>
      </div>
    </div>
  );
}
