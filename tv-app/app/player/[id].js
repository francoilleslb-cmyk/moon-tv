import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

export default function Player() {
    const { id, type, streamUrl, title } = useLocalSearchParams();
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const overlayTimer = useRef(null);

    const videoRef = React.useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (type === 'series' && streamUrl) {
            // Direct playback for series episodes
            setChannel({
                name: title || 'Episodio',
                streamUrl: decodeURIComponent(streamUrl)
            });
            setLoading(false);
        } else {
            fetchContent();
        }
    }, [id, type, streamUrl]);

    useEffect(() => {
        resetOverlayTimer();
        return () => {
            if (overlayTimer.current) clearTimeout(overlayTimer.current);
        };
    }, []);

    const resetOverlayTimer = () => {
        setShowOverlay(true);
        if (overlayTimer.current) clearTimeout(overlayTimer.current);
        overlayTimer.current = setTimeout(() => {
            setShowOverlay(false);
        }, 4000);
    };

    const fetchContent = async () => {
        try {
            setLoading(true);
            let endpoint = `/api/channels/${id}`;

            if (type === 'movie') {
                endpoint = `/api/movies/${id}`;
            }

            console.log(`Fetching ${type || 'channel'} with ID:`, id);
            const { data } = await axios.get(endpoint);

            if (type === 'movie') {
                setChannel({
                    name: data.movie.title,
                    streamUrl: data.movie.streamUrl
                });
            } else {
                setChannel(data.channel);
            }

        } catch (err) {
            console.error('Error fetching content:', err);
            setError('No se pudo cargar el contenido.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.text}>Cargando...</Text>
            </View>
        );
    }

    if (error || !channel) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || 'Canal no encontrado'}</Text>
            </View>
        );
    }

    // Convertir URL relativa a absoluta si es necesario
    const getAbsoluteStreamUrl = (streamUrl) => {
        if (!streamUrl) return null;
        if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) return streamUrl;
        if (/^\d/.test(streamUrl)) return `http://${streamUrl}`;
        if (streamUrl.startsWith('/')) {
            const baseUrl = 'https://moon-tv-dmws.onrender.com';
            return `${baseUrl}${streamUrl}`;
        }
        return `http://${streamUrl}`;
    };

    const absoluteStreamUrl = getAbsoluteStreamUrl(channel.streamUrl);

    return (
        <TouchableWithoutFeedback onPress={resetOverlayTimer}>
            <View style={styles.container}>
                <StatusBar hidden={!showOverlay} />
                {absoluteStreamUrl ? (
                    <>
                        {showOverlay && (
                            <Text style={styles.channelName}>{channel.name}</Text>
                        )}
                        <Video
                            ref={videoRef}
                            style={styles.video}
                            source={{
                                uri: absoluteStreamUrl,
                            }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                            onError={(e) => console.log('❌ Video playback error:', e)}
                        />
                    </>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>No hay URL de stream disponible</Text>
                        <Text style={styles.errorSubtext}>Canal: {channel.name}</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    channelName: {
        position: 'absolute',
        top: 40,
        left: 20,
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    text: {
        color: '#fff',
        marginTop: 10,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 18,
        marginBottom: 10,
    },
    errorSubtext: {
        color: '#999',
        fontSize: 14,
    },
});
