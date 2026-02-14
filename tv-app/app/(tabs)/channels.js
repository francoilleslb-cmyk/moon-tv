import PlaceholderScreen from '../../components/PlaceholderScreen';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import useAuthStore from '../../src/store/authStore';

// Card component for a channel
const ChannelCard = ({ item, onFocus, onPress, focusedId }) => {
    const isFocused = focusedId === item._id;
    const [imageError, setImageError] = React.useState(false);

    return (
        <Pressable
            onFocus={() => onFocus(item._id)}
            onPress={() => onPress(item)}
            style={[
                styles.card,
                isFocused && styles.cardFocused
            ]}
        >
            {!imageError && item.thumbnail ? (
                <Image
                    source={{ uri: item.thumbnail }}
                    style={styles.cardImage}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View style={styles.cardPlaceholder}>
                    <Text style={styles.cardPlaceholderText}>📺</Text>
                </View>
            )}
            <View style={[styles.cardOverlay, !isFocused && styles.cardOverlayDimmed]}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                {item.category && (
                    <Text style={styles.cardCategory} numberOfLines={1}>
                        {typeof item.category === 'object' ? item.category.name : item.category}
                    </Text>
                )}
            </View>
        </Pressable>
    );
};

export default function Channels() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const { data } = await axios.get('/api/channels');
            setChannels(data.channels || []);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item) => {
        router.push(`/player/${item._id}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Canales en Vivo</Text>
                <Text style={styles.headerSubtitle}>{channels.length} canales disponibles</Text>
            </View>

            <FlatList
                data={channels}
                numColumns={4}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ChannelCard
                        item={item}
                        focusedId={focusedId}
                        onFocus={setFocusedId}
                        onPress={handlePress}
                    />
                )}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#999',
        marginTop: 5,
    },
    grid: {
        padding: 20,
    },
    card: {
        width: 250,
        height: 140,
        margin: 10,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#1a1a1a',
    },
    cardFocused: {
        borderColor: '#3b82f6',
        transform: [{ scale: 1.05 }],
        zIndex: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardPlaceholderText: {
        fontSize: 48,
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 8,
    },
    cardOverlayDimmed: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardCategory: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
    },
});
