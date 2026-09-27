import React, { useState, useEffect } from 'react';
import StatsBar from './StatsBar';
import RepositoryTree from './RepositoryTree';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';

export default function DemoWorkspace({ sessionData, onResetDemo }) {
  const [sessionId] = useState(sessionData?.session_id);
  const [targetName] = useState(sessionData?.target_name || 'deadcode-demo');
  const [stats, setStats] = useState(sessionData?.stats || {
    filesScanned: 0,
    symbolsIndexed: 0,
    provable: 0,
    review: 0,
    active: 0,
  });
  const [tree, setTree] = useState(sessionData?.tree || []);
  const [candidates, setCandidates] = useState(sessionData?.candidates || []);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    sessionData?.candidates?.[0]?.id || null
  );
  const [removedIds, setRemovedIds] = useState([]);
  const [successNotice, setSuccessNotice] = useState(null);

  // Keep selected candidate valid
  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) ||
    candidates.find((c) => !removedIds.includes(c.id)) ||
    candidates[0];

  const handleProveSuccess = (id) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'PROVEN' } : c))
    );
  };

  const handleApplySuccess = (id, updatedData) => {
    setRemovedIds((prev) => [...prev, id]);

    if (updatedData) {
      if (updatedData.stats) setStats(updatedData.stats);
      if (updatedData.tree) setTree(updatedData.tree);
      if (updatedData.candidates) {
        setCandidates(updatedData.candidates);
        // Switch to next provable candidate if possible
        const nextCand = updatedData.candidates.find(
          (c) => c.id !== id && !removedIds.includes(c.id) && c.status === 'PROVABLE'
        ) || updatedData.candidates.find((c) => c.id !== id);

        if (nextCand) {
          setSelectedCandidateId(nextCand.id);
        }
      }
    }

    setSuccessNotice(`Candidate ${id} safely removed from codebase. Fresh scan complete.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ANALYSIS TARGET:
          </span>
          <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {targetName}
          </span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            color: 'var(--success)',
            border: '1px solid rgba(74, 222, 128, 0.25)',
            fontWeight: 600,
          }}>
            REAL CLI SESSION
          </span>
        </div>

        <button
          onClick={onResetDemo}
          className="font-mono"
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--orange)';
            e.currentTarget.style.borderColor = 'var(--border-orange-dim)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          ↻ Change Repository / New Session
        </button>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div style={{
          backgroundColor: 'var(--success-dim)',
          border: '1px solid rgba(74, 222, 128, 0.35)',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--success)',
          fontSize: '0.88rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700 }}>✓</span>
            <span className="font-mono">{successNotice}</span>
          </div>
          <button
            onClick={() => setSuccessNotice(null)}
            style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Real Stats Bar from DeadCode */}
      <StatsBar stats={stats} />

      {/* Two Column Grid */}
      <div className="responsive-demo-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.35fr)',
        gap: '24px',
      }}>
        {/* Left Column: Repository File Tree & Candidates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <RepositoryTree
            tree={tree}
            selectedCandidateId={selectedCandidate?.id}
            onSelectCandidate={setSelectedCandidateId}
            removedIds={removedIds}
          />

          <CandidateList
            candidates={candidates}
            selectedCandidateId={selectedCandidate?.id}
            onSelectCandidate={setSelectedCandidateId}
            removedIds={removedIds}
          />
        </div>

        {/* Right Column: Candidate Evidence & Proof Runner */}
        <div>
          <CandidateDetail
            candidate={selectedCandidate}
            sessionId={sessionId}
            isRemoved={selectedCandidate && removedIds.includes(selectedCandidate.id)}
            onProveSuccess={handleProveSuccess}
            onApplySuccess={handleApplySuccess}
          />
        </div>
      </div>
    </div>
  );
}
