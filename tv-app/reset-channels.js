const axios = require('axios');

const API_URL = 'https://moon-tv-dmws.onrender.com';

// Función para verificar si un stream funciona
async function testStreamUrl(url) {
    try {
        const response = await axios.head(url, {
            timeout: 5000,
            validateStatus: function (status) {
                return status < 500; // Acepta cualquier status code < 500
            }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function resetChannels() {
    try {
        console.log('🔍 Analizando canales...\n');

        // Obtener todos los canales
        const { data } = await axios.get(`${API_URL}/api/channels`);
        const channels = data.channels || [];

        console.log(`📊 Canales encontrados: ${channels.length}\n`);

        // Verificar cada canal
        let workingChannels = [];
        let brokenChannels = [];

        for (const channel of channels) {
            process.stdout.write(`Probando: ${channel.name}... `);
            const works = await testStreamUrl(channel.streamUrl);

            if (works) {
                console.log('✅ Funciona');
                workingChannels.push(channel);
            } else {
                console.log('❌ No funciona');
                brokenChannels.push(channel);
            }
        }

        console.log(`\n📈 Resumen:`);
        console.log(`  ✅ Canales funcionando: ${workingChannels.length}`);
        console.log(`  ❌ Canales rotos: ${brokenChannels.length}\n`);

        if (brokenChannels.length > 0) {
            console.log('🔧 Intentando desactivar canales rotos...\n');

            for (const channel of brokenChannels) {
                try {
                    await axios.put(`${API_URL}/api/channels/${channel._id}`, {
                        ...channel,
                        isActive: false
                    });
                    console.log(`  ✅ Desactivado: ${channel.name}`);
                } catch (err) {
                    // El endpoint requiere autenticación, informar al usuario
                    if (err.response && err.response.status === 401) {
                        console.log(`  ⚠️  No se pudo desactivar (requiere autenticación): ${channel.name}`);
                    } else {
                        console.log(`  ⚠️  No se pudo desactivar: ${channel.name}`);
                    }
                }
            }
        }

        console.log('\n✨ Agregando canal de prueba...\n');

        // Agregar canal de prueba
        const testChannel = {
            name: "🎬 Test Stream (Big Buck Bunny)",
            streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            category: "General",
            country: "MX",
            description: "Canal de prueba con stream válido - Video de prueba de alta calidad",
            quality: "HD",
            isActive: true,
            is24x7: true,
            logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg"
        };

        const response = await axios.post(`${API_URL}/api/channels`, testChannel);

        console.log('✅ Canal de prueba agregado exitosamente!');
        console.log(`📺 Nombre: ${testChannel.name}`);
        console.log(`🔗 URL: ${testChannel.streamUrl}`);
        console.log('\n🎉 Ahora recarga la app (presiona "r" en la terminal de Expo)');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

resetChannels();
