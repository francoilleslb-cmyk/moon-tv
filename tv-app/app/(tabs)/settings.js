import PlaceholderScreen from '../../components/PlaceholderScreen';
import useAuthStore from '../../src/store/authStore';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Settings() {
    const { logout, user } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ajustes</Text>
            <Text style={styles.userInfo}>Usuario: {user?.username}</Text>
            <Text style={styles.userInfo}>Email: {user?.email}</Text>

            <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </Pressable>
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
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userInfo: {
        color: '#ccc',
        fontSize: 18,
        marginBottom: 5,
    },
    button: {
        marginTop: 40,
        backgroundColor: '#ef4444',
        padding: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
