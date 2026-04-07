import React from 'react';

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      ...style,
    }}
  >
    {children}
  </div>
);

export const StatCard = ({ label, value, accent = false }) => (
  <div
    style={{
      background: 'var(--bg-card)',
      border: `1px solid ${accent ? 'var(--accent-dim)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      minWidth: '140px',
    }}
  >
    <div
      style={{
        fontSize: '28px',
        fontWeight: 700,
        color: accent ? 'var(--accent)' : 'var(--text-primary)',
        fontFamily: 'var(--font-display)',
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: '11px',
        color: 'var(--text-secondary)',
        marginTop: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}
    >
      {label}
    </div>
  </div>
);

export const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '32px' }}>
    <h1
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '24px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
      }}
    >
      {title}
    </h1>
    {subtitle && (
      <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
        {subtitle}
      </p>
    )}
  </div>
);

export default Card;
