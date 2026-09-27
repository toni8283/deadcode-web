import React, { useState } from 'react';
import CandidateCard from './CandidateCard';

export default function CandidateList({ candidates, selectedCandidateId, onSelectCandidate, removedIds }) {
  const [filter, setFilter] = useState('ALL');

  const filteredCandidates = candidates.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'PROVABLE') return c.status === 'PROVABLE' || c.status === 'PROVEN';
    return c.status === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
      }}>
        <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          CANDIDATES ({candidates.length})
        </span>

        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          {['ALL', 'PROVABLE', 'REVIEW', 'ACTIVE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: filter === f ? 'var(--bg-surface-elevated)' : 'transparent',
                color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                border: filter === f ? '1px solid var(--border-medium)' : '1px solid transparent',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={candidate.id === selectedCandidateId}
            onSelect={onSelectCandidate}
            isRemoved={removedIds.includes(candidate.id)}
          />
        ))}
      </div>
    </div>
  );
}
