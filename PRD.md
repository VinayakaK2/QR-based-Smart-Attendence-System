# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: QR-Based Smart Attendance System
## Project ID: P-0005
## Domain: EdTech / Smart Campus

---

# 1. 🧠 Problem Statement

In many colleges, attendance is still recorded manually or via basic QR systems that are vulnerable to proxy attendance. Students can mark attendance without being physically present or by sharing QR codes.

There is a need for a secure, real-time, and tamper-resistant attendance system that ensures only actively present students are marked present.

---

# 2. 🎯 Objective

Build a QR-based attendance system integrated into a mobile/web platform that:
- Ensures real-time attendance marking
- Minimizes proxy attendance
- Tracks active student presence during session
- Provides a simple interface for teachers and students

---

# 3. 👥 Target Users

### Primary Users:
- Students
- Teachers

### Secondary Users:
- College administration (optional future scope)

---

# 4. 💡 Solution Overview

The system will:
1. Allow teachers to create a live attendance session
2. Generate a unique QR code for that session
3. Students scan QR via mobile app/web
4. Attendance is recorded ONLY if:
   - Session is active
   - Student remains active in app during session
5. If student exits app → attendance invalidated

---

# 5. 🔥 Key Features (MVP)

## 5.1 Teacher Side
- Login / Authentication
- Start attendance session
- Generate dynamic QR code
- End session
- View attendance list

## 5.2 Student Side
- Login / Authentication
- Scan QR code
- Join attendance session
- Active presence tracking

## 5.3 System Features
- Session-based attendance
- Anti-proxy mechanism:
  - Session validation
  - App activity tracking
- Backend validation
- Data storage

---

# 6. ❌ Non-Goals (Important)

(Not included in MVP)
- Face recognition
- GPS tracking
- AI analytics
- Multi-institution scaling
- Advanced reporting dashboards

---

# 7. 🔄 User Flow

## 7.1 Teacher Flow
1. Login
2. Click "Start Session"
3. System generates session ID + QR code
4. Display QR on screen
5. Monitor live attendance count
6. End session
7. View attendance report

## 7.2 Student Flow
1. Login
2. Click "Scan QR"
3. Scan teacher’s QR
4. System validates session
5. Student enters active session
6. App tracks activity
7. Attendance marked after validation

---

# 8. 🧩 Functional Requirements

## 8.1 Authentication
- Users must login (Student / Teacher role)

## 8.2 QR Generation
- Unique QR per session
- Contains session ID (not sensitive data)

## 8.3 QR Scanning
- Camera-based scanning
- Extract session ID

## 8.4 Attendance Validation
- Check:
  - Session active
  - Student not already marked
  - Valid request timing

## 8.5 Active Presence Tracking
- Detect:
  - App minimized
  - Tab switched (for web)
- If inactive → invalidate attendance

## 8.6 Session Management
- Session start / end
- Timeout support

## 8.7 Data Storage
Store:
- Student ID
- Session ID
- Timestamp
- Status (valid / invalid)

---

# 9. ⚙️ Non-Functional Requirements

- System should handle multiple users simultaneously
- Response time < 2 seconds
- Secure API endpoints
- Minimal battery usage (for mobile)

---

# 10. 🏗️ System Architecture

### High-Level Architecture

Client Layer:
- Mobile App / Web App (Student)
- Web Panel (Teacher)

Backend Layer:
- REST API Server

Database:
- Attendance records
- Users
- Sessions

---

# 11. 🔌 Tech Stack (Suggested)

Frontend:
- React / Flutter / React Native

Backend:
- Node.js (Express) / Django

Database:
- MongoDB / PostgreSQL

QR:
- QR generation library
- QR scanner library

---

# 12. 🗄️ Database Design (Basic)

### Users Table
- id
- name
- role (student/teacher)

### Sessions Table
- session_id
- teacher_id
- start_time
- end_time
- status

### Attendance Table
- id
- student_id
- session_id
- timestamp
- status (valid/invalid)

---

# 13. 🔐 Security Considerations

- Prevent duplicate attendance
- Validate session server-side
- Avoid exposing sensitive data in QR
- Basic authentication protection

---

# 14. ⚠️ Risks & Limitations

- Cannot fully eliminate proxy attendance
- App activity tracking may vary across devices
- Network dependency

---

# 15. 📊 Success Metrics

- Successful attendance marking rate
- Reduced proxy attendance cases
- System uptime during sessions
- Demo completeness

---

# 16. 🧪 Future Scope (Optional)

- Face verification
- GPS validation
- Analytics dashboard
- Integration with college ERP

---

# 17. 🎬 Demo Flow (IMPORTANT)

1. Teacher starts session
2. QR displayed
3. Student scans QR
4. Attendance recorded
5. Student leaves app → attendance invalid
6. Teacher ends session
7. Final attendance shown

---

# 18. 📌 Final Definition

This system is a **session-based, QR-authenticated attendance platform with active presence validation**, designed to reduce proxy attendance and improve classroom attendance integrity.

---
