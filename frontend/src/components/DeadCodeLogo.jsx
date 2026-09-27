import React from 'react';

export default function DeadCodeLogo({ size = 26 }) {
  return (
    <img
      src="/logo.svg"
      alt="deadcode logo"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    />
  );
}
