import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Card component for a movie
const MovieCard = ({ item, onFocus, onPress, focusedId }) => {
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
            {!imageError && item.poster ? (
                <Image
                    source={{ uri: item.poster }}
                    style={styles.cardImage}
                    resizeMode="cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <View style={styles.cardPlaceholder}>
                    <Text style={styles.cardPlaceholderText}>🎬</Text>
                </View>
            )}
            <View style={[styles.cardOverlay, !isFocused && styles.cardOverlayDimmed]}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                {item.year && <Text style={styles.cardYear}>{item.year}</Text>}
            </View>
        </Pressable>
    );
};

export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get('/api/movies');
            setMovies(data.movies || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = (item) => {
        router.push(`/player/${item._id}?type=movie`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (movies.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎬</Text>
                <Text style={styles.emptyText}>No hay películas disponibles</Text>
                <Text style={styles.emptySubtext}>Próximamente se agregarán películas</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Películas</Text>
                <Text style={styles.headerSubtitle}>{movies.length} películas disponibles</Text>
            </View>

            <FlatList
                data={movies}
                numColumns={5}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <MovieCard
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 40,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptySubtext: {
        color: '#999',
        fontSize: 16,
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
        width: 180,
        height: 270,
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
        fontSize: 64,
    },
    cardOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 10,
    },
    cardOverlayDimmed: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardYear: {
        color: '#999',
        fontSize: 12,
        marginTop: 4,
    },
});
