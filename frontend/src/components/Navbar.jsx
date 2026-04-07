import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const navStyles = {
  nav: {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '16px',
    color: 'var(--accent)',
    letterSpacing: '0.04em',
    marginRight: '32px',
    whiteSpace: 'nowrap',
  },
  dot: {
    display: 'inline-block',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--accent)',
    marginRight: '8px',
    verticalAlign: 'middle',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: 'auto',
  },
  badge: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent-dim)',
    color: 'var(--accent)',
    padding: '2px 10px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid var(--border-bright)',
    color: 'var(--text-secondary)',
    padding: '5px 14px',
    borderRadius: 'var(--radius)',
    fontSize: '12px',
    transition: 'var(--transition)',
    cursor: 'pointer',
  },
};

const Navbar = ({ links }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyles.nav}>
      <span style={navStyles.brand}>
        <span style={navStyles.dot} />
        QR Attend
      </span>
      <div style={navStyles.links}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              border: isActive ? '1px solid var(--accent-dim)' : '1px solid transparent',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>
      <div style={navStyles.right}>
        {user?.usn && (
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {user.usn}
          </span>
        )}
        <span style={navStyles.badge}>{user?.role}</span>
        <button
          style={navStyles.logoutBtn}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--accent-red)';
            e.target.style.borderColor = 'var(--accent-red)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--text-secondary)';
            e.target.style.borderColor = 'var(--border-bright)';
          }}
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
