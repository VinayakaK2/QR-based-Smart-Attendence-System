import React, { useState } from 'react';
import { PageHeader } from '../../components/Card';
import { addStudent, getStudents } from '../../services/studentService';

const AddStudent = () => {
  const [usn, setUsn] = useState('');
  const [ip, setIp] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [students, setStudents] = useState(getStudents());

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addStudent(usn.trim(), ip.trim());
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setUsn('');
      setIp('');
      setStudents(getStudents());
    }
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
    <div>
      <PageHeader
        title="Add Student"
        subtitle="Register a new student by entering their USN and mobile IP address."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Form */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '24px',
            }}
          >
            Student Registration
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Student USN</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. 1MS21CS099"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Mobile IP Address</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. 192.168.1.199"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-dim)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {message && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  marginBottom: '20px',
                  background:
                    message.type === 'success'
                      ? 'rgba(0,212,170,0.08)'
                      : 'rgba(255,87,87,0.08)',
                  border: `1px solid ${
                    message.type === 'success'
                      ? 'rgba(0,212,170,0.3)'
                      : 'rgba(255,87,87,0.3)'
                  }`,
                  color:
                    message.type === 'success' ? 'var(--accent)' : 'var(--accent-red)',
                }}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'var(--accent)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              + Register Student
            </button>
          </form>
        </div>

        {/* Enrolled list */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Enrolled Students
            </span>
            <span
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-dim)',
                color: 'var(--accent)',
                padding: '2px 10px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {students.length}
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                {['#', 'USN', 'Mobile IP'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '9px 20px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.usn}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}
                >
                  <td
                    style={{
                      padding: '11px 20px',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                    }}
                  >
                    {i + 1}
                  </td>
                  <td
                    style={{
                      padding: '11px 20px',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {s.usn}
                  </td>
                  <td
                    style={{
                      padding: '11px 20px',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                    }}
                  >
                    {s.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
