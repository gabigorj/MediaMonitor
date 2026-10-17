@echo off
setlocal
cd /d "%~dp0"
title MediaMonitor - pornire site
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nu este instalat sau nu este disponibil in PATH.
  echo.
  echo Instaleaza versiunea LTS de la https://nodejs.org/ apoi inchide si redeschide acest fisier.
  echo.
  pause
  start "" "https://nodejs.org/"
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm nu a fost gasit. Reinstaleaza Node.js LTS de la https://nodejs.org/.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Se instaleaza componentele necesare. Prima rulare poate dura cateva minute...
  call npm install
  if errorlevel 1 (
    echo Instalarea nu a reusit. Verifica conexiunea la internet si incearca din nou.
    pause
    exit /b 1
  )
)
echo.
echo MediaMonitor porneste. Nu inchide aceasta fereastra cat timp folosesti site-ul.
echo Browserul se va deschide la http://localhost:3000
start "" http://localhost:3000
call npm run dev
pause
