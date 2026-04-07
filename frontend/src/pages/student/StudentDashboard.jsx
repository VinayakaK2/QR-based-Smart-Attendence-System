import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../services/AuthContext';

const studentLinks = [
  { to: '/student/dashboard', label: '⊞ Dashboard' },
  { to: '/student/scan', label: '⬡ Scan QR' },
  { to: '/student/report', label: '≡ My Attendance' },
];

const StudentDashboard = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}
    >
      <Navbar links={studentLinks} />
      <main
        style={{
          flex: 1,
          padding: '32px 24px',
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export const StudentHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Student Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
          Logged in as{' '}
          <span style={{ color: 'var(--accent)' }}>{user?.usn}</span>
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Use the navigation above to scan a QR code for attendance or view your attendance report.
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
