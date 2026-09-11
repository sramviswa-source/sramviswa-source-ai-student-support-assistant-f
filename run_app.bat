@echo off
title AI Student Support Assistant Launcher
echo ========================================================
echo       AI STUDENT SUPPORT ASSISTANT LAUNCHER
echo          ABC Institute of Technology [SAMPLE DATA]
echo ========================================================
echo.

:: Check python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found in PATH. Please install Python 3.10+
    pause
    exit /b 1
)

:: Start Backend in new window
echo [1/2] Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start "AI Student Support - Backend (FastAPI)" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Start Frontend in new window
echo [2/2] Starting Vite React Frontend on http://localhost:5173 ...
cd frontend
start "AI Student Support - Frontend (Vite)" cmd /k "npm.cmd run dev"

echo.
echo ========================================================
echo Application services are starting:
echo   - Frontend: http://localhost:5173
echo   - Backend API: http://127.0.0.1:8000
echo   - API Docs: http://127.0.0.1:8000/docs
echo ========================================================
echo You can now open http://localhost:5173 in your browser!
echo.
pause
