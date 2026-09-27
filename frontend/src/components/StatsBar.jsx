import React from 'react';

export default function StatsBar({ stats }) {
  const statItems = [
    { label: 'FILES SCANNED', value: stats.filesScanned, color: 'var(--text-primary)' },
    { label: 'SYMBOLS INDEXED', value: stats.symbolsIndexed.toLocaleString(), color: 'var(--text-primary)' },
    { label: 'PROVABLE', value: stats.provable, color: 'var(--orange)' },
    { label: 'REVIEW', value: stats.review, color: 'var(--warning)' },
    { label: 'ACTIVE', value: stats.active, color: 'var(--success)' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '24px',
    }}>
      {statItems.map((item, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <span className="font-mono" style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.8px',
            fontWeight: 600,
          }}>
            {item.label}
          </span>
          <span className="font-mono" style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: item.color,
            lineHeight: '1.1',
          }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
