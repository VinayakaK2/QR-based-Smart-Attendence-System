import React, { useState } from 'react';
import { PageHeader } from '../../components/Card';
import { getStudents, getAttendance } from '../../services/studentService';

const StudentAttendance = () => {
  const students = getStudents();

  const rows = students.map((s) => {
    const att = getAttendance(s.usn);
    return { ...s, ...att };
  });

  const [search, setSearch] = useState('');
  const filtered = rows.filter((r) =>
    r.usn.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (pct) => {
    const p = parseFloat(pct);
    if (p >= 85) return 'var(--accent)';
    if (p >= 75) return 'var(--accent-yellow)';
    return 'var(--accent-red)';
  };

  return (
    <div>
      <PageHeader
        title="Student Attendance"
        subtitle={`Tracking ${students.length} enrolled students across all sessions.`}
      />

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        {/* Table header bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Records
          </span>
          <input
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '7px 12px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '220px',
              outline: 'none',
            }}
            placeholder="Search USN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-dim)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['USN', 'Mobile IP', 'Total Classes', 'Present', 'Absent', 'Percentage'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '10px 20px',
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '32px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '13px',
                  }}
                >
                  No students found.
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr
                  key={row.usn}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 20px',
                      color: 'var(--accent)',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {row.usn}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                    }}
                  >
                    {row.ip}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {row.total}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {row.present}
                  </td>
                  <td
                    style={{
                      padding: '12px 20px',
                      color: row.absent > 10 ? 'var(--accent-red)' : 'var(--text-primary)',
                      fontSize: '13px',
                    }}
                  >
                    {row.absent}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          flex: 1,
                          maxWidth: '80px',
                          height: '4px',
                          background: 'var(--bg-primary)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${row.percentage}%`,
                            height: '100%',
                            background: getColor(row.percentage),
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: getColor(row.percentage),
                          minWidth: '48px',
                        }}
                      >
                        {row.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
