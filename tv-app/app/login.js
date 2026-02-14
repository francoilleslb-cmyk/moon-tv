import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../src/store/authStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState(null); // 'email', 'password', 'button'

    const { login, loading, error } = useAuthStore();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return;
        const success = await login(email, password);
        if (success) {
            router.replace('/(tabs)/home');
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', '#000000']}
                style={styles.background}
            />

            <View style={styles.content}>
                <Text style={styles.title}>Moon TV</Text>
                <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

                <View style={styles.form}>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'email' && styles.inputFocused
                        ]}
                        placeholder="Email"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusedInput('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'password' && styles.inputFocused
                        ]}
                        placeholder="Contraseña"
                        placeholderTextColor="#666"
                        value={password}
                        onChangeText={setPassword}
                        onFocus={() => setFocusedInput('password')}
                        secureTextEntry
                    />

                    {error && <Text style={styles.error}>{error}</Text>}

                    <Pressable
                        style={[
                            styles.button,
                            focusedInput === 'button' && styles.buttonFocused
                        ]}
                        onFocus={() => setFocusedInput('button')}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    content: {
        width: '40%', // Narrower on TV
        maxWidth: 500,
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#aaa',
        marginBottom: 40,
    },
    form: {
        width: '100%',
        gap: 20,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#fff',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: '#3b82f6', // Active color
        backgroundColor: '#2a2a2a',
        transform: [{ scale: 1.02 }]
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    buttonFocused: {
        borderColor: '#fff',
        backgroundColor: '#1d4ed8',
        transform: [{ scale: 1.05 }]
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: '#ef4444',
        textAlign: 'center',
    },
});
