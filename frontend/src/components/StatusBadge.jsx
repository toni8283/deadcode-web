import React from 'react';

export default function StatusBadge({ status }) {
  let badgeClass = 'badge-active';
  let label = status;

  switch (status?.toUpperCase()) {
    case 'PROVABLE':
      badgeClass = 'badge-provable';
      break;
    case 'PROVEN':
      badgeClass = 'badge-proven';
      break;
    case 'REVIEW':
      badgeClass = 'badge-review';
      break;
    case 'ACTIVE':
      badgeClass = 'badge-active';
      break;
    case 'REMOVED':
      badgeClass = 'badge-removed';
      break;
    case 'SUITE':
      badgeClass = 'badge-suite';
      break;
    case '0 REFS':
      badgeClass = 'badge-provable';
      break;
    default:
      badgeClass = 'badge-active';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {label}
    </span>
  );
}
