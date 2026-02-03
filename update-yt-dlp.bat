@echo off
echo ========================================
echo   Updating yt-dlp to Latest Version
echo ========================================
echo.

echo Checking current version...
yt-dlp --version
echo.

echo Updating yt-dlp...
pip install --upgrade yt-dlp
echo.

echo New version:
yt-dlp --version
echo.

echo ========================================
echo   Update Complete!
echo ========================================
echo.
echo Please restart your development server:
echo   npm run dev
echo.
pause

