#!/bin/bash

# Mume Music Player - APK Build Script
# This script builds a production APK using Expo EAS Build

echo "================================"
echo "Mume Music Player - APK Builder"
echo "================================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "Installing EAS CLI..."
    npm install -g eas-cli
fi

# Check if user is logged in to Expo
echo "Checking Expo authentication..."
eas whoami

if [ $? -ne 0 ]; then
    echo ""
    echo "You need to be logged in to Expo/EAS to build the APK."
    echo "Please run: eas login"
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "Starting APK build process..."
echo "This may take several minutes..."
echo ""

# Build for Android using EAS
eas build --platform android --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ APK build completed successfully!"
    echo ""
    echo "Your APK can be downloaded from:"
    echo "  https://expo.dev/builds"
    echo ""
    echo "Or use the following command to download it automatically:"
    echo "  eas build:list"
else
    echo ""
    echo "✗ APK build failed. Please check the logs above for more details."
    exit 1
fi
