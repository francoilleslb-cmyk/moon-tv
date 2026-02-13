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

// Función para parsear archivo M3U
function parseM3U(content) {
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Ignorar líneas vacías y comentarios que no son EXTINF
    if (!line || (line.startsWith('#') && !line.startsWith('#EXTINF'))) {
      continue;
    }

    // Línea EXTINF
    if (line.startsWith('#EXTINF')) {
      // Extraer información del canal
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const nameMatch = line.match(/,(.+)$/);

      currentChannel = {
        name: nameMatch ? nameMatch[1].trim() : 'Canal sin nombre',
        category: groupMatch ? groupMatch[1] : 'General',
        streamUrl: '',
        country: extractCountry(nameMatch ? nameMatch[1] : ''),
        isActive: true,
        is24x7: !line.includes('[NOT 24/7]') && !line.includes('(SOLO EN PARTIDO)'),
        tags: []
      };

      // Agregar tags basados en el nombre
      if (line.includes('HD')) currentChannel.quality = 'HD';
      if (line.includes('4K')) currentChannel.quality = '4K';
      if (line.includes('[NOT 24/7]')) currentChannel.tags.push('No 24/7');
      if (line.includes('(SOLO EN PARTIDO)')) currentChannel.tags.push('Solo en partido');
    }
    // URL del stream
    else if (line.startsWith('http')) {
      currentChannel.streamUrl = line;
      
      // Solo agregar si tiene URL válida
      if (currentChannel.streamUrl) {
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
      'US': 'US', 'TR': 'TR', 'SP': 'ES', 'CO': 'CO', 'EN': 'GB',
      'AGS': 'MX', 'BAJA': 'MX', 'CAM': 'MX', 'CDMX': 'MX',
      'CUA': 'MX', 'COA': 'MX', 'CHIAP': 'MX', 'DGO': 'MX',
      'EDOMEX': 'MX', 'GRO': 'MX', 'GTO': 'MX', 'JAL': 'MX',
      'MICH': 'MX', 'MOR': 'MX', 'NL': 'MX', 'PUE': 'MX',
      'QRO': 'MX', 'QOO': 'MX', 'SIN': 'MX', 'SLP': 'MX',
      'SON': 'MX', 'TAB': 'MX', 'TAM': 'MX', 'VER': 'MX',
      'YUC': 'MX', 'ZAC': 'MX'
    };
    return countryMap[countryCode] || countryCode;
  }
  return 'MX'; // Por defecto México
}

// Función principal de importación
async function seedChannels() {
  try {
    console.log('🚀 Iniciando importación de canales...\n');

    // Leer archivo M3U (debes guardar el contenido en un archivo)
    const m3uPath = path.join(__dirname, 'channels.m3u');
    
    if (!fs.existsSync(m3uPath)) {
      console.log('⚠️  Archivo channels.m3u no encontrado.');
      console.log('📝 Crea el archivo en: scripts/channels.m3u');
      console.log('   y pega el contenido del documento M3U que proporcionaste.\n');
      process.exit(1);
    }

    const m3uContent = fs.readFileSync(m3uPath, 'utf8');
    
    // Parsear canales
    const channels = parseM3U(m3uContent);
    
    console.log(`📺 Canales encontrados: ${channels.length}\n`);

    // Limpiar canales existentes (opcional)
    const deleteChoice = process.argv.includes('--clear');
    if (deleteChoice) {
      await Channel.deleteMany({});
      console.log('🗑️  Canales existentes eliminados\n');
    }

    // Insertar canales
    let inserted = 0;
    let errors = 0;

    for (const channelData of channels) {
      try {
        // Verificar si el canal ya existe
        const exists = await Channel.findOne({ 
          streamUrl: channelData.streamUrl 
        });

        if (!exists) {
          await Channel.create(channelData);
          inserted++;
          
          if (inserted % 50 === 0) {
            console.log(`✅ ${inserted} canales insertados...`);
          }
        }
      } catch (error) {
        errors++;
        console.error(`❌ Error insertando ${channelData.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✅ Canales insertados: ${inserted}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📺 Total en BD: ${await Channel.countDocuments()}\n`);

    // Mostrar estadísticas por categoría
    const stats = await Channel.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('📊 Canales por categoría:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n✨ Importación completada exitosamente!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  }
}

// Ejecutar
seedChannels();
