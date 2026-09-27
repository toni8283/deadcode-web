import React, { useState } from 'react';

export default function TerminalCLIMode() {
  const [copied, setCopied] = useState(false);
  const installCmd = 'pip install git+https://github.com/toni8283/deadcode.git';

  const copyCommand = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      maxWidth: '740px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
    }}>
      {/* Standard Open-Source Install Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '10px 16px',
        gap: '12px',
        width: '100%',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          <span className="font-mono" style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '0.9rem' }}>$</span>
          <span className="font-mono" style={{
            fontSize: '0.84rem',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {installCmd}
          </span>
        </div>

        <button
          onClick={copyCommand}
          className="font-mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.76rem',
            fontWeight: 600,
            color: copied ? 'var(--success)' : 'var(--orange)',
            backgroundColor: 'var(--orange-dim)',
            border: '1px solid var(--border-orange-dim)',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Authentic Monospace Terminal Window */}
      <div className="terminal-window" style={{
        border: '1px solid var(--border-medium)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
        width: '100%',
      }}>
        {/* Terminal Title Bar */}
        <div className="terminal-header">
          <div className="window-dots">
            <span className="window-dot dot-green" />
            <span className="window-dot dot-gray" />
            <span className="window-dot dot-orange" />
          </div>
          <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            bash - 80x24
          </span>
          <div style={{ width: '40px' }} />
        </div>

        {/* Real Terminal Stream Content */}
        <pre className="font-mono" style={{
          padding: '24px 28px',
          fontSize: '0.8rem',
          lineHeight: '1.65',
          color: '#D4D4D4',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          backgroundColor: '#121212',
        }}>
          {/* Command 1: pip install */}
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>$ </span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>pip install git+https://github.com/toni8283/deadcode.git</span>{'\n'}
          <span style={{ color: '#888888' }}>Collecting git+https://github.com/toni8283/deadcode.git</span>{'\n'}
          <span style={{ color: '#888888' }}>  Cloning https://github.com/toni8283/deadcode.git to /tmp/pip-req-build</span>{'\n'}
          <span style={{ color: '#888888' }}>  Resolved https://github.com/toni8283/deadcode.git to commit 9c50289</span>{'\n'}
          <span style={{ color: '#888888' }}>  Installing build dependencies ... </span><span style={{ color: 'var(--success)' }}>done</span>{'\n'}
          <span style={{ color: '#888888' }}>  Getting requirements to build wheel ... </span><span style={{ color: 'var(--success)' }}>done</span>{'\n'}
          <span style={{ color: '#888888' }}>  Preparing metadata (pyproject.toml) ... </span><span style={{ color: 'var(--success)' }}>done</span>{'\n'}
          <span style={{ color: '#888888' }}>Building wheels for collected packages: deadcode</span>{'\n'}
          <span style={{ color: '#888888' }}>  Building wheel for deadcode (pyproject.toml) ... </span><span style={{ color: 'var(--success)' }}>done</span>{'\n'}
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>Successfully installed deadcode-0.1.0</span>{'\n'}
          {'\n'}

          {/* Command 2: deadcode --version */}
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>$ </span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>deadcode --version</span>{'\n'}
          <span style={{ color: '#FFFFFF' }}>deadcode 0.1.0</span>{'\n'}
          {'\n'}

          {/* Command 3: deadcode --help */}
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>$ </span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>deadcode --help</span>{'\n'}
          {'\n'}
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Usage: </span>deadcode [OPTIONS] COMMAND [ARGS]...{'\n'}
          {'\n'}
          <span style={{ color: '#888888' }}>Find and safely remove unused Python code - with proof.</span>{'\n'}
          {'\n'}
          <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Options:</span>{'\n'}
          {'  '}--version          Show version and exit.{'\n'}
          {'  '}--help             Show this message and exit.{'\n'}
          {'\n'}
          <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Commands:</span>{'\n'}
          {'  '}<span style={{ color: '#FFFFFF', fontWeight: 600 }}>scan</span>   Scan a repository and display unused code candidates.{'\n'}
          {'  '}<span style={{ color: '#FFFFFF', fontWeight: 600 }}>show</span>   Show the complete evidence for a candidate.{'\n'}
          {'  '}<span style={{ color: '#FFFFFF', fontWeight: 600 }}>prove</span>  Prove a candidate is safe to remove using an isolated Git worktree.{'\n'}
          {'  '}<span style={{ color: '#FFFFFF', fontWeight: 600 }}>apply</span>  Apply a proven candidate removal to the working tree.{'\n'}
          {'\n'}

          {/* Command 4: deadcode scan . */}
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>$ </span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>deadcode scan .</span>{'\n'}
          {'\n'}
          <span style={{ color: '#666666' }}>-------------------------------- DeadCode --------------------------------</span>{'\n'}
          {'  '}Repository      : demo-repository{'\n'}
          {'  '}Files scanned   : 75{'\n'}
          {'  '}Symbols indexed : 246{'\n'}
          {'\n'}
          {'  '}<span style={{ color: 'var(--orange)', fontWeight: 700 }}>PROVABLE</span>       8{'\n'}
          {'  '}<span style={{ color: 'var(--warning)', fontWeight: 700 }}>REVIEW</span>       229{'\n'}
          {'  '}<span style={{ color: 'var(--success)', fontWeight: 700 }}>ACTIVE</span>        84{'\n'}
          <span style={{ color: '#666666' }}>--------------------------------------------------------------------------</span>{'\n'}
          {'\n'}
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>PROVABLE CANDIDATES</span>{'\n'}
          {'\n'}
          {'  '}<span style={{ color: 'var(--orange)', fontWeight: 700 }}>[DC-001]</span>  app/fizz/fizzbar/controller.py:42{'\n'}
          {'    '}delete  (function){'\n'}
          {'    '}References: 0  Tests: 0  Exported: -  Confidence: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>PROVABLE</span>{'\n'}
          {'\n'}
          {'  '}<span style={{ color: 'var(--orange)', fontWeight: 700 }}>[DC-002]</span>  app/fizz/fizzbaz/controller.py:42{'\n'}
          {'    '}delete  (function){'\n'}
          {'    '}References: 0  Tests: 0  Exported: -  Confidence: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>PROVABLE</span>{'\n'}
          {'\n'}
          {'  '}<span style={{ color: 'var(--orange)', fontWeight: 700 }}>[DC-003]</span>  app/other_api/whatsit/controller.py:42{'\n'}
          {'    '}delete  (function){'\n'}
          {'    '}References: 0  Tests: 0  Exported: -  Confidence: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>PROVABLE</span>{'\n'}
          {'\n'}
          <span style={{ color: 'var(--orange)', fontWeight: 600 }}>8 candidates can be proven safe to remove.</span>{'\n'}
          {'\n'}
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>$ </span><span className="cursor-blink" />
        </pre>
      </div>
    </div>
  );
}

