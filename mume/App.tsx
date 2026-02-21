import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { usePlayerStore } from './src/store/usePlayerStore';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

// Initialize audio globally before React even mounts to guarantee background capabilities
Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
}).catch(console.warn);

export default function App() {
    const loadTheme = usePlayerStore((state) => state.loadTheme);
    const initializeAudio = usePlayerStore((state) => state.initializeAudio);

    useEffect(() => {
        loadTheme();
    }, [loadTheme]);

    return (
        <SafeAreaProvider>
            <AppNavigator />
            <StatusBar style="auto" />
        </SafeAreaProvider>
    );
}
