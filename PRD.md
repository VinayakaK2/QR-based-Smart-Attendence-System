# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Project: QR-Based Smart Attendance System
## Project ID: P-0005
## Domain: EdTech / Smart Campus

---

# 1. 🎯 Problem Statement

Traditional attendance systems (manual or QR-based) are:

* Time-consuming
* Prone to proxy attendance
* Lack identity verification
* Do not ensure physical presence

---

# 2. 🎯 Objective

Build a **web-based smart attendance system** that ensures:

* Only registered students can mark attendance
* Student identity is verified via face recognition
* Attendance is allowed only within a valid session time
* Students must be physically present (via location constraint)

---

# 3. 👥 User Roles

## 3.1 Lecturer

* Create sections
* Start/stop attendance sessions
* Define session duration
* View attendance reports

## 3.2 Student

* Register with face data
* Join section
* Scan QR and mark attendance

---

# 4. 🧩 Core Features

## 4.1 Section Management

* Lecturer creates section
* Generates **static QR (section-only)**

## 4.2 Student Registration

* Name, branch, section
* Mandatory face capture
* Store **face embedding (NOT raw image)**

## 4.3 Session Management

* Lecturer starts session
* Sets duration (e.g., 10 mins)
* System generates **time-bound QR**

## 4.4 Attendance Flow

* Student scans QR
* Captures face
* Location verified
* Face matched with stored embedding
* Attendance recorded if valid

---

# 5. ⚙️ Functional Requirements

## 5.1 Lecturer

* Create section
* Start session with duration
* End session manually (optional)
* View attendance list

## 5.2 Student

* Register with face
* Scan QR
* Submit face + location
* View attendance status

---

# 6. 🔐 Non-Functional Requirements

* Response time < 2 sec
* Face match accuracy > 90%
* Secure API (JWT auth)
* Scalable to 1000+ users

---

# 7. 🏗️ System Architecture

```
[ Browser (React) ]
        ↓
[ Backend API (Flask / Node) ]
        ↓
[ Face Recognition Service (Python) ]
        ↓
[ Database (PostgreSQL / MySQL) ]
```

---

# 8. 🔄 System Flow

## 8.1 Registration Flow

1. Student enters details
2. Captures face
3. Backend generates embedding
4. Store in DB

---

## 8.2 Attendance Flow

1. Lecturer starts session
2. QR generated (session_id + expiry)
3. Student scans QR
4. Capture face + location
5. Backend validates:

   * Session active
   * Face match
   * Location within range
6. Attendance stored

---

# 9. 🧠 Face Recognition Design

## Model Options:

* FaceNet
* Dlib

## Flow:

```
Image → Face Detection → Embedding → Compare → Decision
```

## Matching:

* Cosine similarity
* Threshold: 0.6–0.8

---

# 10. 📡 Location Validation

* Use browser geolocation API
* Validate within radius (50–100m)
* Use Haversine formula

---

# 11. 🗄️ Database Design

## Users Table

```sql
users (
  id INT PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  role ENUM('student','lecturer')
)
```

## Sections

```sql
sections (
  id INT PRIMARY KEY,
  name VARCHAR,
  lecturer_id INT
)
```

## Students

```sql
students (
  id INT PRIMARY KEY,
  user_id INT,
  section_id INT,
  face_embedding TEXT
)
```

## Sessions

```sql
sessions (
  id INT PRIMARY KEY,
  section_id INT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR
)
```

## Attendance

```sql
attendance (
  id INT PRIMARY KEY,
  session_id INT,
  student_id INT,
  timestamp TIMESTAMP,
  status VARCHAR,
  reason VARCHAR
)
```

---

# 12. 🔌 API Design

## Auth

```
POST /api/auth/register
POST /api/auth/login
```

## Section

```
POST /api/section/create
GET  /api/section/:id
```

## Session

```
POST /api/session/start
POST /api/session/end
```

## Attendance

```
POST /api/attendance/mark
GET  /api/attendance/:session_id
```

---

# 13. 📁 Folder Structure

## Frontend (React)

```
/frontend
  /src
    /components
      QRScanner.jsx
      FaceCapture.jsx
    /pages
      Login.jsx
      Dashboard.jsx
      Attendance.jsx
    /services
      api.js
    /utils
      geolocation.js
```

---

## Backend (Flask)

```
/backend
  /app
    /routes
      auth.py
      session.py
      attendance.py
    /services
      face_service.py
      qr_service.py
    /models
      user.py
      session.py
      attendance.py
    /utils
      location.py
      security.py
```

---

# 14. 🧪 Validation Logic

## Attendance Conditions:

* Session active
* QR valid
* Face matched
* Location valid
* Not duplicate

---

# 15. ⚠️ Edge Cases

* Poor lighting → retry face capture
* GPS denied → reject
* Network delay → allow small grace time
* Duplicate attendance → block

---

# 16. 🔍 Security Considerations

* JWT authentication
* Signed QR tokens
* Rate limiting
* Input validation

---

# 17. 📊 Metrics

* Attendance success rate
* Face match accuracy
* Proxy detection rate
* API latency

---

# 18. 🚀 Future Enhancements

* Liveness detection (anti-spoof)
* Bluetooth proximity
* AI-based fraud detection
* Mobile app integration

---

# 19. 🧠 Limitations

* GPS spoofing possible
* Face spoofing possible
* Web limitations vs mobile

---

# 20. ✅ Conclusion

This system provides a **multi-layered attendance validation mechanism** using:

* QR session control
* Face recognition
* Location verification

It significantly reduces proxy attendance compared to traditional systems.

---


---
