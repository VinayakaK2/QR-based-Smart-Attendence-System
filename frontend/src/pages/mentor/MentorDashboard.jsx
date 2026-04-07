import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const mentorLinks = [
  { to: '/mentor/dashboard', label: '⊞ Dashboard' },
  { to: '/mentor/generate-qr', label: '⬡ Generate QR' },
  { to: '/mentor/students', label: '≡ Attendance' },
  { to: '/mentor/add-student', label: '+ Add Student' },
];

const pageStyle = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-primary)',
  },
  content: {
    flex: 1,
    padding: '32px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
};

const MentorDashboard = () => {
  return (
    <div style={pageStyle.layout}>
      <Navbar links={mentorLinks} />
      <main style={pageStyle.content}>
        <Outlet />
      </main>
    </div>
  );
};

export const MentorHome = () => (
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
        Mentor Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '13px' }}>
        Welcome back. Manage your sessions and track student attendance.
      </p>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}
    >
      {[
        { label: 'Total Students', value: '5', accent: false },
        { label: 'Sessions Run', value: '42', accent: false },
        { label: 'Avg Attendance', value: '80.9%', accent: true },
        { label: 'At Risk (<75%)', value: '1', accent: false },
      ].map(({ label, value, accent }) => (
        <div
          key={label}
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${accent ? 'var(--accent-dim)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              fontSize: '30px',
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
      ))}
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
        Use the navigation above to generate a QR session, view attendance records, or add new students.
      </p>
    </div>
  </div>
);

export default MentorDashboard;
