
@echo off
cd /d "%~dp0"

start "EcoAware Backend" cmd /k "python -m uvicorn main:app --reload"

timeout /t 3 /nobreak >nul

start "EcoAware Frontend" cmd /k "cd /d "%~dp0..\frontend" && npm run dev"

timeout /t 5 /nobreak >nul

start "" "http://localhost:5173"

exit
