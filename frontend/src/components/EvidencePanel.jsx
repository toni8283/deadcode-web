import React from 'react';

export default function EvidencePanel({ evidence, rawEvidence = [] }) {
  const items = [
    { label: 'References', value: evidence?.references ?? 0 },
    { label: 'Imports', value: evidence?.imports ?? 0 },
    { label: 'Test references', value: evidence?.testReferences ?? 0 },
    { label: 'Exported (__all__)', value: evidence?.exports ?? 'None' },
    { label: 'Has decorator', value: evidence?.hasDecorator ?? 'None' },
    { label: 'Is private', value: evidence?.isPrivate ?? 'No' },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-terminal)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      padding: '16px',
      margin: '14px 0',
    }}>
      <div className="font-mono" style={{
        fontSize: '0.74rem',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        letterSpacing: '0.8px',
        marginBottom: '12px',
        textTransform: 'uppercase',
      }}>
        Evidence Report
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '10px',
      }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: '6px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {item.label}
            </span>
            <span className="font-mono" style={{
              fontSize: '0.86rem',
              fontWeight: 600,
              color: item.value === 0 || item.value === 'None' || item.value === 'No'
                ? 'var(--text-primary)'
                : 'var(--orange)',
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {rawEvidence && rawEvidence.length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            SCANNER FINDINGS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {rawEvidence.map((ev, i) => (
              <div key={i} className="font-mono" style={{ fontSize: '0.75rem', color: '#E0E0E0', display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--orange)' }}>•</span>
                <span>
                  <strong style={{ color: 'var(--text-primary)' }}>{ev.reason}:</strong> {ev.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
