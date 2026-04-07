import React, { useState } from 'react';
import { PageHeader } from '../../components/Card';

const ScanQR = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState(null);

  const handleScan = () => {
    setScanning(true);
    setStatus(null);
    setTimeout(() => {
      setScanning(false);
      setStatus({
        type: 'success',
        text: 'Attendance marked successfully for this session.',
      });
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        title="Scan QR Code"
        subtitle="Scan the QR code displayed by your mentor to mark attendance for this session."
      />

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '480px',
        }}
      >
        {/* Camera placeholder */}
        <div
          style={{
            width: '260px',
            height: '260px',
            background: 'var(--bg-secondary)',
            border: `2px ${scanning ? 'solid' : 'dashed'} ${scanning ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s',
          }}
        >
          {scanning && (
            <>
              {/* Scan line animation */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px var(--accent)',
                  animation: 'scanLine 1.5s linear infinite',
                  top: 0,
                }}
              />
              <style>{`
                @keyframes scanLine {
                  0% { top: 0; }
                  100% { top: 100%; }
                }
              `}</style>
            </>
          )}

          {/* Corner brackets */}
          {['tl', 'tr', 'bl', 'br'].map((pos) => (
            <div
              key={pos}
              style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                ...(pos.includes('t') ? { top: '12px' } : { bottom: '12px' }),
                ...(pos.includes('l') ? { left: '12px' } : { right: '12px' }),
                borderTop: pos.includes('t')
                  ? `2px solid ${scanning ? 'var(--accent)' : 'var(--border-bright)'}`
                  : 'none',
                borderBottom: pos.includes('b')
                  ? `2px solid ${scanning ? 'var(--accent)' : 'var(--border-bright)'}`
                  : 'none',
                borderLeft: pos.includes('l')
                  ? `2px solid ${scanning ? 'var(--accent)' : 'var(--border-bright)'}`
                  : 'none',
                borderRight: pos.includes('r')
                  ? `2px solid ${scanning ? 'var(--accent)' : 'var(--border-bright)'}`
                  : 'none',
                transition: 'border-color 0.3s',
              }}
            />
          ))}

          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke={scanning ? 'var(--accent)' : 'var(--text-muted)'}
            strokeWidth="1.5"
            style={{ transition: 'stroke 0.3s' }}
          >
            <path d="M2 12h2M20 12h2M12 2v2M12 20v2" />
            <rect x="5" y="5" width="5" height="5" />
            <rect x="14" y="5" width="5" height="5" />
            <rect x="5" y="14" width="5" height="5" />
            <rect x="14" y="14" width="2" height="2" />
          </svg>
          <span
            style={{
              fontSize: '12px',
              color: scanning ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.3s',
            }}
          >
            {scanning ? 'Scanning...' : 'Camera preview here'}
          </span>
        </div>

        {status && (
          <div
            style={{
              padding: '12px 20px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              marginBottom: '20px',
              width: '100%',
              background:
                status.type === 'success'
                  ? 'rgba(0,212,170,0.08)'
                  : 'rgba(255,87,87,0.08)',
              border: `1px solid ${
                status.type === 'success'
                  ? 'rgba(0,212,170,0.3)'
                  : 'rgba(255,87,87,0.3)'
              }`,
              color:
                status.type === 'success' ? 'var(--accent)' : 'var(--accent-red)',
            }}
          >
            {status.type === 'success' ? '✓ ' : '✗ '}
            {status.text}
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={scanning}
          style={{
            background: scanning ? 'var(--bg-secondary)' : 'var(--accent)',
            color: scanning ? 'var(--text-secondary)' : 'var(--bg-primary)',
            border: scanning ? '1px solid var(--border)' : 'none',
            borderRadius: 'var(--radius)',
            padding: '11px 32px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: scanning ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            letterSpacing: '0.04em',
          }}
        >
          {scanning ? 'Scanning...' : '⬡ Scan QR Code'}
        </button>
        <p
          style={{
            marginTop: '12px',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          Camera integration pending backend setup
        </p>
      </div>
    </div>
  );
};

export default ScanQR;
