#!/bin/bash

# Firebase App Distribution deployment script for CoHub Help Desk

echo "🚀 Firebase App Distribution Deployment Script"
echo "=============================================="

# Check if build type is provided
if [ -z "$1" ]; then
    echo "Usage: ./firebase-deploy.sh [debug|release]"
    echo "Example: ./firebase-deploy.sh debug"
    exit 1
fi

BUILD_TYPE=$1

echo "📱 Building $BUILD_TYPE APK..."

# Navigate to android directory
cd android

# Build the APK
if [ "$BUILD_TYPE" = "debug" ]; then
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
elif [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    echo "❌ Invalid build type. Use 'debug' or 'release'"
    exit 1
fi

# Check if APK was built successfully
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK build failed!"
    exit 1
fi

echo "✅ APK built successfully: $APK_PATH"

# Upload to Firebase App Distribution
echo "📤 Uploading to Firebase App Distribution..."

if [ "$BUILD_TYPE" = "debug" ]; then
    ./gradlew appDistributionUploadDebug
elif [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew appDistributionUploadRelease
fi

echo "🎉 Deployment completed!"
echo "Check your Firebase console for the distribution link."
