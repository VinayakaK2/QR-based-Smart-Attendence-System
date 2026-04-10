# ============================================
# QR Attendance System - Complete Startup
# ============================================
# This script handles everything automatically

param(
    [switch]$SkipInstallation = $false
)

$ErrorActionPreference = "Continue"
$backendPath = "C:\QR attenadance\QR-based-Smart-Attendence-System\backend"

Write-Host "`n" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  QR ATTENDANCE SYSTEM - AUTO SETUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green

# Step 1: Navigate to backend
Write-Host "[1/4] Navigating to backend directory..." -ForegroundColor Yellow
Set-Location $backendPath
Write-Host "✅ Current location: $(Get-Location)" -ForegroundColor Green

# Step 2: Check virtual environment
Write-Host "`n[2/4] Checking virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "✅ Virtual environment found" -ForegroundColor Green
    & "venv\Scripts\Activate.ps1"
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "❌ Virtual environment NOT found!" -ForegroundColor Red
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
    Write-Host "✅ Virtual environment created and activated" -ForegroundColor Green
}

# Step 3: Install dependencies
if (-not $SkipInstallation) {
    Write-Host "`n[3/4] Installing dependencies..." -ForegroundColor Yellow
    Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray
    pip install --upgrade pip -q
    pip install -r requirements.txt -q
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "`n[3/4] Skipping dependency installation" -ForegroundColor Yellow
}

# Step 4: Start backend
Write-Host "`n[4/4] Starting FastAPI backend server..." -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "  BACKEND STARTED SUCCESSFULLY! ✅" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nServer Details:" -ForegroundColor Cyan
Write-Host "  🌐 URL: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  🗄️  MongoDB: mongodb://127.0.0.1:27017" -ForegroundColor Cyan
Write-Host "`nPress CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "`n" -ForegroundColor Green

# Start the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
