const axios = require('axios');

const testChannel = {
    name: "🎬 Test Stream (Big Buck Bunny)",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    category: "General",
    country: "MX",
    description: "Canal de prueba con stream válido",
    quality: "HD",
    isActive: true,
    is24x7: true
};

axios.post('https://moon-tv-dmws.onrender.com/api/channels', testChannel)
    .then(response => {
        console.log('✅ Canal de prueba agregado exitosamente!');
        console.log('ID:', response.data._id);
        console.log('Nombre:', response.data.name);
        console.log('\n🎉 Ahora recarga la app y busca "Test Stream" en la lista de canales');
    })
    .catch(error => {
        console.error('❌ Error:', error.response?.data || error.message);
    });
