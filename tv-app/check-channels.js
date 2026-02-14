const axios = require('axios');

const API_URL = 'https://moon-tv-dmws.onrender.com';

async function checkChannels() {
    try {
        console.log('🔍 Verificando canales restantes...');

        // Obtenemos todos los canales, incluso si paginados
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

        console.log(`📊 Total de canales: ${allChannels.length}`);

        const BROKEN_PREFIXES = ['ESPN', 'ESPPN', 'FX', 'Enllace', 'Esnne'];
        const remainingBroken = allChannels.filter(c =>
            BROKEN_PREFIXES.some(prefix => c.name.includes(prefix))
        );

        if (remainingBroken.length > 0) {
            console.log('⚠️  Aún quedan canales sospechosos:');
            remainingBroken.forEach(c => console.log(`   - ${c.name} (ID: ${c._id})`));
        } else {
            console.log('✅ No se encontraron canales rotos (ESPN, FX, etc)');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkChannels();
