@echo off
REM Mume Music Player - APK Build Script for Windows
REM This script builds a production APK using Expo EAS Build

echo.
echo ================================
echo Mume Music Player - APK Builder
echo ================================
echo.

REM Check if EAS CLI is installed
where eas >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Installing EAS CLI...
    npm install -g eas-cli
)

REM Check if user is logged in to Expo
echo Checking Expo authentication...
eas whoami

if %ERRORLEVEL% neq 0 (
    echo.
    echo You need to be logged in to Expo/EAS to build the APK.
    echo Please run: eas login
    echo Then run this script again.
    exit /b 1
)

echo.
echo Starting APK build process...
echo This may take several minutes...
echo.

REM Build for Android using EAS
eas build --platform android --non-interactive

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✓ APK build completed successfully!
    echo.
    echo Your APK can be downloaded from:
    echo   https://expo.dev/builds
    echo.
    echo Or use the following command to download it:
    echo   eas build:list
) else (
    echo.
    echo ✗ APK build failed. Please check the logs above for more details.
    exit /b 1
)
