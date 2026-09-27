import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import EvidencePanel from './EvidencePanel';

export default function CandidateDetail({
  candidate,
  sessionId,
  isRemoved,
  onProveSuccess,
  onApplySuccess,
}) {
  const [proving, setProving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isProven, setIsProven] = useState(candidate?.status === 'PROVEN');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    setProving(false);
    setApplying(false);
    setTerminalLogs([]);
    setErrorMsg(null);
    setIsProven(candidate?.status === 'PROVEN');
  }, [candidate?.id, candidate?.status]);

  if (!candidate) {
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}>
        <p className="font-mono" style={{ fontSize: '0.85rem' }}>
          Select a candidate from the codebase to view evidence and run isolated proofs.
        </p>
      </div>
    );
  }

  const handleProve = async () => {
    if (proving || isProven || candidate.status !== 'PROVABLE' || !sessionId) return;
    setProving(true);
    setErrorMsg(null);
    setTerminalLogs([`$ deadcode prove ${candidate.id}`]);

    try {
      const res = await fetch('/api/prove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, candidate_id: candidate.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Proof execution failed.');
      }

      // Display real steps
      const newLogs = [`$ deadcode prove ${candidate.id}`];
      if (data.steps && data.steps.length > 0) {
        data.steps.forEach((s) => {
          const icon = s.status === 'success' ? '✓' : s.status === 'skipped' ? '–' : '✗';
          newLogs.push(`${icon} ${s.text}`);
        });
      }

      setTerminalLogs(newLogs);

      if (data.is_proven) {
        setIsProven(true);
        if (onProveSuccess) {
          onProveSuccess(candidate.id);
        }
      } else {
        setIsProven(false);
        setErrorMsg(data.failure_reason || 'Proof verification did not pass.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error executing proof.');
      setTerminalLogs((prev) => [...prev, `✗ Error: ${err.message}`]);
    } finally {
      setProving(false);
    }
  };

  const handleApply = async () => {
    if (applying || isRemoved || !isProven || !sessionId) return;
    setApplying(true);
    setErrorMsg(null);

    setTerminalLogs((prev) => [
      ...prev,
      `$ deadcode apply ${candidate.id} --yes`,
      `Applying removal in repository...`,
    ]);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, candidate_id: candidate.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Apply operation failed.');
      }

      setTerminalLogs((prev) => [
        ...prev,
        `✓ Removed from ${candidate.file}`,
        `✓ Repository re-scanned (symbols and candidates updated)`,
        `Removal applied successfully.`,
      ]);

      if (onApplySuccess) {
        onApplySuccess(candidate.id, data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply removal.');
      setTerminalLogs((prev) => [...prev, `✗ Error: ${err.message}`]);
    } finally {
      setApplying(false);
    }
  };

  const displayStatus = isRemoved ? 'REMOVED' : isProven ? 'PROVEN' : candidate.status;

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    }}>
      {/* Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '18px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--orange)' }}>
              {candidate.id}
            </span>
            <StatusBadge status={displayStatus} />
          </div>
          <div className="font-mono" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {candidate.path}:{candidate.line}
          </div>
          {candidate.qualified_name && (
            <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {candidate.qualified_name}
            </div>
          )}
        </div>

        <div className="font-mono" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {candidate.loc} lines
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {candidate.type}
          </div>
        </div>
      </div>

      {/* Why this is a candidate */}
      <div>
        <div className="font-mono" style={{
          fontSize: '0.74rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Why this is a candidate
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
          {candidate.reason}
        </p>
      </div>

      {/* Real Evidence Panel */}
      <EvidencePanel
        evidence={candidate.evidence}
        rawEvidence={candidate.rawEvidence}
      />

      {/* Code Snippet */}
      {candidate.codeSnippet && (
        <div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            DEFINITION PREVIEW (LINE {candidate.line})
          </div>
          <pre className="font-mono" style={{
            backgroundColor: 'var(--bg-code)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.78rem',
            color: '#E0E0E0',
            overflowX: 'auto',
            lineHeight: '1.5',
          }}>
            <code>{candidate.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Error alert if any */}
      {errorMsg && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#f87171',
          fontSize: '0.85rem',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {/* Prove Button */}
        {candidate.classification === 'PROVABLE' || isProven ? (
          <button
            onClick={handleProve}
            disabled={proving || isProven || isRemoved}
            className="btn-pill btn-pill-orange-outline"
            style={{
              padding: '8px 22px',
              fontSize: '0.86rem',
              backgroundColor: isProven ? 'rgba(74, 222, 128, 0.1)' : undefined,
              borderColor: isProven ? 'var(--success)' : undefined,
              color: isProven ? 'var(--success)' : undefined,
              cursor: proving || isProven || isRemoved ? 'default' : 'pointer',
            }}
          >
            {proving ? (
              <span>Verifying Proof...</span>
            ) : isProven ? (
              <span>✓ Proven Safe</span>
            ) : (
              <span>Prove Safety →</span>
            )}
          </button>
        ) : (
          <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {candidate.classification === 'REVIEW'
              ? '⚠ Candidate marked for human review. Prove not supported without manual annotations.'
              : 'Active reference detected.'}
          </div>
        )}

        {/* Apply Button */}
        <button
          onClick={handleApply}
          disabled={!isProven || isRemoved || applying}
          className="btn-pill btn-pill-orange"
          style={{
            padding: '8px 22px',
            fontSize: '0.86rem',
            opacity: !isProven || isRemoved || applying ? 0.45 : 1,
            cursor: !isProven || isRemoved || applying ? 'not-allowed' : 'pointer',
          }}
        >
          {applying ? (
            <span>Applying...</span>
          ) : isRemoved ? (
            <span>✓ Removed</span>
          ) : (
            <span>Apply Removal →</span>
          )}
        </button>
      </div>

      {/* Proof Terminal Output */}
      {terminalLogs.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-terminal)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px 18px',
          marginTop: '6px',
        }}>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            VERIFICATION LOGS (ISOLATED WORKTREE)
          </div>
          <div className="font-mono" style={{ fontSize: '0.78rem', lineHeight: '1.6' }}>
            {terminalLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  color: log.startsWith('$')
                    ? 'var(--orange)'
                    : log.includes('PROVEN')
                    ? 'var(--orange)'
                    : log.includes('✓') || log.includes('passed')
                    ? 'var(--success)'
                    : log.includes('✗')
                    ? '#f87171'
                    : 'var(--text-secondary)',
                  fontWeight: log.includes('PROVEN') || log.startsWith('$') ? 700 : 400,
                }}
              >
                {log}
              </div>
            ))}
            {(proving || applying) && (
              <span className="cursor-blink" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
