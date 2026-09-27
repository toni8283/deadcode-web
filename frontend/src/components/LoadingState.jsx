import React, { useEffect, useState } from 'react';
import { SCAN_LOADING_STEPS } from '../data/demoData';

export default function LoadingState({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 < SCAN_LOADING_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      maxWidth: '640px',
      margin: '50px auto',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '36px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'var(--orange)',
          animation: 'pulseGlow 1.2s infinite',
        }} />
        <span style={{
          fontSize: '1.05rem',
          color: 'var(--orange)',
          fontWeight: 700,
        }}>
          Analyzing repository...
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {SCAN_LOADING_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className="font-mono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.86rem',
                color: isDone
                  ? 'var(--success)'
                  : isCurrent
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
                opacity: idx <= currentStepIndex ? 1 : 0.35,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isDone ? '✓' : isCurrent ? '→' : '·'}</span>
              <span>{step}</span>
              {isCurrent && <span className="cursor-blink" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
