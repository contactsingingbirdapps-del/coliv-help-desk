@echo off
REM Firebase App Distribution deployment script for CoHub Help Desk (Windows)

echo 🚀 Firebase App Distribution Deployment Script
echo ==============================================

if "%1"=="" (
    echo Usage: firebase-deploy.bat [debug^|release]
    echo Example: firebase-deploy.bat debug
    exit /b 1
)

set BUILD_TYPE=%1

echo 📱 Building %BUILD_TYPE% APK...

REM Navigate to android directory
cd android

REM Build the APK
if "%BUILD_TYPE%"=="debug" (
    gradlew.bat assembleDebug
    set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
) else if "%BUILD_TYPE%"=="release" (
    gradlew.bat assembleRelease
    set APK_PATH=app\build\outputs\apk\release\app-release.apk
) else (
    echo ❌ Invalid build type. Use 'debug' or 'release'
    exit /b 1
)

REM Check if APK was built successfully
if not exist "%APK_PATH%" (
    echo ❌ APK build failed!
    exit /b 1
)

echo ✅ APK built successfully: %APK_PATH%

REM Upload to Firebase App Distribution
echo 📤 Uploading to Firebase App Distribution...

if "%BUILD_TYPE%"=="debug" (
    gradlew.bat appDistributionUploadDebug
) else (
    gradlew.bat appDistributionUploadRelease
)

echo 🎉 Deployment completed!
echo Check your Firebase console for the distribution link.
