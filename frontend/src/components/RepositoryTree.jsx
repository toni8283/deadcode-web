import React, { useState } from 'react';
import StatusBadge from './StatusBadge';

function TreeNode({ item, selectedCandidateId, onSelectCandidate, removedIds }) {
  const [isOpen, setIsOpen] = useState(true);

  if (item.type === 'dir') {
    return (
      <div style={{ marginLeft: '12px' }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {isOpen ? '▼' : '▶'}
          </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {item.name}/
          </span>
        </div>
        {isOpen && item.children && (
          <div style={{ borderLeft: '1px solid var(--border-subtle)', marginLeft: '6px' }}>
            {item.children.map((child, idx) => (
              <TreeNode
                key={idx}
                item={child}
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={onSelectCandidate}
                removedIds={removedIds}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isRemoved = item.candidateId && removedIds.includes(item.candidateId);
  const isSelected = item.candidateId && item.candidateId === selectedCandidateId;

  return (
    <div
      onClick={() => item.candidateId && onSelectCandidate(item.candidateId)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 8px',
        marginLeft: '14px',
        borderRadius: '6px',
        cursor: item.candidateId ? 'pointer' : 'default',
        backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
        border: isSelected ? '1px solid var(--border-coral-dim)' : '1px solid transparent',
        transition: 'all 0.15s ease',
        opacity: isRemoved ? 0.35 : 1,
      }}
      onMouseEnter={(e) => {
        if (item.candidateId && !isSelected) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>📄</span>
        <span
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: isSelected ? 'var(--coral)' : isRemoved ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: isRemoved ? 'line-through' : 'none',
          }}
        >
          {item.name}
        </span>
      </div>

      {item.status && (
        <StatusBadge status={isRemoved ? 'REMOVED' : item.status} />
      )}
    </div>
  );
}

export default function RepositoryTree({ tree, selectedCandidateId, onSelectCandidate, removedIds = [] }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            CODEBASE EXPLORER
          </span>
        </div>
        <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          git: main
        </span>
      </div>

      {/* Tree Content */}
      <div style={{ padding: '12px 8px', maxHeight: '280px', overflowY: 'auto' }}>
        {tree.map((rootItem, idx) => (
          <TreeNode
            key={idx}
            item={rootItem}
            selectedCandidateId={selectedCandidateId}
            onSelectCandidate={onSelectCandidate}
            removedIds={removedIds}
          />
        ))}
      </div>
    </div>
  );
}
