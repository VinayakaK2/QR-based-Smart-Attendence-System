import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        flexDirection: 'column',
        gap: 64,
      }}>
        {/* Hero */}
        <div className="text-center fade-in-up" style={{ maxWidth: 720 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎓</div>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: 16 }}>
            Smart Attendance
            <br />
            <span className="gradient-text">That Can't Be Faked</span>
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Multi-layered attendance verification using time-bound QR codes,
            real-time face recognition, and GPS location validation — all in the browser.
          </p>
          <div className="flex gap-16 items-center" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={user.role === 'lecturer' ? '/lecturer/dashboard' : '/student/dashboard'}
                className="btn btn-primary btn-lg">
                → Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
                <Link to="/register" className="btn btn-ghost btn-lg">Create Account</Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 900, width: '100%' }}>
          {[
            { icon: '⏱️', title: 'Time-Bound QR', desc: 'QR codes expire exactly when the session ends. No sharing, no reuse.' },
            { icon: '🤖', title: 'Face Recognition', desc: 'FaceNet embeddings verify identity. Raw images are never stored.' },
            { icon: '📍', title: 'GPS Verification', desc: 'Students must be within 50m of the lecturer\'s classroom location.' },
          ].map((f) => (
            <div key={f.title} className="card fade-in-up text-center">
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.88rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
