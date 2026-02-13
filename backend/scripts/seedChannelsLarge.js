require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Channel = require('../models/Channel');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Función mejorada para parsear archivo M3U
function parseM3U(content) {
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = {};
  let lineNumber = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    lineNumber++;

    // Ignorar líneas vacías y comentarios que no son EXTINF
    if (!line || (line.startsWith('#') && !line.startsWith('#EXTINF'))) {
      continue;
    }

    // Línea EXTINF
    if (line.startsWith('#EXTINF')) {
      // Extraer información del canal
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/);
      const nameMatch = line.match(/,(.+)$/);

      const channelName = nameMatch ? nameMatch[1].trim() : 'Canal sin nombre';
      
      currentChannel = {
        name: channelName,
        category: groupMatch ? groupMatch[1] : 'General',
        streamUrl: '',
        country: extractCountry(channelName),
        isActive: true,
        is24x7: !line.includes('[NOT 24/7]') && !line.includes('(SOLO EN PARTIDO)'),
        tags: [],
        logo: tvgLogoMatch ? tvgLogoMatch[1] : ''
      };

      // Agregar tags basados en el nombre
      if (line.includes('HD')) currentChannel.quality = 'HD';
      if (line.includes('4K')) currentChannel.quality = '4K';
      if (line.includes('FHD')) currentChannel.quality = 'FHD';
      if (line.includes('[NOT 24/7]')) currentChannel.tags.push('No 24/7');
      if (line.includes('(SOLO EN PARTIDO)')) currentChannel.tags.push('Solo en partido');
      if (line.includes('LIVE')) currentChannel.tags.push('Live');
    }
    // URL del stream
    else if (line.startsWith('http') || line.includes('://')) {
      currentChannel.streamUrl = line;
      
      // Solo agregar si tiene URL válida
      if (currentChannel.streamUrl && currentChannel.name) {
        channels.push({ ...currentChannel });
      }
      
      currentChannel = {};
    }
  }

  return channels;
}

// Función para extraer país del nombre
function extractCountry(name) {
  const countryMatch = name.match(/^([A-Z]{2,3}):/);
  if (countryMatch) {
    const countryCode = countryMatch[1];
    const countryMap = {
      'MX': 'MX', 'PR': 'PR', 'GT': 'GT', 'PE': 'PE', 'SV': 'SV',
      'HN': 'HN', 'EC': 'EC', 'BO': 'BO', 'PA': 'PA', 'AR': 'AR',
      'US': 'US', 'TR': 'TR', 'SP': 'ES', 'ES': 'ES', 'CO': 'CO', 
      'EN': 'GB', 'BR': 'BR', 'CL': 'CL', 'VE': 'VE', 'UY': 'UY',
      'PY': 'PY', 'CR': 'CR', 'DO': 'DO', 'CU': 'CU', 'NI': 'NI'
    };
    return countryMap[countryCode] || countryCode;
  }
  return 'MX'; // Por defecto México
}

// Función para limpiar y normalizar categorías
function normalizeCategory(category) {
  const categoryMap = {
    'DEPORTES': 'Deportes',
    'SPORTS': 'Deportes',
    'SPORT': 'Deportes',
    'PELICULAS': 'Películas',
    'MOVIES': 'Películas',
    'SERIES': 'Series',
    'TV SHOWS': 'Series',
    'NOTICIAS': 'Noticias',
    'NEWS': 'Noticias',
    'INFANTIL': 'Infantil',
    'KIDS': 'Infantil',
    'ENTRETENIMIENTO': 'Entretenimiento',
    'ENTERTAINMENT': 'Entretenimiento',
    'MUSICA': 'Música',
    'MUSIC': 'Música',
    'DOCUMENTALES': 'Cultura',
    'DOCUMENTAL': 'Cultura',
    'CULTURA': 'Cultura'
  };

  const upperCategory = category.toUpperCase();
  return categoryMap[upperCategory] || category;
}

// Función principal de importación con batch processing
async function seedChannels() {
  try {
    console.log('🚀 Moon TV - Importación de Canales\n');
    console.log('═══════════════════════════════════════\n');

    // Buscar archivo M3U
    const possibleFiles = [
      'channels.m3u',
      'tv_channels_brucasarez2_plus.m3u',
      'playlist.m3u',
      'lista.m3u'
    ];

    let m3uPath = null;
    let m3uContent = null;

    for (const file of possibleFiles) {
      const testPath = path.join(__dirname, file);
      if (fs.existsSync(testPath)) {
        m3uPath = testPath;
        break;
      }
    }

    if (!m3uPath) {
      console.log('⚠️  No se encontró archivo M3U en scripts/');
      console.log('📝 Archivos buscados:', possibleFiles.join(', '));
      console.log('\n💡 Instrucciones:');
      console.log('   1. Copia tu archivo .m3u a: backend/scripts/');
      console.log('   2. Renómbralo a: channels.m3u');
      console.log('   3. Ejecuta este script nuevamente\n');
      process.exit(1);
    }

    console.log(`📂 Archivo encontrado: ${path.basename(m3uPath)}`);
    const stats = fs.statSync(m3uPath);
    console.log(`📊 Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

    // Leer archivo
    console.log('📖 Leyendo archivo...');
    m3uContent = fs.readFileSync(m3uPath, 'utf8');
    
    // Parsear canales
    console.log('🔍 Parseando canales...');
    let channels = parseM3U(m3uContent);
    
    console.log(`✅ Canales encontrados: ${channels.length}\n`);

    // Normalizar categorías
    channels = channels.map(ch => ({
      ...ch,
      category: normalizeCategory(ch.category)
    }));

    // Mostrar estadísticas
    console.log('📊 Estadísticas del archivo:\n');
    
    const categoryCounts = {};
    channels.forEach(ch => {
      categoryCounts[ch.category] = (categoryCounts[ch.category] || 0) + 1;
    });

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    sortedCategories.forEach(([category, count]) => {
      console.log(`   ${category}: ${count} canales`);
    });

    if (Object.keys(categoryCounts).length > 15) {
      console.log(`   ... y ${Object.keys(categoryCounts).length - 15} categorías más`);
    }

    console.log('\n');

    // Preguntar si desea limpiar BD
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const shouldClear = await new Promise(resolve => {
      readline.question('❓ ¿Deseas limpiar los canales existentes? (s/n): ', answer => {
        readline.close();
        resolve(answer.toLowerCase() === 's');
      });
    });

    if (shouldClear) {
      const deleted = await Channel.deleteMany({});
      console.log(`\n🗑️  ${deleted.deletedCount} canales eliminados\n`);
    }

    // Insertar canales en lotes (batch processing)
    console.log('📺 Importando canales...\n');
    
    const BATCH_SIZE = 100;
    let inserted = 0;
    let errors = 0;
    let duplicates = 0;

    for (let i = 0; i < channels.length; i += BATCH_SIZE) {
      const batch = channels.slice(i, i + BATCH_SIZE);
      
      for (const channelData of batch) {
        try {
          // Verificar si el canal ya existe
          const exists = await Channel.findOne({ 
            streamUrl: channelData.streamUrl 
          });

          if (!exists) {
            await Channel.create(channelData);
            inserted++;
            
            if (inserted % 100 === 0) {
              console.log(`   ✅ ${inserted} canales insertados...`);
            }
          } else {
            duplicates++;
          }
        } catch (error) {
          errors++;
          if (errors <= 5) {
            console.error(`   ❌ Error insertando ${channelData.name}:`, error.message);
          }
        }
      }
    }

    console.log('\n═══════════════════════════════════════\n');
    console.log('📊 Resumen de Importación:\n');
    console.log(`   ✅ Canales insertados: ${inserted}`);
    console.log(`   ⚠️  Duplicados ignorados: ${duplicates}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📺 Total en BD: ${await Channel.countDocuments()}\n`);

    // Mostrar estadísticas finales por categoría
    const finalStats = await Channel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    console.log('📊 Canales por categoría (Top 15):\n');
    finalStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n✨ Importación completada exitosamente!\n');
    console.log('🌐 Puedes ver los canales en: http://localhost:3000/channels\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar
seedChannels();
