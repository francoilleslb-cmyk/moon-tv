const axios = require('axios');

const API_URL = 'https://moon-tv-dmws.onrender.com';

async function testStream(url) {
    try {
        const response = await axios.head(url, {
            timeout: 5000,
            validateStatus: function (status) {
                return status < 500;
            }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function verifyEspn() {
    try {
        const { data } = await axios.get(`${API_URL}/api/channels/search?q=ESPN&limit=100`);
        const channels = data.channels || [];

        console.log(`📊 Encontrados ${channels.length} canales ESPN para verificar...\n`);

        for (const channel of channels) {
            process.stdout.write(`Probando: ${channel.name}... `);
            const works = await testStream(channel.streamUrl);
            console.log(works ? '✅ Funciona' : '❌ No funciona');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyEspn();
