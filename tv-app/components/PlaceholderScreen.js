import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ title }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.subtext}>Próximamente</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#666',
        marginTop: 10,
    },
});

export default PlaceholderScreen;
