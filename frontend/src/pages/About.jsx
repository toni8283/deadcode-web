import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroVisual from '../components/HeroVisual';

export default function About() {
  const [btnHover, setBtnHover] = useState(false);
  const [footerGhHover, setFooterGhHover] = useState(false);

  return (
    <div className="lc-frame" style={{ width: '100%', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 48px 90px',
      }}>
        <div className="responsive-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(360px, 1.25fr)',
          gap: '48px',
          alignItems: 'center',
        }}>
          {/* Hero Left Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div className="font-mono" style={{
                fontSize: '0.75rem',
                color: 'var(--orange)',
                letterSpacing: '1.2px',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                DETERMINISTIC DEAD CODE ANALYSIS
              </div>

              <h1 style={{
                fontSize: '3.6rem',
                fontWeight: 800,
                lineHeight: '1.08',
                letterSpacing: '-1.5px',
                color: 'var(--text-primary)',
              }}>
                Delete with<br />
                <span style={{ color: 'var(--orange)' }}>evidence.</span>
              </h1>
            </div>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.65',
              maxWidth: '480px',
            }}>
              Find unused code. Prove it's safe. Remove it confidently. DeadCode uses deterministic static analysis and isolated verification to identify code that can be safely removed from Python repositories.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '8px' }}>
              <Link to="/demo" className="btn-pill btn-pill-orange">
                <span>try demo</span>
                <img
                  src="/arrow.png"
                  alt="Arrow"
                  style={{
                    width: '14px',
                    height: '14px',
                    objectFit: 'contain',
                    marginLeft: '8px',
                    filter: 'brightness(0)', // Dark arrow on orange pill
                  }}
                />
              </Link>
              
              <Link
                to="/demo?tab=cli"
                className="btn-pill btn-pill-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <img
                  src="/terminal.png"
                  alt="Terminal Icon"
                  style={{
                    width: '15px',
                    height: '15px',
                    objectFit: 'contain',
                    filter: 'invert(1) opacity(0.85)', // Light icon on dark background
                  }}
                />
                <span>try in terminal</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Section 01 / THE PROBLEM */}
      <section className="lc-section" style={{ padding: '80px 48px' }}>
        <div className="responsive-section-grid" style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '48px',
        }}>
          <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: 600 }}>
            01 / THE PROBLEM
          </div>

          <div style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '-0.8px', color: 'var(--text-primary)' }}>
              Code gets left behind.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
              Large codebases inevitably accumulate unused functions, deprecated classes, abandoned modules, and obsolete helpers over time.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Developers hesitate to delete suspicious code because <strong style={{ color: 'var(--text-primary)' }}>"unused" is not the same as "safe to delete."</strong> Without proof, deleting feels risky. With DeadCode, removal is proven in an isolated worktree before anything touches your repository.
            </p>
          </div>
        </div>
      </section>

      {/* Section 02 / HOW IT WORKS */}
      <section className="lc-section" style={{ padding: '80px 48px' }}>
        <div className="responsive-section-grid" style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '48px',
        }}>
          <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: 600 }}>
            02 / HOW IT WORKS
          </div>

          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '36px', letterSpacing: '-0.8px', color: 'var(--text-primary)' }}>
              Deterministic verification pipeline.
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}>
              {/* Stage 1: SCAN */}
              <div className="lc-grid-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="font-mono" style={{ color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                    <span className="lc-tag-mark">✲</span>STAGE 01
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  SCAN
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Find candidates using deterministic AST graph indexing and complete symbol reference tracking.
                </p>
              </div>

              {/* Stage 2: PROVE */}
              <div className="lc-grid-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="font-mono" style={{ color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                    <span className="lc-tag-mark">✲</span>STAGE 02
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  PROVE
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Test removal in an isolated Git worktree and verify tests, typechecks, and build before modifying files.
                </p>
              </div>

              {/* Stage 3: APPLY */}
              <div className="lc-grid-card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="font-mono" style={{ color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                    <span className="lc-tag-mark">✲</span>STAGE 03
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  APPLY
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Only after proof succeeds, apply the deletion cleanly and record the verification report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03 / SAFETY */}
      <section className="lc-section" style={{ padding: '80px 48px' }}>
        <div className="responsive-section-grid" style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '48px',
        }}>
          <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--orange)', fontWeight: 600 }}>
            03 / SAFETY
          </div>

          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.8px', color: 'var(--text-primary)' }}>
              If DeadCode isn't sure, it doesn't delete.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '36px', maxWidth: '680px' }}>
              No AI guesses or speculative removals. Candidates are strictly classified into three deterministic states based on AST evidence.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
            }}>
              {/* PROVABLE */}
              <div className="lc-grid-card">
                <div style={{ marginBottom: '14px' }}>
                  <span className="badge badge-provable">PROVABLE</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Enough deterministic evidence exists to safely attempt an automated, isolated removal proof.
                </p>
              </div>

              {/* REVIEW */}
              <div className="lc-grid-card">
                <div style={{ marginBottom: '14px' }}>
                  <span className="badge badge-review">REVIEW</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Potentially unused, but dynamic lookups, reflection, or external calls require human review.
                </p>
              </div>

              {/* ACTIVE */}
              <div className="lc-grid-card">
                <div style={{ marginBottom: '14px' }}>
                  <span className="badge badge-active">ACTIVE</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Evidence demonstrates the code is actively referenced or registered in route/CLI tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="lc-section" style={{
        padding: '100px 48px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-primary)' }}>
          Make your codebase smaller.
        </h2>
        <p className="font-mono" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Find it. Prove it. Remove it.
        </p>
        <Link
          to="/demo"
          className="btn-pill btn-pill-orange"
          style={{
            marginTop: '12px',
            padding: '14px 36px',
            fontSize: '1rem',
            gap: '10px',
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          <span>Try DeadCode</span>
          <img
            src="/arrow.png"
            alt="Arrow"
            style={{
              width: '16px',
              height: '16px',
              objectFit: 'contain',
              filter: 'brightness(0)', // Dark arrow on orange button
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: btnHover ? 'translateX(4px)' : 'none',
            }}
          />
        </Link>
      </section>

      {/* Minimal Footer */}
      <footer className="lc-section" style={{
        padding: '36px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="brand-pixel-font" style={{ color: 'var(--orange)', fontSize: '1rem' }}>deadcode</span>
          <span>- Delete with evidence.</span>
        </div>
        <a
          href="https://github.com/toni8283/deadcode"
          target="_blank"
          rel="noreferrer"
          className="font-mono"
          style={{
            color: footerGhHover ? 'var(--orange)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={() => setFooterGhHover(true)}
          onMouseLeave={() => setFooterGhHover(false)}
        >
          <img
            src="/github.png"
            alt="GitHub"
            style={{
              width: '16px',
              height: '16px',
              objectFit: 'contain',
              filter: footerGhHover
                ? 'invert(65%) sepia(45%) saturate(1800%) hue-rotate(330deg)'
                : 'invert(1) opacity(0.85)',
              transition: 'filter 0.2s ease',
            }}
          />
          <span>github.com/toni8283/deadcode</span>
          <span style={{ fontSize: '0.75rem' }}>↗</span>
        </a>
      </footer>
    </div>
  );
}
