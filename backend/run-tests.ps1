# ============================================
# QR Attendance System - Test Runner
# ============================================
# Run this AFTER backend is started

$backendPath = "C:\QR attenadance\QR-based-Smart-Attendence-System\backend"

Write-Host "`n" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  WAITING FOR BACKEND..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Wait for backend to be ready
$maxRetries = 10
$retryCount = 0
$backendReady = $false

while ($retryCount -lt $maxRetries -and -not $backendReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            Write-Host "✅ Backend is ready!" -ForegroundColor Green
        }
    } catch {
        $retryCount++
        Write-Host "⏳ Waiting for backend... ($retryCount/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "❌ Backend failed to start!" -ForegroundColor Red
    Write-Host "Make sure mongosh is running and try again" -ForegroundColor Yellow
    exit 1
}

# Run tests
Write-Host "`n" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RUNNING TESTS..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green

Set-Location $backendPath
python test_api.py

Write-Host "`n" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "  TEST SUITE COMPLETED" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:8000/docs in browser" -ForegroundColor Cyan
Write-Host "  2. Test API endpoints interactively" -ForegroundColor Cyan
Write-Host "  3. Check MongoDB with: mongosh" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor Green
