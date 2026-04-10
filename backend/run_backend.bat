@echo off
REM ============================================
REM QR Attendance Backend - Automated Startup
REM ============================================

echo.
echo ========================================
echo   QR ATTENDANCE SYSTEM - AUTO STARTUP
echo ========================================
echo.

REM Get the backend directory
cd /d "C:\QR attenadance\QR-based-Smart-Attendence-System\backend"

echo [1/5] Checking virtual environment...
if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please create it first: python -m venv venv
    pause
    exit /b 1
)

echo [2/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo [3/5] Installing dependencies...
echo Please wait, this may take 2-3 minutes...
pip install -r requirements.txt --quiet

echo.
echo [4/5] Starting backend server...
echo.
echo ========================================
echo   BACKEND RUNNING ON: http://0.0.0.0:8000
echo   API DOCS: http://localhost:8000/docs
echo   Press CTRL+C to stop
echo ========================================
echo.

REM Run the backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
