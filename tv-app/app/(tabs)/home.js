import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import useAuthStore from '../../src/store/authStore';

// Card component for a channel/movie
const ContentCard = ({ item, onFocus, onPress, focusedId }) => {
    const isFocused = focusedId === item._id;
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleImageError = (error) => {
        console.log(`Image error for ${item.name}:`, item.thumbnail, error.nativeEvent);
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // Show placeholder if no thumbnail URL or if image failed to load
    const showPlaceholder = !item.thumbnail || imageError;

    return (
        <Pressable
            onFocus={() => onFocus(item._id)}
            onPress={() => onPress(item)}
            style={[
                styles.card,
                isFocused && styles.cardFocused
            ]}
        >
            {showPlaceholder ? (
                <View style={styles.cardPlaceholder}>
                    <Text style={styles.cardPlaceholderText}>📺</Text>
                    <Text style={styles.cardPlaceholderName} numberOfLines={2}>{item.name}</Text>
                </View>
            ) : (
                <>
                    <Image
                        source={{ uri: item.thumbnail }}
                        style={styles.cardImage}
                        resizeMode="cover"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                    {!imageLoaded && (
                        <View style={styles.cardPlaceholder}>
                            <Text style={styles.cardPlaceholderText}>⏳</Text>
                        </View>
                    )}
                </>
            )}
            <View style={[styles.cardOverlay, !isFocused && styles.cardOverlayDimmed]}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            </View>
        </Pressable>
    );
};

export default function Home() {
    const [channels, setChannels] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [focusedId, setFocusedId] = useState(null);

    const router = useRouter();
    const { token } = useAuthStore();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('Fetching data...');
            const [channelsRes, categoriesRes] = await Promise.all([
                axios.get('/api/channels'),
                axios.get('/api/channels/categories')
            ]);

            console.log('Channels response:', channelsRes.status, channelsRes.data?.channels?.length);
            console.log('Sample channel:', JSON.stringify(channelsRes.data?.channels?.[0], null, 2));
            console.log('First 3 thumbnails:', channelsRes.data?.channels?.slice(0, 3).map(ch => ch.thumbnail));
            console.log('Categories response:', categoriesRes.status, categoriesRes.data?.categories?.length);

            setChannels(channelsRes.data.channels || []);
            setCategories(categoriesRes.data.categories || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response) {
                console.error('Error details:', error.response.status, error.response.data);
            }
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

    // Group channels by category
    const channelsByCategory = {};
    channels.forEach(ch => {
        // Handle if category is an object (populated) or string
        let catName = 'Otros';
        if (ch.category) {
            if (typeof ch.category === 'object' && ch.category.name) {
                catName = ch.category.name;
            } else if (typeof ch.category === 'string') {
                catName = ch.category;
            }
        }

        if (!channelsByCategory[catName]) channelsByCategory[catName] = [];
        channelsByCategory[catName].push(ch);
    });

    console.log('Channels by category:', Object.keys(channelsByCategory));

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Bienvenido a Moon TV</Text>
                <Text style={styles.subtitle}>
                    {channels.length} canales en {Object.keys(channelsByCategory).length} categorías
                </Text>
            </View>

            {Object.entries(channelsByCategory).length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay canales disponibles</Text>
                </View>
            )}

            {Object.entries(channelsByCategory).map(([category, items]) => (
                <View key={category} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <FlatList
                        horizontal
                        data={items}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <ContentCard
                                item={item}
                                focusedId={focusedId}
                                onFocus={setFocusedId}
                                onPress={handlePress}
                            />
                        )}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        paddingBottom: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    hero: {
        padding: 20,
        paddingTop: 40,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#999',
        marginTop: 5,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 18,
    },
    categorySection: {
        marginBottom: 30,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#eee',
        marginLeft: 20,
        marginBottom: 10,
    },
    list: {
        flexGrow: 0,
    },
    listContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: 250,
        height: 140,
        marginRight: 15,
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
    cardPlaceholderName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
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
});
