@echo off
REM ============================================
REM QR ATTENDANCE - TEST EVERYTHING
REM Just double-click this file after backend started!
REM ============================================

setlocal enabledelayedexpansion
cd /d "C:\QR attenadance\QR-based-Smart-Attendence-System\backend"

echo.
echo ============================================
echo   QR ATTENDANCE SYSTEM - TEST SUITE
echo ============================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Waiting 3 seconds for backend to be ready...
timeout /t 3

echo.
echo Running tests...
echo.

python test_api.py

echo.
echo ============================================
echo   TEST SUITE COMPLETED
echo ============================================
echo.

pause
