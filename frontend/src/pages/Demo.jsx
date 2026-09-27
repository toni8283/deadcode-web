import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import DemoWorkspace from '../components/DemoWorkspace';
import TerminalCLIMode from '../components/TerminalCLIMode';

export default function Demo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'cli' ? 'CLI' : 'WEB';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [demoState, setDemoState] = useState('initial'); // 'initial' | 'loading' | 'workspace'

  // Repository source: 'prepared' | 'github'
  const [repoSource, setRepoSource] = useState('prepared');
  const [githubUrl, setGithubUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    if (searchParams.get('tab') === 'cli') {
      setActiveTab('CLI');
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'CLI') {
      setSearchParams({ tab: 'cli' });
    } else {
      setSearchParams({});
    }
  };

  const handleStartAnalysis = async () => {
    setErrorMessage(null);

    // Validation for github URL
    if (repoSource === 'github') {
      const trimmed = githubUrl.trim();
      if (!trimmed) {
        setErrorMessage('Please enter a GitHub repository URL.');
        return;
      }
      const githubRegex = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?\/?$/;
      if (!githubRegex.test(trimmed)) {
        setErrorMessage('Invalid GitHub URL. Please provide a public HTTPS URL (e.g., https://github.com/username/project).');
        return;
      }
    }

    setDemoState('loading');

    try {
      const payload = repoSource === 'prepared'
        ? { source: 'prepared' }
        : { source: 'github', url: githubUrl.trim() };

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to analyze repository.');
      }

      setSessionData(data);
      setDemoState('workspace');
    } catch (err) {
      setErrorMessage(err.message || 'Error communicating with analysis backend.');
      setDemoState('initial');
    }
  };

  return (
    <div className="lc-frame" style={{ width: '100%', minHeight: '100vh', padding: '0 48px 100px' }}>
      {/* Top Header */}
      <div style={{
        textAlign: 'center',
        padding: '48px 0 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}>
        <div className="font-mono" style={{
          fontSize: '0.75rem',
          color: 'var(--orange)',
          letterSpacing: '1.2px',
          fontWeight: 600,
        }}>
          Interactive Demo
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-1px',
          color: 'var(--text-primary)',
        }}>
          Try Deadcode
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          lineHeight: '1.6',
        }}>
          Find unused code. Inspect the evidence. Prove the removal — powered by the real DeadCode engine.
        </p>

        {/* Mode Switcher */}
        <div style={{
          display: 'inline-flex',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          padding: '4px',
          marginTop: '12px',
          gap: '4px',
        }}>
          <button
            onClick={() => handleTabChange('WEB')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.86rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'WEB' ? 'var(--orange)' : 'transparent',
              color: activeTab === 'WEB' ? '#1a1a1a' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <img
              src="/web.png"
              alt="Web Icon"
              style={{
                width: '16px',
                height: '16px',
                objectFit: 'contain',
                filter: activeTab === 'WEB' ? 'brightness(0)' : 'invert(1) opacity(0.85)',
              }}
            />
            <span>LIVE WEB DEMO</span>
          </button>

          <button
            onClick={() => handleTabChange('CLI')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.86rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'CLI' ? 'var(--orange)' : 'transparent',
              color: activeTab === 'CLI' ? '#1a1a1a' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <img
              src="/terminal.png"
              alt="Terminal Icon"
              style={{
                width: '16px',
                height: '16px',
                objectFit: 'contain',
                filter: activeTab === 'CLI' ? 'brightness(0)' : 'invert(1) opacity(0.85)',
              }}
            />
            <span>TERMINAL CLI</span>
          </button>
        </div>
      </div>

      {/* Main Mode View */}
      {activeTab === 'CLI' ? (
        <div className="animate-fade-in">
          <TerminalCLIMode />
        </div>
      ) : (
        <div className="animate-fade-in">
          {demoState === 'initial' && (
            <div style={{
              maxWidth: '620px',
              margin: '30px auto',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '40px 36px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>
                  Choose Analysis Target
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: '1.5' }}>
                  Select the prepared Python demo repository or analyze a public GitHub repository in an isolated sandbox.
                </p>
              </div>

              {/* Source Toggle Pills */}
              <div style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '4px',
                gap: '6px',
                width: '100%',
                maxWidth: '440px',
              }}>
                <button
                  type="button"
                  onClick={() => { setRepoSource('prepared'); setErrorMessage(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: repoSource === 'prepared' ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: repoSource === 'prepared' ? 'var(--orange)' : 'var(--text-secondary)',
                    border: repoSource === 'prepared' ? '1px solid var(--border-orange-dim)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  1. Prepared Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setRepoSource('github'); setErrorMessage(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    backgroundColor: repoSource === 'github' ? 'var(--bg-surface-elevated)' : 'transparent',
                    color: repoSource === 'github' ? 'var(--orange)' : 'var(--text-secondary)',
                    border: repoSource === 'github' ? '1px solid var(--border-orange-dim)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  2. GitHub Repository
                </button>
              </div>

              {/* Target Details Form */}
              {repoSource === 'prepared' ? (
                <div style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      deadcode-demo (Python 3.12)
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--orange)' }}>
                      76 files • 247 symbols
                    </span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                    Pre-packaged Python microservice with real controllers, models, and multi-tier utility modules ready for dead code detection and isolated proof.
                  </p>
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  <label className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => { setGithubUrl(e.target.value); setErrorMessage(null); }}
                    placeholder="https://github.com/username/python-project"
                    className="font-mono"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-code)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '0.88rem',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--orange)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                  />
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    • Public Python repositories only. No credentials or authentication required.
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div style={{
                  width: '100%',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#f87171',
                  fontSize: '0.86rem',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                }}>
                  <strong>Analysis Error:</strong> {errorMessage}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleStartAnalysis}
                className="btn-pill btn-pill-orange"
                style={{ padding: '12px 34px', fontSize: '0.98rem', marginTop: '4px' }}
              >
                Analyze Repository →
              </button>

              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Each session executes in an isolated sandbox. Files are never modified permanently.
              </span>
            </div>
          )}

          {demoState === 'loading' && (
            <LoadingState onComplete={() => {}} />
          )}

          {demoState === 'workspace' && sessionData && (
            <DemoWorkspace
              sessionData={sessionData}
              onResetDemo={() => {
                setDemoState('initial');
                setSessionData(null);
                setErrorMessage(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
