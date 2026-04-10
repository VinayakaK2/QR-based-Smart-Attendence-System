import requests
import json
import time
import sys
from typing import Optional, Dict

# ========================================
# QR Attendance System - API Tester
# ========================================

BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

class APITester:
    def __init__(self):
        self.lecturer_token: Optional[str] = None
        self.student_token: Optional[str] = None
        self.lecturer_id: Optional[str] = None
        self.student_id: Optional[str] = None
        self.section_id: Optional[str] = None
        self.session_id: Optional[str] = None

    def print_header(self, text: str):
        print(f"\n{'='*60}")
        print(f"  {text}")
        print(f"{'='*60}\n")

    def print_success(self, text: str):
        print(f"✅ {text}")

    def print_error(self, text: str):
        print(f"❌ {text}")

    def print_info(self, text: str):
        print(f"ℹ️  {text}")

    def test_connection(self) -> bool:
        """Test if backend is running"""
        self.print_header("Testing Connection")
        try:
            response = requests.get(f"{BASE_URL}/", timeout=5)
            if response.status_code == 200:
                self.print_success("Backend is running!")
                self.print_info(f"Response: {response.json()}")
                return True
        except requests.exceptions.ConnectionError:
            self.print_error("Cannot connect to backend!")
            self.print_info("Make sure MongoDB is running and backend started with:")
            self.print_info("  python -m uvicorn app.main:app --reload --port 8000")
            return False

    def register_user(self, name: str, email: str, password: str, role: str) -> bool:
        """Register a new user"""
        try:
            payload = {
                "name": name,
                "email": email,
                "password": password,
                "role": role
            }
            response = requests.post(f"{API_BASE}/auth/register", json=payload)

            if response.status_code == 200:
                data = response.json()
                user_id = data.get("user_id")
                self.print_success(f"Registered {role}: {email} (ID: {user_id})")
                return user_id
            else:
                self.print_error(f"Registration failed: {response.text}")
                return None
        except Exception as e:
            self.print_error(f"Registration error: {str(e)}")
            return None

    def login_user(self, email: str, password: str, role: str) -> bool:
        """Login user and get token"""
        try:
            payload = {
                "email": email,
                "password": password
            }
            response = requests.post(f"{API_BASE}/auth/login", json=payload)

            if response.status_code == 200:
                data = response.json()
                token = data.get("access_token")
                user_id = data.get("user_id")

                if role == "lecturer":
                    self.lecturer_token = token
                    self.lecturer_id = user_id
                else:
                    self.student_token = token
                    self.student_id = user_id

                self.print_success(f"{role.capitalize()} logged in successfully!")
                return True
            else:
                self.print_error(f"Login failed: {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Login error: {str(e)}")
            return False

    def create_section(self, name: str) -> Optional[str]:
        """Create a section (lecturer only)"""
        try:
            headers = {"Authorization": f"Bearer {self.lecturer_token}"}
            payload = {"name": name}
            response = requests.post(f"{API_BASE}/section/create", json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                section_id = data.get("id")
                self.section_id = section_id
                self.print_success(f"Created section '{name}' (ID: {section_id})")
                return section_id
            else:
                self.print_error(f"Create section failed: {response.text}")
                return None
        except Exception as e:
            self.print_error(f"Create section error: {str(e)}")
            return None

    def get_sections(self, role: str = "student") -> bool:
        """Get all sections"""
        try:
            token = self.lecturer_token if role == "lecturer" else self.student_token
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{API_BASE}/section/all", headers=headers)

            if response.status_code == 200:
                sections = response.json()
                self.print_success(f"Retrieved {len(sections)} section(s)")
                for section in sections:
                    self.print_info(f"  - {section.get('name')} (ID: {section.get('id')})")
                return True
            else:
                self.print_error(f"Get sections failed: {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Get sections error: {str(e)}")
            return False

    def start_session(self, section_id: str) -> Optional[str]:
        """Start attendance session"""
        try:
            headers = {"Authorization": f"Bearer {self.lecturer_token}"}
            payload = {
                "section_id": section_id,
                "duration_minutes": 60,
                "lecturer_lat": 40.7128,
                "lecturer_lng": -74.0060
            }
            response = requests.post(f"{API_BASE}/session/start", json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                session_id = data.get("id")
                self.session_id = session_id
                self.print_success(f"Started session (ID: {session_id})")
                self.print_info(f"  QR Token: {data.get('qr_token', 'N/A')[:50]}...")
                return session_id
            else:
                self.print_error(f"Start session failed: {response.text}")
                return None
        except Exception as e:
            self.print_error(f"Start session error: {str(e)}")
            return None

    def get_current_user(self, role: str = "lecturer") -> bool:
        """Get current user info"""
        try:
            token = self.lecturer_token if role == "lecturer" else self.student_token
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{API_BASE}/auth/me", headers=headers)

            if response.status_code == 200:
                user = response.json()
                self.print_success(f"Retrieved {role} info:")
                self.print_info(f"  Name: {user.get('name')}")
                self.print_info(f"  Email: {user.get('email')}")
                self.print_info(f"  Role: {user.get('role')}")
                return True
            else:
                self.print_error(f"Get user failed: {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Get user error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run complete test suite"""
        self.print_header("🚀 QR ATTENDANCE SYSTEM - COMPLETE TEST SUITE")

        # 1. Test connection
        if not self.test_connection():
            self.print_header("❌ TESTS FAILED - Backend Not Running")
            return False

        # 2. Register lecturer
        self.print_header("Step 1: Register Lecturer")
        lecturer_id = self.register_user(
            name="Dr. Smith",
            email="smith@example.com",
            password="password123",
            role="lecturer"
        )
        if not lecturer_id:
            return False

        # 3. Login lecturer
        self.print_header("Step 2: Login Lecturer")
        if not self.login_user("smith@example.com", "password123", "lecturer"):
            return False

        # 4. Get current lecturer
        self.print_header("Step 3: Get Lecturer Info")
        if not self.get_current_user("lecturer"):
            return False

        # 5. Create section
        self.print_header("Step 4: Create Section")
        section_id = self.create_section("Introduction to Python")
        if not section_id:
            return False

        # 6. Get sections
        self.print_header("Step 5: List All Sections")
        if not self.get_sections("lecturer"):
            return False

        # 7. Start session
        self.print_header("Step 6: Start Attendance Session")
        session_id = self.start_session(section_id)
        if not session_id:
            return False

        # 8. Register student
        self.print_header("Step 7: Register Student")
        student_id = self.register_user(
            name="John Doe",
            email="john@example.com",
            password="password123",
            role="student"
        )
        if not student_id:
            return False

        # 9. Login student
        self.print_header("Step 8: Login Student")
        if not self.login_user("john@example.com", "password123", "student"):
            return False

        # 10. Get student info
        self.print_header("Step 9: Get Student Info")
        if not self.get_current_user("student"):
            return False

        # 11. Get student can see sections
        self.print_header("Step 10: Student Views Sections")
        if not self.get_sections("student"):
            return False

        # Success
        self.print_header("✅ ALL TESTS PASSED!")
        self.print_success("Backend is fully functional!")
        self.print_info("")
        self.print_info("Created Sample Data:")
        self.print_info(f"  Lecturer: smith@example.com (ID: {self.lecturer_id})")
        self.print_info(f"  Student: john@example.com (ID: {self.student_id})")
        self.print_info(f"  Section: Introduction to Python (ID: {self.section_id})")
        self.print_info(f"  Session: Active (ID: {self.session_id})")
        self.print_info("")
        self.print_info("Next Steps:")
        self.print_info("  1. Open http://localhost:8000/docs for interactive API docs")
        self.print_info("  2. Test other endpoints (mark attendance, get history, etc.)")
        self.print_info("  3. Try face recognition with attendance marking")
        self.print_info("")
        return True


def main():
    print("\n" + "="*60)
    print("  QR ATTENDANCE SYSTEM - AUTOMATED TEST SUITE")
    print("="*60)
    print("\nWaiting 2 seconds for backend to initialize...")
    time.sleep(2)

    tester = APITester()
    success = tester.run_all_tests()

    print("\n" + "="*60)
    if success:
        print("  ✅ TEST SUITE COMPLETED SUCCESSFULLY")
    else:
        print("  ❌ TEST SUITE FAILED")
    print("="*60 + "\n")

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
