import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(username.trim(), password.trim());
      setLoading(false);
      if (result.success) {
        navigate(result.role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
      } else {
        setError(result.message);
      }
    }, 400);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color var(--transition)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.4,
        }}
      />
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent-dim)',
              borderRadius: '10px',
              marginBottom: '16px',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            QR Attendance
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            Smart Session Tracking System
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '32px',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Username / USN</label>
              <input
                style={inputStyle}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mentor  or  1MS21CS001"
                required
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(255, 87, 87, 0.1)',
                  border: '1px solid rgba(255, 87, 87, 0.3)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  color: 'var(--accent-red)',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'var(--accent-dim)' : 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '11px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background var(--transition)',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>
        </div>

        {/* Hint */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px 16px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            color: 'var(--text-muted)',
            lineHeight: '1.8',
          }}
        >
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Demo credentials:</span>
          <br />
          Mentor → username: <code style={{ color: 'var(--accent-yellow)' }}>mentor</code> / pass: <code style={{ color: 'var(--accent-yellow)' }}>mentor</code>
          <br />
          Student → USN: <code style={{ color: 'var(--accent-yellow)' }}>1MS21CS001</code> / pass: <code style={{ color: 'var(--accent-yellow)' }}>student</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
