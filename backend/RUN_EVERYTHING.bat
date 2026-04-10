@echo off
REM ============================================
REM QR ATTENDANCE - COMPLETE AUTO SETUP v2
REM Just double-click this file!
REM ============================================

setlocal enabledelayedexpansion
cd /d "C:\QR attenadance\QR-based-Smart-Attendence-System\backend"

echo.
echo ============================================
echo   QR ATTENDANCE SYSTEM - AUTO SETUP v2
echo ============================================
echo.

REM Check virtual environment
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo ============================================
echo   BACKEND STARTING...
echo ============================================
echo.
echo Opening http://localhost:8000/docs in 5 seconds...
timeout /t 5

start http://localhost:8000/docs

echo.
echo Starting FastAPI server...
echo Press CTRL+C to stop
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
