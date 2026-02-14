const fs = require('fs');
const path = require('path');
const axios = require('axios');

// CONFIGURACIÓN
const BASE_URL = 'https://moon-tv-dmws.onrender.com/api';
const M3U_FILE = 'mi_lista.m3u'; 
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGY1ZjBlNTY5MGIzYmNhN2E4ZWVkZiIsImlhdCI6MTc3MTAwMzkzNiwiZXhwIjoxNzcxNjA4NzM2fQ.YMNWyHg6SjNJ2qfD4kXejk5rOrW6Pc9b_o4kOVbqt7I';

async function upload() {
    try {
        console.log('📖 Leyendo tu lista...');
        const filePath = path.join(__dirname, M3U_FILE);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const channels = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('#EXTINF')) {
                const name = lines[i].split(',')[1]?.trim() || 'Canal';
                const url = lines[i + 1]?.trim();
                
                // Usamos categorías simples que suelen estar permitidas
                let category = "General"; 
                const lowName = name.toLowerCase();
                
                if (lowName.includes('netflix') || lowName.includes('marvel') || lowName.includes('avengers')) {
                    category = "Entretenimiento"; // Probamos con esta
                }

                if (url && url.startsWith('http')) {
                    channels.push({ name, category, streamUrl: url, isActive: true });
                }
            }
        }

        console.log(`🚀 Intentando subir ${channels.length} canales...`);

        for (const channel of channels) {
            try {
                await axios.post(`${BASE_URL}/channels`, channel, {
                    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
                });
                console.log(`✅ ${channel.name} subido como ${channel.category}`);
                await new Promise(r => setTimeout(r, 500)); 
            } catch (err) {
                // Si vuelve a fallar, el error nos dirá qué categorías SÍ acepta
                console.error(`❌ Error en ${channel.name}:`, err.response?.data?.message || err.message);
            }
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}
upload();