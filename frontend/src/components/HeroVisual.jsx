import React from 'react';

export default function HeroVisual() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '540px',
      backgroundColor: '#181818',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridAutoRows: 'minmax(136px, auto)',
    }}>
      {/* Cell 1: AST Orphan Node */}
      <div style={{
        padding: '22px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            01 / AST GRAPH
          </span>
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--orange)',
          }} />
        </div>

        <div style={{ margin: '12px 0' }}>
          <div className="font-mono" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
            orphan_symbol()
          </div>
          <div className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--orange)' }}>
            0 incoming references
          </div>
        </div>

        <div>
          <span className="font-mono" style={{
            fontSize: '0.64rem',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            AST ISOLATED
          </span>
        </div>
      </div>

      {/* Cell 2: Isolated Worktree Verification */}
      <div style={{
        padding: '22px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            02 / PROOF SANDBOX
          </span>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>
            VERIFIED
          </span>
        </div>

        <div style={{ margin: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
              183 / 183 Tests
            </span>
          </div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Isolated git worktree pass
          </div>
        </div>

        <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
          0 regressions detected
        </div>
      </div>

      {/* Cell 3: Graphic Minus Typography */}
      <div style={{
        padding: '22px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
      }}>
        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          03 / CLEAN PRUNING
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '6px 0' }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--orange)', lineHeight: 1 }}>−</span>
          <span className="font-mono" style={{ fontSize: '1.9rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            1,420
          </span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            LOC
          </span>
        </div>

        <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          Deleted without guesswork
        </div>
      </div>

      {/* Cell 4: Brand Identity */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#131313',
      }}>
        <img
          src="/logo.svg"
          alt="deadcode logo"
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
        <span className="brand-pixel-font" style={{ fontSize: '0.82rem', color: 'var(--orange)', letterSpacing: '-0.3px' }}>
          deadcode
        </span>
      </div>

      {/* Cell 5: Deterministic States */}
      <div style={{
        padding: '22px 20px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
      }}>
        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          04 / CLASSIFICATION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: '6px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--orange)', fontWeight: 600 }}>PROVABLE</span>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Safe proof</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--warning)', fontWeight: 600 }}>REVIEW</span>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Manual check</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>ACTIVE</span>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Keep in repo</span>
          </div>
        </div>

        <div className="font-mono" style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
          Deterministic AST rules
        </div>
      </div>

      {/* Cell 6: Pipeline Flow */}
      <div style={{
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#161616',
      }}>
        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          05 / VERIFICATION FLOW
        </div>

        <div className="font-mono" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#FFFFFF',
          margin: '8px 0',
        }}>
          <span style={{ color: 'var(--orange)' }}>SCAN</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: 'var(--orange)' }}>PROVE</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span style={{ color: 'var(--success)' }}>APPLY</span>
        </div>

        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
          Never touch master without green tests
        </div>
      </div>
    </div>
  );
}

