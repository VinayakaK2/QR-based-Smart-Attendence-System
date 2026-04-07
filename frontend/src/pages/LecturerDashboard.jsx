import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createSection, getSections, startSession, endSession, getMySessions, getSessionAttendance } from '../services/api';
import { getGeolocation } from '../utils/geolocation';
import Navbar from '../components/Navbar';

const LecturerDashboard = () => {
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [sessionForm, setSessionForm] = useState({ section_id: '', duration_minutes: 10 });
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [locStatus, setLocStatus] = useState('');

  useEffect(() => { loadData(); }, []);

  // Poll attendance every 5 seconds if there's an active session
  useEffect(() => {
    if (!activeSession) return;
    const t = setInterval(fetchAttendance, 5000);
    fetchAttendance();
    return () => clearInterval(t);
  }, [activeSession]);

  const loadData = async () => {
    const [sec, sess] = await Promise.all([getSections(), getMySessions()]);
    setSections(sec.data);
    const s = sess.data;
    setSessions(s);
    const active = s.find((x) => x.status === 'ACTIVE');
    if (active) setActiveSession(active);
  };

  const fetchAttendance = async () => {
    if (!activeSession) return;
    try {
      const res = await getSessionAttendance(activeSession.id);
      setAttendanceList(res.data);
    } catch {}
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setLoading(true);
    try {
      await createSection({ name: newSectionName });
      setNewSectionName('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create section');
    } finally { setLoading(false); }
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    // Request location permission and get live location of lecturer
    setLocStatus('📍 Requesting your location...');
    let lat, lng;
    try {
      const pos = await getGeolocation();
      lat = pos.latitude;
      lng = pos.longitude;
      setLocStatus(`✅ Location acquired: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      setError(`❌ Location required to start session: ${err.message}`);
      setLocStatus('');
      return;
    }

    setLoading(true);
    try {
      const res = await startSession({
        section_id: parseInt(sessionForm.section_id),
        duration_minutes: parseInt(sessionForm.duration_minutes),
        lecturer_lat: lat,
        lecturer_lng: lng,
      });
      setQrToken(res.data.qr_token);
      setActiveSession(res.data);
      setSessions((p) => [res.data, ...p]);
      setInfo(`✅ Session started! Ends at ${new Date(res.data.end_time).toLocaleTimeString()}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start session');
    } finally { setLoading(false); }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    setLoading(true);
    try {
      await endSession(activeSession.id);
      setActiveSession(null);
      setQrToken(null);
      setAttendanceList([]);
      setInfo('Session ended.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to end session');
    } finally { setLoading(false); }
  };

  const present = attendanceList.filter((r) => r.status === 'PRESENT').length;
  const rejected = attendanceList.filter((r) => r.status === 'REJECTED').length;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 60, minHeight: '100vh', background: 'var(--gradient-hero)' }}>
        <div className="container" style={{ padding: '40px 24px' }}>

          <div className="flex items-center justify-between mb-24">
            <div>
              <h1>👨‍🏫 Lecturer <span className="gradient-text">Dashboard</span></h1>
              <p>Manage your sections and attendance sessions</p>
            </div>
          </div>

          {error && <div className="alert alert-error mb-16">{error}</div>}
          {info && <div className="alert alert-success mb-16">{info}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* LEFT COLUMN */}
            <div className="flex-col gap-24">

              {/* Create Section */}
              <div className="card fade-in-up">
                <h3 className="mb-16">➕ Create Section</h3>
                <form onSubmit={handleCreateSection} className="flex gap-12">
                  <input id="input-section-name" className="input w-full" type="text"
                    placeholder="e.g. CS-A 2024" value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)} />
                  <button id="btn-create-section" className="btn btn-primary" type="submit" disabled={loading}>Add</button>
                </form>
                <div className="divider" />
                <div className="flex-col gap-8">
                  {sections.length === 0 && <p style={{ fontSize: '0.85rem' }}>No sections yet.</p>}
                  {sections.map((s) => (
                    <div key={s.id} className="flex items-center justify-between"
                      style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8 }}>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      <span className="badge badge-active">ID: {s.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Session */}
              <div className="card fade-in-up">
                <h3 className="mb-16">▶️ Start Attendance Session</h3>
                {activeSession ? (
                  <div className="flex-col gap-12">
                    <div className="alert alert-info">Session is ACTIVE. End it before starting a new one.</div>
                    <button id="btn-end-session" className="btn btn-danger btn-full" onClick={handleEndSession} disabled={loading}>
                      ⏹ End Session Now
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleStartSession} className="flex-col gap-16">
                    <div className="form-group">
                      <label className="label">Section</label>
                      <select id="input-session-section" className="select" value={sessionForm.section_id}
                        onChange={(e) => setSessionForm((p) => ({ ...p, section_id: e.target.value }))} required>
                        <option value="">-- Select a section --</option>
                        {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Duration (minutes)</label>
                      <input id="input-duration" className="input" type="number" min="1" max="180"
                        value={sessionForm.duration_minutes}
                        onChange={(e) => setSessionForm((p) => ({ ...p, duration_minutes: e.target.value }))} />
                    </div>
                    {locStatus && <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>{locStatus}</div>}
                    <div className="alert alert-warning" style={{ fontSize: '0.82rem' }}>
                      📍 Your device's <strong>live location</strong> will be captured when you start the session.
                      Students must be within <strong>50 meters</strong> of your location.
                    </div>
                    <button id="btn-start-session" className="btn btn-success btn-full" type="submit" disabled={loading}>
                      {loading ? 'Starting...' : '▶ Start Session & Get QR'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-col gap-24">

              {/* QR Code Display */}
              {activeSession && qrToken && (
                <div className="card fade-in-up text-center">
                  <h3 className="mb-16">📱 Session QR Code</h3>
                  <div className="alert alert-success mb-16" style={{ fontSize: '0.85rem' }}>
                    Show this QR to your students. It expires when session ends.
                  </div>
                  <div className="qr-box" style={{ margin: '0 auto', maxWidth: 280 }}>
                    <QRCodeSVG value={qrToken} size={240} level="H" />
                    <p style={{ color: '#333', fontSize: '0.8rem', fontWeight: 600 }}>SmartAttend QR</p>
                  </div>
                  <div className="flex justify-between mt-16" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>Session ID: <strong style={{ color: 'var(--text-primary)' }}>#{activeSession.id}</strong></span>
                    <span>Ends: <strong style={{ color: 'var(--accent-yellow)' }}>
                      {new Date(activeSession.end_time).toLocaleTimeString()}
                    </strong></span>
                  </div>
                </div>
              )}

              {/* Live Attendance */}
              {activeSession && (
                <div className="card fade-in-up">
                  <div className="flex items-center justify-between mb-16">
                    <h3>📋 Live Attendance</h3>
                    <div className="flex gap-8">
                      <span className="badge badge-present">{present} Present</span>
                      <span className="badge badge-rejected">{rejected} Rejected</span>
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Status</th>
                          <th>Reason</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceList.length === 0 && (
                          <tr><td colSpan={4} style={{ textAlign:'center', color:'var(--text-muted)' }}>No submissions yet</td></tr>
                        )}
                        {attendanceList.map((r, i) => (
                          <tr key={i}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{r.student_name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.email}</div>
                            </td>
                            <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.reason || '—'}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {new Date(r.timestamp).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LecturerDashboard;
