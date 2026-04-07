import React from 'react';
import { PageHeader } from '../../components/Card';
import { useAuth } from '../../services/AuthContext';
import { getAttendance } from '../../services/studentService';

const AttendanceReport = () => {
  const { user } = useAuth();
  const data = getAttendance(user?.usn);

  const pct = parseFloat(data.percentage);
  const statusColor =
    pct >= 85 ? 'var(--accent)' : pct >= 75 ? 'var(--accent-yellow)' : 'var(--accent-red)';
  const statusText =
    pct >= 85 ? 'Good Standing' : pct >= 75 ? 'On Track' : 'At Risk';

  const stats = [
    { label: 'Total Classes', value: data.total, accent: false },
    { label: 'Present', value: data.present, accent: false },
    { label: 'Absent', value: data.absent, accent: false },
    { label: 'Percentage', value: `${data.percentage}%`, accent: true },
  ];

  // Dummy session log
  const sessionLog = Array.from({ length: 10 }, (_, i) => ({
    session: `Session ${i + 1}`,
    date: `2025-0${Math.min(i + 1, 9)}-${String((i * 3 + 5) % 28 + 1).padStart(2, '0')}`,
    status: i % 5 === 4 ? 'Absent' : 'Present',
  }));

  return (
    <div>
      <PageHeader
        title="Attendance Report"
        subtitle={`Overview for ${user?.usn}`}
      />

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {stats.map(({ label, value, accent }) => (
          <div
            key={label}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${accent ? 'var(--accent-dim)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '20px',
            }}
          >
            <div
              style={{
                fontSize: '30px',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: accent ? statusColor : 'var(--text-primary)',
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

      {/* Progress bar card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Attendance Progress
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 700,
              background: `${statusColor}18`,
              border: `1px solid ${statusColor}55`,
              color: statusColor,
            }}
          >
            {statusText}
          </span>
        </div>
        <div
          style={{
            height: '8px',
            background: 'var(--bg-primary)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${data.percentage}%`,
              height: '100%',
              background: statusColor,
              borderRadius: '4px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <div
          style={{
            marginTop: '10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {pct < 75
            ? `⚠ You need ${Math.ceil((0.75 * data.total - data.present) / 0.25)} more classes to reach 75%.`
            : `✓ You meet the minimum 75% attendance requirement.`}
        </div>
      </div>

      {/* Session log */}
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
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          Recent Sessions
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Session', 'Date', 'Status'].map((h) => (
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
            {sessionLog.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border)',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                }}
              >
                <td
                  style={{
                    padding: '11px 20px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                  }}
                >
                  {row.session}
                </td>
                <td
                  style={{
                    padding: '11px 20px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  {row.date}
                </td>
                <td style={{ padding: '11px 20px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background:
                        row.status === 'Present'
                          ? 'rgba(0,212,170,0.1)'
                          : 'rgba(255,87,87,0.1)',
                      border: `1px solid ${
                        row.status === 'Present'
                          ? 'rgba(0,212,170,0.3)'
                          : 'rgba(255,87,87,0.3)'
                      }`,
                      color:
                        row.status === 'Present' ? 'var(--accent)' : 'var(--accent-red)',
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
