import { useEffect } from 'react';
import { Stack, useRouter, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import useAuthStore from '../src/store/authStore';

export default function RootLayout() {
    const { init, isInitialized, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!isInitialized) return;

        // Very simple auth check
        if (!user) {
            // If not logged in and not already on login, redirect
            // We can handle this better with Groups but this is fine for now
            // router.replace('/login'); 
        } else {
            // router.replace('/(tabs)/home');
        }
    }, [isInitialized, user]);

    if (!isInitialized) {
        return <View style={{ flex: 1, backgroundColor: 'black' }} />;
    }

    return (
        <>
            <StatusBar hidden={true} />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="player/[id]" />
            </Stack>
        </>
    );
}
