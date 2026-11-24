@echo off
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\ucrt64\bin;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo Pushing Portfolio updates to GitHub (tharunhr29/Portfolio)
echo ========================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo SUCCESS: Changes pushed successfully to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo An error occurred. If prompted, please authenticate.
    echo ========================================================
)
echo.
pause
