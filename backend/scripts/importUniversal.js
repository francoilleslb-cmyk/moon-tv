require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Channel = require('../models/Channel');
const Series = require('../models/Series');
const Movie = require('../models/Movie');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Función para detectar tipo de contenido
function detectContentType(name, url, groupTitle) {
  // Detectar series por patrón S##E## o Season/Episode
  const seriesPattern = /S\d+\s*E\d+|Season\s+\d+|Episode\s+\d+|T\d+\s*Cap\d+/i;
  
  if (seriesPattern.test(name)) {
    return 'series';
  }
  
  // Detectar películas por extensión de archivo
  const movieExtensions = /\.(mkv|mp4|avi|mov)$/i;
  if (movieExtensions.test(url) && !seriesPattern.test(name)) {
    // Si tiene año en el nombre, probablemente es película
    const yearPattern = /\(?\d{4}\)?/;
    if (yearPattern.test(name) || groupTitle.toLowerCase().includes('pelicula') || groupTitle.toLowerCase().includes('movie')) {
      return 'movie';
    }
  }
  
  // Si es streaming (.m3u8, .ts, etc.) es canal
  if (url.includes('.m3u8') || url.includes('/live/') || url.includes('/stream/')) {
    return 'channel';
  }
  
  // Por categoría
  if (groupTitle.toLowerCase().includes('serie')) {
    return 'series';
  }
  if (groupTitle.toLowerCase().includes('pelicula') || groupTitle.toLowerCase().includes('movie')) {
    return 'movie';
  }
  
  // Por defecto, si tiene extensión de video, es película
  if (movieExtensions.test(url)) {
    return 'movie';
  }
  
  return 'channel';
}

// Extraer información de episodio
function extractEpisodeInfo(name) {
  // Patrón para S##E## o S##E##
  const match = name.match(/S(\d+)\s*E(\d+)/i);
  if (match) {
    return {
      season: parseInt(match[1]),
      episode: parseInt(match[2]),
      title: name.replace(/S\d+\s*E\d+/i, '').trim()
    };
  }
  
  // Patrón alternativo: T##Cap##
  const altMatch = name.match(/T(\d+)\s*Cap(\d+)/i);
  if (altMatch) {
    return {
      season: parseInt(altMatch[1]),
      episode: parseInt(altMatch[2]),
      title: name.replace(/T\d+\s*Cap\d+/i, '').trim()
    };
  }
  
  return null;
}

// Extraer nombre base de serie
function extractSeriesName(name) {
  // Remover información de temporada/episodio
  return name
    .replace(/S\d+\s*E\d+.*$/i, '')
    .replace(/T\d+\s*Cap\d+.*$/i, '')
    .replace(/Season\s+\d+.*$/i, '')
    .trim();
}

// Extraer año de película
function extractYear(name) {
  const match = name.match(/\((\d{4})\)/);
  if (match) {
    return parseInt(match[1]);
  }
  return null;
}

// Función para parsear archivo M3U universal
function parseUniversalM3U(content) {
  const lines = content.split('\n');
  const items = [];
  let currentItem = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || (line.startsWith('#') && !line.startsWith('#EXTINF'))) {
      continue;
    }

    if (line.startsWith('#EXTINF')) {
      // Extraer todos los atributos
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/);
      const nameMatch = line.match(/,(.+)$/);

      const name = (tvgNameMatch ? tvgNameMatch[1] : (nameMatch ? nameMatch[1] : '')).trim();
      const groupTitle = groupTitleMatch ? groupTitleMatch[1] : 'General';
      const logo = tvgLogoMatch ? tvgLogoMatch[1] : '';

      currentItem = {
        name,
        groupTitle,
        logo,
        tvgId: tvgIdMatch ? tvgIdMatch[1] : ''
      };
    } else if (line.startsWith('http') || line.includes('://')) {
      currentItem.url = line;
      
      if (currentItem.url && currentItem.name) {
        const contentType = detectContentType(currentItem.name, currentItem.url, currentItem.groupTitle);
        currentItem.type = contentType;
        items.push({ ...currentItem });
      }
      
      currentItem = {};
    }
  }

  return items;
}

// Normalizar categoría
function normalizeCategory(category) {
  const categoryMap = {
    'DEPORTES': 'Deportes',
    'SPORTS': 'Deportes',
    'PELICULAS': 'Películas',
    'MOVIES': 'Películas',
    'SERIES': 'Series',
    'NOTICIAS': 'Noticias',
    'NEWS': 'Noticias',
    'INFANTIL': 'Infantil',
    'KIDS': 'Infantil',
    'ENTRETENIMIENTO': 'Entretenimiento',
    'ENTERTAINMENT': 'Entretenimiento',
    'DOCUMENTALES': 'Cultura',
    'DOCUMENTAL': 'Cultura'
  };

  const upperCategory = category.toUpperCase();
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (upperCategory.includes(key)) {
      return value;
    }
  }
  
  return category;
}

// Importar contenido
async function importContent() {
  try {
    console.log('\n🌙 Moon TV - Importador Universal');
    console.log('═══════════════════════════════════════\n');

    // Buscar archivo M3U
    const possibleFiles = [
      'channels.m3u',
      'tv_channels_brucasarez2_plus.m3u',
      'playlist.m3u',
      'lista.m3u'
    ];

    let m3uPath = null;
    for (const file of possibleFiles) {
      const testPath = path.join(__dirname, file);
      if (fs.existsSync(testPath)) {
        m3uPath = testPath;
        break;
      }
    }

    if (!m3uPath) {
      console.log('⚠️  No se encontró archivo M3U');
      console.log('📝 Copia tu archivo a: backend/scripts/\n');
      process.exit(1);
    }

    console.log(`📂 Archivo: ${path.basename(m3uPath)}`);
    const stats = fs.statSync(m3uPath);
    console.log(`📊 Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

    // Leer y parsear
    console.log('📖 Leyendo archivo...');
    const content = fs.readFileSync(m3uPath, 'utf8');
    
    console.log('🔍 Analizando contenido...');
    const items = parseUniversalM3U(content);
    
    console.log(`✅ Items encontrados: ${items.length}\n`);

    // Clasificar por tipo
    const channels = items.filter(item => item.type === 'channel');
    const seriesItems = items.filter(item => item.type === 'series');
    const movies = items.filter(item => item.type === 'movie');

    console.log('📊 Clasificación:\n');
    console.log(`   📺 Canales: ${channels.length}`);
    console.log(`   🎬 Películas: ${movies.length}`);
    console.log(`   📺 Episodios de Series: ${seriesItems.length}\n`);

    // Preguntar qué importar
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const shouldClear = await new Promise(resolve => {
      readline.question('❓ ¿Limpiar base de datos antes de importar? (s/n): ', answer => {
        resolve(answer.toLowerCase() === 's');
      });
    });

    if (shouldClear) {
      console.log('\n🗑️  Limpiando base de datos...');
      const deletedChannels = await Channel.deleteMany({});
      const deletedSeries = await Series.deleteMany({});
      const deletedMovies = await Movie.deleteMany({});
      console.log(`   Canales eliminados: ${deletedChannels.deletedCount}`);
      console.log(`   Series eliminadas: ${deletedSeries.deletedCount}`);
      console.log(`   Películas eliminadas: ${deletedMovies.deletedCount}\n`);
    }

    const importType = await new Promise(resolve => {
      console.log('❓ ¿Qué deseas importar?\n');
      console.log('   1) Todo (canales + series + películas)');
      console.log('   2) Solo canales');
      console.log('   3) Solo series');
      console.log('   4) Solo películas');
      console.log('   5) Series + películas\n');
      
      readline.question('Selecciona [1-5]: ', answer => {
        readline.close();
        resolve(answer);
      });
    });

    console.log('\n');

    let stats_imported = {
      channels: 0,
      series: 0,
      movies: 0,
      errors: 0
    };

    // Importar Canales
    if (importType === '1' || importType === '2') {
      console.log('📺 Importando canales...\n');
      
      for (const item of channels) {
        try {
          const exists = await Channel.findOne({ streamUrl: item.url });
          
          if (!exists) {
            await Channel.create({
              name: item.name,
              streamUrl: item.url,
              category: normalizeCategory(item.groupTitle),
              logo: item.logo,
              isActive: true,
              country: 'MX'
            });
            
            stats_imported.channels++;
            
            if (stats_imported.channels % 50 === 0) {
              console.log(`   ✅ ${stats_imported.channels} canales...`);
            }
          }
        } catch (error) {
          stats_imported.errors++;
        }
      }
      
      console.log(`\n✅ Canales importados: ${stats_imported.channels}\n`);
    }

    // Importar Series
    if (importType === '1' || importType === '3' || importType === '5') {
      console.log('📺 Importando series...\n');
      
      // Agrupar episodios por serie
      const seriesMap = new Map();
      
      for (const item of seriesItems) {
        const episodeInfo = extractEpisodeInfo(item.name);
        if (!episodeInfo) continue;
        
        const seriesName = extractSeriesName(item.name);
        
        if (!seriesMap.has(seriesName)) {
          seriesMap.set(seriesName, {
            name: seriesName,
            category: normalizeCategory(item.groupTitle),
            logo: item.logo,
            episodes: []
          });
        }
        
        seriesMap.get(seriesName).episodes.push({
          season: episodeInfo.season,
          episode: episodeInfo.episode,
          title: episodeInfo.title || item.name,
          url: item.url,
          thumbnail: item.logo
        });
      }
      
      // Crear series
      for (const [seriesName, seriesData] of seriesMap) {
        try {
          const exists = await Series.findOne({ title: seriesName });
          
          if (!exists) {
            // Organizar episodios por temporada
            const seasons = {};
            
            seriesData.episodes.forEach(ep => {
              if (!seasons[ep.season]) {
                seasons[ep.season] = [];
              }
              seasons[ep.season].push({
                number: ep.episode,
                title: ep.title,
                streamUrl: ep.url,
                thumbnail: ep.thumbnail
              });
            });
            
            // Crear estructura de temporadas
            const seasonsArray = Object.keys(seasons).map(seasonNum => ({
              number: parseInt(seasonNum),
              episodes: seasons[seasonNum].sort((a, b) => a.number - b.number)
            }));
            
            await Series.create({
              title: seriesName,
              poster: seriesData.logo,
              genres: [seriesData.category],
              seasons: seasonsArray,
              isActive: true,
              status: 'En emisión'
            });
            
            stats_imported.series++;
            
            if (stats_imported.series % 10 === 0) {
              console.log(`   ✅ ${stats_imported.series} series...`);
            }
          }
        } catch (error) {
          stats_imported.errors++;
          console.error(`   ❌ Error con ${seriesName}:`, error.message);
        }
      }
      
      console.log(`\n✅ Series importadas: ${stats_imported.series}\n`);
    }

    // Importar Películas
    if (importType === '1' || importType === '4' || importType === '5') {
      console.log('🎬 Importando películas...\n');
      
      for (const item of movies) {
        try {
          const exists = await Movie.findOne({ title: item.name });
          
          if (!exists) {
            const year = extractYear(item.name);
            const cleanName = item.name.replace(/\(\d{4}\)/, '').trim();
            
            await Movie.create({
              title: cleanName,
              streamUrl: item.url,
              poster: item.logo,
              genres: [normalizeCategory(item.groupTitle)],
              year: year,
              isActive: true
            });
            
            stats_imported.movies++;
            
            if (stats_imported.movies % 50 === 0) {
              console.log(`   ✅ ${stats_imported.movies} películas...`);
            }
          }
        } catch (error) {
          stats_imported.errors++;
        }
      }
      
      console.log(`\n✅ Películas importadas: ${stats_imported.movies}\n`);
    }

    // Resumen final
    console.log('═══════════════════════════════════════\n');
    console.log('📊 Resumen Final:\n');
    console.log(`   📺 Canales: ${stats_imported.channels}`);
    console.log(`   🎬 Películas: ${stats_imported.movies}`);
    console.log(`   📺 Series: ${stats_imported.series}`);
    console.log(`   ❌ Errores: ${stats_imported.errors}`);
    console.log(`\n   📺 Total Canales en BD: ${await Channel.countDocuments()}`);
    console.log(`   🎬 Total Películas en BD: ${await Movie.countDocuments()}`);
    console.log(`   📺 Total Series en BD: ${await Series.countDocuments()}\n`);

    console.log('✨ Importación completada!\n');
    console.log('🌐 Accede a:\n');
    console.log('   Canales: http://localhost:3000/channels');
    console.log('   Películas: http://localhost:3000/movies');
    console.log('   Series: http://localhost:3000/series\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar
importContent();
