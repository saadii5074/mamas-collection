@echo off
title Push Mamas Collection to GitHub
cd /d "F:\downloads\new\mamas COllection"
echo =====================================================
echo  Pushing Mamas Collection to GitHub (saadii5074) ...
echo =====================================================
echo.
"C:\Users\Saadii\AppData\Local\Programs\Git\cmd\git.exe" push -u origin main
echo.
echo =====================================================
if %errorlevel% equ 0 (
    echo  SUCCESS! Code has been pushed to GitHub.
    echo  Ab Vercel page par wapis ja kar Deploy dabayein!
) else (
    echo  Error occurred. Please sign in if browser window opens.
)
echo =====================================================
echo.
pause
