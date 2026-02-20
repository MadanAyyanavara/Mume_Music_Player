import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { usePlayerStore } from './src/store/usePlayerStore';

export default function App() {
    const loadTheme = usePlayerStore((state) => state.loadTheme);
    const initializeAudio = usePlayerStore((state) => state.initializeAudio);

    useEffect(() => {
        loadTheme();
        initializeAudio();
    }, [loadTheme, initializeAudio]);

    return (
        <SafeAreaProvider>
            <AppNavigator />
            <StatusBar style="auto" />
        </SafeAreaProvider>
    );
}
