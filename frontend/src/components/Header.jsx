import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isAbout = location.pathname === '/' || location.pathname === '/about';
  const isDemo = location.pathname === '/demo';
  const [ghHover, setGhHover] = useState(false);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 48px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Brand Logo & Name using user's logo.svg */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="/logo.svg"
          alt="deadcode logo"
          style={{
            width: '26px',
            height: '26px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        <span className="brand-pixel-font" style={{
          color: 'var(--orange)',
          fontSize: '1.25rem',
          fontWeight: 700,
          display: 'inline-block',
          lineHeight: 1,
        }}>
          deadcode
        </span>
      </Link>

      {/* Navigation Pill Container */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="nav-pill-container">
          <Link
            to="/"
            className={`nav-pill-item ${isAbout ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            to="/demo"
            className={`nav-pill-item ${isDemo ? 'active' : ''}`}
          >
            Demo
          </Link>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/toni8283/deadcode"
          target="_blank"
          rel="noreferrer"
          className="font-mono"
          style={{
            fontSize: '0.85rem',
            color: ghHover ? 'var(--orange)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            transform: ghHover ? 'translateY(-1px)' : 'none',
          }}
          onMouseEnter={() => setGhHover(true)}
          onMouseLeave={() => setGhHover(false)}
        >
          <img
            src="/github.png"
            alt="GitHub"
            style={{
              width: '18px',
              height: '18px',
              objectFit: 'contain',
              filter: ghHover
                ? 'invert(65%) sepia(45%) saturate(1800%) hue-rotate(330deg)'
                : 'invert(1) opacity(0.85)',
              transition: 'filter 0.2s ease',
            }}
          />
          <span>GitHub</span>
          <span style={{ fontSize: '0.75rem', color: ghHover ? 'var(--orange)' : 'var(--text-muted)' }}>↗</span>
        </a>
      </div>
    </header>
  );
}
