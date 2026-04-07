import React, { useState } from 'react';
import { PageHeader } from '../../components/Card';

const GenerateQR = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const handleGenerate = () => {
    const id = `SESSION-${Date.now().toString(36).toUpperCase()}`;
    setSessionId(id);
    setSessionActive(true);
  };

  const handleStop = () => {
    setSessionActive(false);
    setSessionId('');
  };

  return (
    <div>
      <PageHeader
        title="Generate QR Session"
        subtitle="Start a new attendance session. Students scan the QR code to mark themselves present."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Controls */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Session Controls
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '6px',
              }}
            >
              Status
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: '3px',
                background: sessionActive
                  ? 'rgba(0, 212, 170, 0.1)'
                  : 'rgba(255, 87, 87, 0.08)',
                border: `1px solid ${sessionActive ? 'var(--accent-dim)' : 'rgba(255,87,87,0.3)'}`,
                fontSize: '12px',
                fontWeight: 600,
                color: sessionActive ? 'var(--accent)' : 'var(--accent-red)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: sessionActive ? 'var(--accent)' : 'var(--accent-red)',
                  animation: sessionActive ? 'pulse 1.5s infinite' : 'none',
                }}
              />
              {sessionActive ? 'SESSION LIVE' : 'NO ACTIVE SESSION'}
            </div>
          </div>

          {sessionActive && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                }}
              >
                Session ID
              </div>
              <code
                style={{
                  display: 'block',
                  padding: '8px 12px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--accent-yellow)',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                }}
              >
                {sessionId}
              </code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {!sessionActive ? (
              <button
                onClick={handleGenerate}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                ▶ Generate QR Session
              </button>
            ) : (
              <button
                onClick={handleStop}
                style={{
                  background: 'transparent',
                  color: 'var(--accent-red)',
                  border: '1px solid rgba(255,87,87,0.4)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ■ End Session
              </button>
            )}
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}</style>
        </div>

        {/* QR Placeholder */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '24px',
              color: 'var(--text-primary)',
              alignSelf: 'flex-start',
            }}
          >
            QR Code
          </h2>

          {sessionActive ? (
            <div>
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--accent-dim)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Placeholder QR grid */}
                <svg viewBox="0 0 100 100" width="160" height="160" style={{ opacity: 0.3 }}>
                  {[0,1,2,3,4,5,6].map(row =>
                    [0,1,2,3,4,5,6].map(col => {
                      const val = (row * 7 + col * 3 + row + col) % 3;
                      return val === 0 ? (
                        <rect
                          key={`${row}-${col}`}
                          x={col * 14 + 1}
                          y={row * 14 + 1}
                          width="12"
                          height="12"
                          fill="var(--accent)"
                        />
                      ) : null;
                    })
                  )}
                  {/* Corner squares */}
                  <rect x="1" y="1" width="26" height="26" fill="none" stroke="var(--accent)" strokeWidth="3" />
                  <rect x="73" y="1" width="26" height="26" fill="none" stroke="var(--accent)" strokeWidth="3" />
                  <rect x="1" y="73" width="26" height="26" fill="none" stroke="var(--accent)" strokeWidth="3" />
                  <rect x="7" y="7" width="14" height="14" fill="var(--accent)" />
                  <rect x="79" y="7" width="14" height="14" fill="var(--accent)" />
                  <rect x="7" y="79" width="14" height="14" fill="var(--accent)" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                QR code will be rendered here
                <br />
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                  (QR library integration pending)
                </span>
              </p>
            </div>
          ) : (
            <div
              style={{
                width: '200px',
                height: '200px',
                background: 'var(--bg-secondary)',
                border: '2px dashed var(--border)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span style={{ fontSize: '12px' }}>No active session</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQR;
