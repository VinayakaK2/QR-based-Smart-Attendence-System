import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './services/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'

import MentorDashboard, { MentorHome } from './pages/mentor/MentorDashboard'
import GenerateQR from './pages/mentor/GenerateQR'
import StudentAttendance from './pages/mentor/StudentAttendance'
import AddStudent from './pages/mentor/AddStudent'

import StudentDashboard, { StudentHome } from './pages/student/StudentDashboard'
import ScanQR from './pages/student/ScanQR'
import AttendanceReport from './pages/student/AttendanceReport'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Mentor routes */}
          <Route
            path="/mentor"
            element={
              <ProtectedRoute role="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<MentorHome />} />
            <Route path="generate-qr" element={<GenerateQR />} />
            <Route path="students" element={<StudentAttendance />} />
            <Route path="add-student" element={<AddStudent />} />
          </Route>

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentHome />} />
            <Route path="scan" element={<ScanQR />} />
            <Route path="report" element={<AttendanceReport />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
