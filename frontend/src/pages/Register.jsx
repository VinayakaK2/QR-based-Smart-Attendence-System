import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, getSections } from '../services/api';
import FaceCapture from '../components/FaceCapture';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=details, 2=face (students only)
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student', section_id: '',
  });
  const [faceImage, setFaceImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getSections().then((r) => setSections(r.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const goToStep2 = (e) => {
    e.preventDefault();
    if (formData.role === 'student') setStep(2);
    else handleSubmit();
  };

  const handleSubmit = async (photo = faceImage) => {
    if (formData.role === 'student' && !photo) {
      setError('Please capture your face photo before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, section_id: formData.section_id ? parseInt(formData.section_id) : null };
      if (formData.role === 'student') payload.face_image_base64 = photo;
      await register(payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: '80px 20px 40px' }}>
      <div className="card fade-in-up" style={{ width: '100%', maxWidth: 520 }}>
        <div className="text-center mb-24">
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>✨</div>
          <h1 style={{ fontSize: '1.75rem' }}>
            Create your <span className="gradient-text">Account</span>
          </h1>
          <p style={{ marginTop: 8, fontSize: '0.9rem' }}>Join the Smart Attendance System</p>
        </div>

        {/* Step indicator (for students) */}
        {formData.role === 'student' && (
          <div className="steps mb-24">
            <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`} />
            <div className={`step ${step >= 2 ? 'active' : ''}`} />
          </div>
        )}

        {error && <div className="alert alert-error mb-16">{error}</div>}
        {success && <div className="alert alert-success mb-16">{success}</div>}

        {step === 1 && (
          <form onSubmit={goToStep2} className="flex-col gap-16">
            <div className="form-group">
              <label className="label">Full Name</label>
              <input id="input-name" className="input" type="text" name="name"
                placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input id="input-email" className="input" type="email" name="email"
                placeholder="you@college.edu" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input id="input-password" className="input" type="password" name="password"
                placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} required minLength={8} />
            </div>
            <div className="form-group">
              <label className="label">I am a</label>
              <select id="input-role" className="select" name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
            {formData.role === 'student' && (
              <div className="form-group">
                <label className="label">Section</label>
                <select id="input-section" className="select" name="section_id" value={formData.section_id} onChange={handleChange} required>
                  <option value="">-- Select Section --</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
            <button id="btn-next" className="btn btn-primary btn-full btn-lg" type="submit">
              {formData.role === 'student' ? '→ Next: Face Capture' : (loading ? 'Creating account...' : '→ Create Account')}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="flex-col gap-24">
            <div className="alert alert-info">
              📸 Your face photo is used for identity verification. <strong>No raw image is stored</strong> — only a mathematical embedding.
            </div>
            <FaceCapture onCapture={(img) => setFaceImage(img)} />
            <div className="flex gap-12">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button id="btn-register-submit" className="btn btn-primary" style={{ flex: 2 }}
                onClick={() => handleSubmit(faceImage)} disabled={!faceImage || loading}>
                {loading ? 'Registering...' : '✓ Complete Registration'}
              </button>
            </div>
          </div>
        )}

        <div className="divider" />
        <p className="text-center" style={{ fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
