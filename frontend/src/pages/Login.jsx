import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData);
      const { access_token, user_id, role } = res.data;
      loginUser({ user_id, role, email: formData.email }, access_token);
      navigate(role === 'lecturer' ? '/lecturer/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card fade-in-up" style={{ width: '100%', maxWidth: 440 }}>
        {/* Brand */}
        <div className="text-center mb-24">
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: '1.75rem' }}>
            Welcome back to <span className="gradient-text">SmartAttend</span>
          </h1>
          <p style={{ marginTop: 8, fontSize: '0.9rem' }}>Sign in to continue</p>
        </div>

        {error && <div className="alert alert-error mb-16">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-16">
          <div className="form-group">
            <label className="label">Email address</label>
            <input id="input-email" className="input" type="email" name="email"
              placeholder="you@college.edu" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input id="input-password" className="input" type="password" name="password"
              placeholder="Enter password" value={formData.password} onChange={handleChange} required />
          </div>

          <button id="btn-login" className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center" style={{ fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
