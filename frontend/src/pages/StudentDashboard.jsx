import React, { useState, useEffect } from 'react';
import { getMyHistory } from '../services/api';
import Navbar from '../components/Navbar';
import QRScanner from '../components/QRScanner';
import MarkAttendance from './MarkAttendance';

const StudentDashboard = () => {
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('dashboard');
  const [scannedToken, setScannedToken] = useState(null);
  const [scannedSessionId, setScannedSessionId] = useState(null);

  useEffect(() => { getMyHistory().then((r) => setHistory(r.data)).catch(() => {}); }, []);

  const handleQRScan = (decodedText) => {
    try {
      const payload = JSON.parse(atob(decodedText.split('.')[1]));
      setScannedToken(decodedText);
      setScannedSessionId(payload.session_id);
      setView('mark');
    } catch {
      alert('Invalid QR code. Please scan the SmartAttend QR.');
    }
  };

  const present = history.filter((r) => r.status === 'PRESENT').length;
  const total = history.length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <>
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <Navbar />

      <div style={{ paddingTop: 64, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ padding: '40px 24px' }}>

          {view === 'dashboard' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-32">
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--neon-green)', textTransform: 'uppercase' }}>Student Portal</span>
                  <h1 style={{ marginTop: 6 }}>
                    My <span className="gradient-text">Attendance</span>
                  </h1>
                  <p>Track your attendance record across all sessions</p>
                </div>
                <button id="btn-scan-qr" className="btn btn-primary btn-lg btn-pulse" onClick={() => setView('scan')}>
                  ◎ Scan QR Code
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                  { value: total, label: 'Total Sessions', color: 'var(--neon-purple)', icon: '◈' },
                  { value: present, label: 'Present', color: 'var(--neon-green)', icon: '✓' },
                  { value: total - present, label: 'Rejected', color: 'var(--neon-red)', icon: '✗' },
                  { value: `${rate}%`, label: 'Attendance Rate', color: 'var(--neon-cyan)', icon: '◎' },
                ].map(({ value, label, color, icon }) => (
                  <div key={label} className="stat-card fade-in-up">
                    <div style={{ color: color, fontSize: '1.4rem', marginBottom: 4 }}>{icon}</div>
                    <div className="stat-value" style={{ color }}>{value}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>

              {/* Attendance Rate Bar */}
              <div className="card mb-24">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    Attendance Integrity Score
                  </span>
                  <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: rate >= 75 ? 'var(--neon-green)' : 'var(--neon-red)' }}>
                    {rate}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${rate}%`,
                    background: rate >= 75 ? 'linear-gradient(90deg, var(--neon-purple), var(--neon-green))' : 'linear-gradient(90deg, var(--neon-red), var(--neon-yellow))',
                    borderRadius: 3,
                    boxShadow: rate >= 75 ? '0 0 10px rgba(0,255,136,0.5)' : '0 0 10px rgba(255,59,92,0.5)',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>

              {/* History Table */}
              <div className="card fade-in-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ color: 'var(--neon-purple)' }}>◈</span>
                  <h3>Attendance History</h3>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Section</th><th>Date & Time</th><th>Status</th><th>Reason</th></tr>
                    </thead>
                    <tbody>
                      {history.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', padding: '32px' }}>
                          // No records. Scan a QR to mark attendance.
                        </td></tr>
                      )}
                      {history.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{r.section_name}</td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {new Date(r.timestamp).toLocaleString()}
                          </td>
                          <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.reason || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {view === 'scan' && (
            <div className="flex-col gap-24 items-center">
              <div className="card fade-in-up" style={{ maxWidth: 480, width: '100%' }}>
                <div className="flex items-center justify-between mb-24">
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--neon-cyan)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      QR Verification
                    </span>
                    <h2>Scan Attendance Code</h2>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setView('dashboard')}>← Back</button>
                </div>
                <QRScanner onScan={handleQRScan} onError={(e) => console.error(e)} />
              </div>
            </div>
          )}

          {view === 'mark' && scannedToken && (
            <MarkAttendance
              token={scannedToken}
              sessionId={scannedSessionId}
              onDone={() => { setView('dashboard'); getMyHistory().then((r) => setHistory(r.data)); }}
              onBack={() => setView('scan')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
