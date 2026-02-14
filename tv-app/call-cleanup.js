const axios = require('axios');

const API_URL = 'https://moon-tv-dmws.onrender.com';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function resetAllChannels() {
    try {
        console.log('🔄 Obteniendo todos los canales...');

        // Obtenemos todos los canales paginados
        let allChannels = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            const { data } = await axios.get(`${API_URL}/api/channels?page=${page}&limit=100`);
            const channels = data.channels || [];
            allChannels = [...allChannels, ...channels];

            if (channels.length < 100 || !data.channels || data.channels.length === 0) {
                hasMore = false;
            } else {
                page++;
            }
        }

        console.log(`📊 Total de canales encontrados: ${allChannels.length}`);

        if (allChannels.length > 0) {
            const channelNames = allChannels.map(c => c.name);
            console.log('🗑️  Eliminando todos los canales...');

            // Eliminar en lotes de 50 para no saturar
            const batchSize = 50;
            for (let i = 0; i < channelNames.length; i += batchSize) {
                const batch = channelNames.slice(i, i + batchSize);
                await axios.post(`${API_URL}/api/cleanup/delete-list`, {
                    channels: batch
                });
                console.log(`   - Lote ${Math.floor(i / batchSize) + 1} eliminado (${batch.length} canales)`);
            }
        } else {
            console.log('✨ No hay canales para eliminar');
        }

        console.log('\n✨ Agregando canal de prueba...');

        const testChannel = {
            name: "🎬 Test Channel (Big Buck Bunny)",
            streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            category: "General",
            country: "Global",
            description: "Canal de prueba fiable",
            quality: "HD",
            isActive: true,
            is24x7: true,
            logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg"
        };

        await axios.post(`${API_URL}/api/channels`, testChannel);

        console.log('✅ Canal de prueba agregado exitosamente!');
        console.log(`📺 Nombre: ${testChannel.name}`);
        console.log('\n🎉 PROCESO COMPLETADO. Recarga la app (presiona "r" en la terminal de Expo)');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

resetAllChannels();
