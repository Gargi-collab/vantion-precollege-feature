@echo off
setlocal EnableDelayedExpansion

set "ROOT_DIR=%~dp0"
set "APP_DIR=%ROOT_DIR%frontend"

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed. Please install Node.js first.
  pause
  exit /b 1
)

cd /d "%APP_DIR%"

echo Installing dependencies if needed...
call npm install
if errorlevel 1 (
  echo Failed to install dependencies.
  pause
  exit /b 1
)

set PORT=3000
:find_port
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  set /a PORT+=1
  goto find_port
)

set "URL=http://127.0.0.1:%PORT%"

echo.
echo Starting Vantion on %URL%
echo The browser will open automatically.
echo.

start "Vantion Dev Server" cmd /k "cd /d ""%APP_DIR%"" && npm run dev -- --hostname 127.0.0.1 --port %PORT%"
timeout /t 6 /nobreak >nul
start "" "%URL%"
