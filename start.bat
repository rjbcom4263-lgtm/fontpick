@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo FontPick 로컬 테스트 서버
echo ========================================

where node >nul 2>nul
if errorlevel 1 (
  echo [오류] Node.js가 설치되어 있지 않습니다.
  echo https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행하세요.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [1/2] 패키지를 설치합니다...
  call npm install
  if errorlevel 1 (
    echo [오류] npm install에 실패했습니다.
    pause
    exit /b 1
  )
)

echo [2/2] 개발 서버를 시작합니다...
echo 브라우저 주소: http://localhost:5173
call npm run dev
pause
