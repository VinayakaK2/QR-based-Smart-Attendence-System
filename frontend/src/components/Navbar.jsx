import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand gradient-text">
        🎓 SmartAttend
      </Link>
      <div className="navbar-actions">
        {user ? (
          <>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {user.role === 'lecturer' ? '👨‍🏫' : '🎒'} {user.name || user.email}
            </span>
            <button id="btn-logout" className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
