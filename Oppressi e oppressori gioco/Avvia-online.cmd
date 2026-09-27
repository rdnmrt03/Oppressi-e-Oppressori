@echo off
cd /d "%~dp0"
".tools\python\python.exe" build_web.py
if errorlevel 1 exit /b 1
start "" "http://127.0.0.1:8765/online.html"
".tools\python\python.exe" -m http.server 8765 --bind 127.0.0.1 --directory web
