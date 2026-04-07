// Simulated student database
// Each student has a USN and an associated mobile IP address
let studentDatabase = [
  { usn: 'U24E01CS006', ip: '192.168.1.101' },
  { usn: 'U24E01CS004', ip: '192.168.1.102' },
  { usn: 'U24E01CS010', ip: '192.168.1.103' },
  { usn: 'U24E01CS005', ip: '192.168.1.145' },
  { usn: 'U24E01CS050', ip: '192.168.1.110' },
];

export const getStudents = () => [...studentDatabase];

export const addStudent = (usn, ip) => {
  const exists = studentDatabase.find(
    (s) => s.usn.toLowerCase() === usn.toLowerCase()
  );
  if (exists) return { success: false, message: 'USN already registered.' };
  studentDatabase.push({ usn: usn.toUpperCase(), ip });
  return { success: true, message: 'Student added successfully.' };
};

export const validateStudent = (usn) => {
  return studentDatabase.some(
    (s) => s.usn.toLowerCase() === usn.toLowerCase()
  );
};

// Dummy attendance data per USN
const attendanceMap = {
  'U24E01CS004': { total: 42, present: 38 },
  'U24E01CS005': { total: 42, present: 30 },
  'U24E01CS010': { total: 42, present: 42 },
  'U24E01CS050': { total: 42, present: 25 },
  'U24E01CS006': { total: 42, present: 35 },
};

export const getAttendance = (usn) => {
  const data = attendanceMap[usn?.toUpperCase()] || { total: 42, present: 20 };
  return {
    total: data.total,
    present: data.present,
    absent: data.total - data.present,
    percentage: ((data.present / data.total) * 100).toFixed(1),
  };
};
