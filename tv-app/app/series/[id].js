import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { Play, ArrowLeft } from 'lucide-react-native';

export default function SeriesDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [series, setSeries] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [focusedSeason, setFocusedSeason] = useState(null);
    const [focusedEpisode, setFocusedEpisode] = useState(null);

    useEffect(() => {
        if (id) fetchSeriesDetails();
    }, [id]);

    const fetchSeriesDetails = async () => {
        try {
            const { data } = await axios.get(`/api/series/${id}`);
            // Data structure: { success: true, serie: { ... } }
            // Note: backend variable is 'serie'
            setSeries(data.serie);
            if (data.serie.seasons && data.serie.seasons.length > 0) {
                // Sort seasons just in case
                const sorted = [...data.serie.seasons].sort((a, b) => a.number - b.number);
                setSelectedSeason(sorted[0].number);
            }
        } catch (error) {
            console.error('Error fetching series details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayEpisode = (episode) => {
        // Navigate to player with Series mode
        // Params: type=series, id=SERIES_ID, season=XX, episode=XX

        // Construct a direct URL or pass params to player
        // The player needs to know it's a series to display correct info or fetch next ep.
        // For now, let's pass the streamUrl if available, or just the series ID and coordinates.

        // Recommendation: Pass the streamUrl directly via query param if it's external,
        // or let the player fetch it. 
        // Our player currently fetches by ID. We need to modify Player to handle this.
        // Strategy: 
        // 1. Pass type='series'
        // 2. Pass streamUrl (encoded)
        // 3. Pass title

        const encodedUrl = encodeURIComponent(episode.streamUrl);
        router.push(`/player/${id}?type=series&streamUrl=${encodedUrl}&title=${encodeURIComponent(episode.title)}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!series) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Serie no encontrada</Text>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    // Get episodes for selected season
    const currentSeason = series.seasons.find(s => s.number === selectedSeason);
    const episodes = currentSeason
        ? [...currentSeason.episodes].sort((a, b) => a.number - b.number)
        : [];

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: series.backdrop || series.poster }}
                style={styles.backdrop}
                blurRadius={3}
            />
            <View style={styles.overlay} />

            <ScrollView style={styles.content}>
                <Pressable onPress={() => router.back()} style={styles.backIcon}>
                    <ArrowLeft color="#fff" size={30} />
                </Pressable>

                <View style={styles.header}>
                    <Image source={{ uri: series.poster }} style={styles.poster} />
                    <View style={styles.info}>
                        <Text style={styles.title}>{series.title}</Text>
                        <Text style={styles.meta}>
                            {series.year} • {series.seasons.length} Temporadas
                        </Text>
                        <Text style={styles.synopsis} numberOfLines={4}>
                            {series.synopsis || 'Sin sinopsis disponible.'}
                        </Text>
                    </View>
                </View>

                {/* Season Selector */}
                <View style={styles.seasonContainer}>
                    <Text style={styles.sectionTitle}>Temporadas</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seasonScroll}>
                        {series.seasons.map((season) => (
                            <Pressable
                                key={season.number}
                                onFocus={() => setFocusedSeason(season.number)}
                                onPress={() => setSelectedSeason(season.number)}
                                style={[
                                    styles.seasonButton,
                                    selectedSeason === season.number && styles.seasonButtonActive,
                                    focusedSeason === season.number && styles.seasonButtonFocused
                                ]}
                            >
                                <Text style={[
                                    styles.seasonText,
                                    selectedSeason === season.number && styles.seasonTextActive
                                ]}>
                                    T{season.number}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Episodes List */}
                <View style={styles.episodesContainer}>
                    {episodes.map((episode, index) => (
                        <Pressable
                            key={index}
                            onFocus={() => setFocusedEpisode(`${selectedSeason}-${episode.number}`)}
                            onPress={() => handlePlayEpisode(episode)}
                            style={[
                                styles.episodeCard,
                                focusedEpisode === `${selectedSeason}-${episode.number}` && styles.episodeCardFocused
                            ]}
                        >
                            <View style={styles.episodeInfo}>
                                <Text style={styles.episodeNumber}>{episode.number}</Text>
                                <Text style={styles.episodeTitle}>{episode.title}</Text>
                            </View>
                            <Play size={20} color="#ccc" />
                        </Pressable>
                    ))}
                    {episodes.length === 0 && (
                        <Text style={styles.noEpisodes}>No hay episodios en esta temporada.</Text>
                    )}
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
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
    backdrop: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    backIcon: {
        marginBottom: 20,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    poster: {
        width: 120,
        height: 180,
        borderRadius: 8,
        marginRight: 20,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    meta: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 15,
    },
    synopsis: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    seasonContainer: {
        marginBottom: 20,
    },
    seasonScroll: {
        flexGrow: 0,
    },
    seasonButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#333',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    seasonButtonActive: {
        backgroundColor: '#3b82f6',
    },
    seasonButtonFocused: {
        borderColor: '#fff',
        transform: [{ scale: 1.1 }]
    },
    seasonText: {
        color: '#ccc',
        fontWeight: 'bold',
    },
    seasonTextActive: {
        color: '#fff',
    },
    episodesContainer: {
        marginBottom: 20,
    },
    episodeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    episodeCardFocused: {
        borderColor: '#3b82f6',
        backgroundColor: '#2a2a2a',
    },
    episodeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    episodeNumber: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
        width: 30,
    },
    episodeTitle: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    backButton: {
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#fff',
    },
    noEpisodes: {
        color: '#666',
        fontStyle: 'italic',
        marginTop: 10,
    }
});
