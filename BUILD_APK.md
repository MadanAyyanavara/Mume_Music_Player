# Mume Music Player - APK Build Guide

This guide will help you generate a downloadable APK file of the Mume Music Player app.

## Prerequisites

- **Expo Account**: You need an active Expo account (you already have one ✓)
- **Node.js**: Version 18 or higher
- **EAS CLI**: Will be installed automatically, or install with: `npm install -g eas-cli`

## Quick Start (Automated)

### For macOS/Linux:
```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh
```

### For Windows:
```cmd
scripts/build-apk.bat
```

## Manual Build Steps

If you prefer to build manually, follow these steps:

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo/EAS
```bash
eas login
```
Enter your Expo credentials when prompted.

### Step 3: Build the APK
```bash
eas build --platform android --non-interactive
```

This command will:
- Build your app in the cloud using Expo's servers
- Generate a production-ready APK
- Take 5-15 minutes depending on server load

### Step 4: Download Your APK

Once the build completes, you'll see a success message with a build URL. You have two options:

**Option A: Download via Web**
1. Go to https://expo.dev/builds
2. Sign in with your Expo account
3. Find your latest Android build
4. Click the download button to get the `.apk` file

**Option B: Download via CLI**
```bash
eas build:list --platform android
```
This shows your recent builds. Find the latest one and download it.

## Building Specific Variants

### Production Build (Recommended)
```bash
eas build --platform android --profile production
```

### Preview Build (for testing with Expo Go)
```bash
eas build --platform android --profile preview
```

### Development Build (for development)
```bash
eas build --platform android --profile development
```

## Troubleshooting

### "Not logged in" Error
```bash
eas logout
eas login
```

### Build Fails
- Check your internet connection
- Ensure you have a valid Expo account with access to builds
- Try clearing cache: `eas build:cache --platform android --clear`

### APK Not Starting
- Make sure all required permissions are granted on first launch
- The app requires: Microphone and Audio permissions
- Try installing on a fresh Android device if issues persist

## Project Configuration

Your project is configured with:
- **Package Name**: `com.madan.mume`
- **App Name**: Mume Music Player
- **Min SDK**: Android 5.0+
- **Target SDK**: Latest
- **Permissions**: Audio playback, microphone access, foreground service for background playback

## After Building

Once you have the APK:

1. **Install on Device/Emulator**:
   - Connect your Android device or open an emulator
   - Run: `adb install path/to/mume-music-player.apk`
   - Or manually transfer and tap the APK file on your device

2. **Share with Others**:
   - The APK file can be shared directly with others
   - Recipients can install it by tapping the file on their Android device

3. **Submit to Play Store** (Optional):
   - Use the APK for internal testing or beta distribution
   - For production Play Store release, consult the Play Store submission guide

## Need Help?

- **Expo Documentation**: https://docs.expo.dev/build-reference/apk/
- **EAS Build Docs**: https://docs.expo.dev/eas-build/introduction/
- **Project GitHub**: https://github.com/MadanAyyanavara/Mume_Music_Player

---

**Happy building! 🎵**
