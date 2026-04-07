import React, { useState, useEffect } from 'react';
import { getMyHistory } from '../services/api';
import Navbar from '../components/Navbar';
import QRScanner from '../components/QRScanner';
import MarkAttendance from './MarkAttendance';

const StudentDashboard = () => {
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'scan' | 'mark'
  const [scannedToken, setScannedToken] = useState(null);
  const [scannedSessionId, setScannedSessionId] = useState(null);

  useEffect(() => {
    getMyHistory().then((r) => setHistory(r.data)).catch(() => {});
  }, []);

  const handleQRScan = (decodedText) => {
    // The QR token is the JWT string itself. Parse session_id from it.
    // The token payload will be decoded by backend; frontend just passes it.
    // We store the raw token and show the mark attendance page.
    try {
      // Decode JWT payload (base64 - no signature check on client)
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

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 60, minHeight: '100vh', background: 'var(--gradient-hero)' }}>
        <div className="container" style={{ padding: '40px 24px' }}>

          {view === 'dashboard' && (
            <>
              <div className="flex items-center justify-between mb-24">
                <div>
                  <h1>🎒 Student <span className="gradient-text">Dashboard</span></h1>
                  <p>View your attendance history</p>
                </div>
                <button id="btn-scan-qr" className="btn btn-primary btn-lg" onClick={() => setView('scan')}>
                  📷 Scan QR
                </button>
              </div>

              <div className="grid-3 mb-24">
                <div className="stat-card fade-in-up">
                  <div className="stat-value gradient-text">{total}</div>
                  <div className="stat-label">Sessions Attended</div>
                </div>
                <div className="stat-card fade-in-up">
                  <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{present}</div>
                  <div className="stat-label">Present</div>
                </div>
                <div className="stat-card fade-in-up">
                  <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{total - present}</div>
                  <div className="stat-label">Rejected</div>
                </div>
              </div>

              <div className="card fade-in-up">
                <h3 className="mb-16">📋 Attendance History</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 && (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No history yet. Scan a QR to mark attendance!</td></tr>
                      )}
                      {history.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{r.section_name}</td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
                  <h2>📷 Scan Attendance QR</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => setView('dashboard')}>← Back</button>
                </div>
                <QRScanner
                  onScan={handleQRScan}
                  onError={(e) => console.error(e)}
                />
              </div>
            </div>
          )}

          {view === 'mark' && scannedToken && (
            <MarkAttendance
              token={scannedToken}
              sessionId={scannedSessionId}
              onDone={() => {
                setView('dashboard');
                getMyHistory().then((r) => setHistory(r.data));
              }}
              onBack={() => setView('scan')}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
