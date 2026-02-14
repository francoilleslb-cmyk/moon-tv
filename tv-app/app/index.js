import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../src/store/authStore';

export default function Index() {
    const { user, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isInitialized) return;

        if (user) {
            router.replace('/(tabs)/home');
        } else {
            router.replace('/login');
        }
    }, [user, isInitialized]);

    return (
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}
