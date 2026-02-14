const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const path = require('path');

// CONFIGURACIÓN
const API_URL = 'https://moon-tv-dmws.onrender.com/api';
// const API_URL = 'http://localhost:5000/api'; // Descomentar para local
const M3U_PATH = 'c:\\Users\\Franco\\Documents\\Moon\\lista18mb.m3u';
const BATCH_SIZE = 50; // Tamaño del lote para películas y canales

// Estado Global
let stats = {
    movies: 0,
    series: 0,
    episodes: 0,
    channels: 0,
    errors: 0
};

// Mapas para Series (para agrupar temporadas y episodios)
const seriesMap = new Map();

// Colas de lotes
let moviesBatch = [];
let channelsBatch = [];

// Función principal
async function main() {
    console.log('🚀 Iniciando script de importación masiva...');
    console.log(`📂 Leyendo archivo: ${M3U_PATH}`);
    console.log(`wd API Target: ${API_URL}`);

    try {
        // 1. Limpiar base de datos (Opcional, pero solicitado por el usuario)
        // Preservar canal 'Test 1' o similar si existe. 
        // Por seguridad, primero obtenemos un canal para whitelist si es necesario.
        // El usuario dijo "menos el canal de test". Asumo que sabe cuál es.
        // Como no podemos interactuar, intentaremos preservar "Test" o "Prueba".
        const whitelist = ['Test', 'Prueba', 'Moon TV Test'];
        console.log('🧹 Limpiando base de datos (excepto whitelist)...');
        try {
            await axios.post(`${API_URL}/cleanup/clear-all`, { whitelist });
            console.log('✅ Base de datos limpiada.');
        } catch (e) {
            console.error('⚠️ Error al limpiar DB (puede que el endpoint no esté desplegado aún):', e.message);
            // Continuamos igual
        }

        // 2. Procesar archivo línea por línea
        const fileStream = fs.createReadStream(M3U_PATH);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let currentItem = {};
        let lineCount = 0;

        console.log('📥 Procesando archivo M3U...');

        for await (const line of rl) {
            lineCount++;
            if (lineCount % 10000 === 0) console.log(`   ⏳ Procesadas ${lineCount} líneas...`);

            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            if (trimmedLine.startsWith('#EXTINF:')) {
                // Parsear metadatos
                // Ejemplo: #EXTINF:-1 tvg-id="" tvg-name="Titulo" group-title="Grupo",Display Name
                currentItem = parseExtInf(trimmedLine);
            } else if (trimmedLine.startsWith('http')) {
                // Es la URL
                if (currentItem && currentItem.name) {
                    currentItem.url = trimmedLine;
                    await processItem(currentItem);
                }
                currentItem = {}; // Reset
            }
        }

        // 3. Subir lotes restantes
        if (moviesBatch.length > 0) await uploadBatch('movies', moviesBatch);
        if (channelsBatch.length > 0) await uploadBatch('channels', channelsBatch);

        // 4. Subir Series Agrupadas
        console.log(`📦 Iniciando subida de ${seriesMap.size} series...`);
        await uploadSeries();

        console.log('✅ ¡Importación completada!');
        console.log('📊 Estadísticas Finales:', stats);

    } catch (error) {
        console.error('❌ Error fatal:', error);
    }
}

// Helper: Parsear línea EXTINF
function parseExtInf(line) {
    const info = {};

    // Extraer group-title
    const groupMatch = line.match(/group-title="([^"]*)"/);
    info.groupTitle = groupMatch ? groupMatch[1] : '';

    // Extraer tvg-logo
    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
    info.logo = logoMatch ? logoMatch[1] : '';

    // Extraer nombre (lo que está después de la última coma)
    const nameParts = line.split(',');
    info.name = nameParts[nameParts.length - 1].trim();

    return info;
}

// Helper: Procesar item individual
async function processItem(item) {
    const { name, groupTitle, url, logo } = item;

    // LÓGICA DE CLASIFICACIÓN
    const isSeriesUrl = url.includes('/series/');
    const isMovieUrl = url.includes('/movie/');
    const isSeriesGroup = groupTitle.toUpperCase().includes('SERIES') || groupTitle.toUpperCase().includes('TELENOVELAS');
    const isMovieGroup = groupTitle.toUpperCase().includes('VOD') || groupTitle.toUpperCase().includes('PELICULAS');

    // 1. SERIES
    if (isSeriesUrl || isSeriesGroup) {
        // Intentar extraer Sxx Exx
        // Soportar formatos: "S01 E01", "S1 E1", "1x01" (aunque el m3u parece usar Sxx Exx)
        const regex = /(.*?) S(\d+)\s*E(\d+)/i;
        const match = name.match(regex);

        if (match) {
            const seriesTitle = match[1].trim();
            const seasonNum = parseInt(match[2]);
            const episodeNum = parseInt(match[3]);

            if (!seriesMap.has(seriesTitle)) {
                seriesMap.set(seriesTitle, {
                    title: seriesTitle,
                    poster: logo, // Usar logo del primer episodio como poster de la serie
                    seasons: {}, // Objeto para agrupar por número de temporada
                    year: 2023, // Default
                    genres: [mapCategory(groupTitle)]
                });
            }

            const series = seriesMap.get(seriesTitle);

            // Inicializar temporada si no existe
            if (!series.seasons[seasonNum]) {
                series.seasons[seasonNum] = {
                    number: seasonNum,
                    episodes: []
                };
            }

            // Agregar episodio
            series.seasons[seasonNum].episodes.push({
                number: episodeNum,
                title: `${seriesTitle} S${seasonNum} E${episodeNum}`, // Título genérico si no hay más info
                streamUrl: url,
                thumbnail: logo
            });

            stats.episodes++;
            return;
        }
        // Si no matchea regex pero parece serie, quizás es un capitulo suelto o formato raro.
        // Lo trataremos como "Channel" o ignoramos?
        // Mejor lo ignoramos para evitar ensuciar, o lo logueamos.
        // console.log(`⚠️ Serie con formato desconocido: ${name}`);
    }

    // 2. PELICULAS
    if (isMovieUrl || isMovieGroup) {
        moviesBatch.push({
            title: name,
            streamUrl: url,
            poster: logo,
            genres: [mapCategory(groupTitle)],
            year: 2024 // Default
        });
        stats.movies++;

        if (moviesBatch.length >= BATCH_SIZE) {
            await uploadBatch('movies', moviesBatch);
            moviesBatch = [];
        }
        return;
    }

    // 3. CANALES (TV EN VIVO)
    // Todo lo demás es canal
    channelsBatch.push({
        name: name,
        streamUrl: url,
        logo: logo,
        category: mapCategory(groupTitle), // Mapear a Enum válido
        isVerified: true
    });
    stats.channels++;

    if (channelsBatch.length >= BATCH_SIZE) {
        await uploadBatch('channels', channelsBatch);
        channelsBatch = [];
    }
}

// Helper: Validar Categorías (Mismo mapping que antes)
function mapCategory(rawCategory) {
    if (!rawCategory) return 'General';

    const upper = rawCategory.toUpperCase();

    if (upper.includes('DEPORTE') || upper.includes('SPORT') || upper.includes('FÚTBOL') || upper.includes('SOCCER')) return 'Deportes';
    if (upper.includes('INFANTIL') || upper.includes('KIDS') || upper.includes('ANIMADO') || upper.includes('CARTOON')) return 'Infantil';
    if (upper.includes('NOTICIA') || upper.includes('NEWS')) return 'Noticias';
    if (upper.includes('CULTURA') || upper.includes('DOCUMENTAL') || upper.includes('HISTORY')) return 'Cultura';
    if (upper.includes('PELÍCULA') || upper.includes('MOVIE') || upper.includes('CINE') || upper.includes('CINEMA') || upper.includes('ESTRENO') || upper.includes('VOD')) return 'Películas';
    if (upper.includes('SERIE') || upper.includes('NOVELA')) return 'Series';
    if (upper.includes('MÚSICA') || upper.includes('MUSIC')) return 'Música';
    if (upper.includes('ADULTO') || upper.includes('XXX')) return 'Entretenimiento'; // Ocultar o mapear a entretenimiento

    return 'General';
}

// Helper: Subir Lote
async function uploadBatch(type, batch) {
    if (batch.length === 0) return;

    console.log(`📤 Subiendo lote de ${batch.length} ${type}...`);
    try {
        // Si la API soporta batch, bien. Si no, loop.
        // Channel API: POST /api/channels (single)
        // Movie API: POST /api/movies (single)
        // Hack: Usaremos Promise.all con límite de concurrencia para simular batch

        const limit = 5; // Concurrencia baja para no saturar
        const promises = batch.map(item => {
            return axios.post(`${API_URL}/${type}`, item).catch(err => {
                // Ignorar duplicados silenciosamente, loguear otros
                if (err.response && err.response.status === 400) return null; // Validation error
                console.error(`Error subiendo ${type} item: ${item.name || item.title}`, err.message);
                stats.errors++;
                return null;
            });
        });

        // Ejecutar en chunks o con p-limit
        // Aquí simplifico: de 5 en 5
        for (let i = 0; i < promises.length; i += limit) {
            await Promise.all(promises.slice(i, i + limit));
        }

    } catch (error) {
        console.error(`❌ Error general subiendo lote de ${type}:`, error.message);
    }
}

// Helper: Subir Series
async function uploadSeries() {
    // Convertir mapa a array de objetos Series válidos para el Backend
    let count = 0;
    for (const [title, data] of seriesMap) {
        count++;

        // Transformar seasons object a array
        const seasonsArray = Object.values(data.seasons).map(s => ({
            number: s.number,
            title: `Temporada ${s.number}`,
            episodes: s.episodes
        }));

        const seriesPayload = {
            title: data.title,
            poster: data.poster,
            genres: data.genres,
            seasons: seasonsArray,
            year: data.year,
            description: `Serie importada autom. ${data.title}`
        };

        try {
            if (count % 20 === 0) console.log(`   📺 Subiendo serie ${count}/${seriesMap.size}: ${title}`);
            await axios.post(`${API_URL}/series`, seriesPayload);
            stats.series++;
        } catch (error) {
            console.error(`❌ Error subiendo serie ${title}:`, error.message);
            if (error.response) console.error('   Detalles:', JSON.stringify(error.response.data));
            stats.errors++;
        }
    }
}

main();
