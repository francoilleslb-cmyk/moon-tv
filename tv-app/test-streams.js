// Script de prueba para verificar si las URLs de canales funcionan
const testStreamUrl = async (url) => {
    try {
        console.log(`\n🔍 Probando URL: ${url}`);

        const response = await fetch(url, {
            method: 'HEAD',
            timeout: 5000
        });

        console.log(`✅ Status: ${response.status}`);
        console.log(`📝 Content-Type: ${response.headers.get('content-type')}`);

        return response.ok;
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
};

// URLs de ejemplo de tu lista
const testUrls = [
    'http://190.151.80.242:9990/play/a0kd/index.m3u8', // Mega
    'http://190.151.80.242:9990/play/a0ke/index.m3u8', // CHV
    'http://138.121.114.86:8000/play/a0ce/index.m3u8', // 13 PY
];

console.log('🌙 Moon TV - Test de URLs de Stream\n');
console.log('═══════════════════════════════════════\n');

(async () => {
    for (const url of testUrls) {
        await testStreamUrl(url);
    }
    console.log('\n═══════════════════════════════════════\n');
})();
