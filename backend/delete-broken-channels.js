const mongoose = require('mongoose');
require('dotenv').config();

// Conexión a MongoDB desde el .env
const MONGODB_URI = process.env.MONGODB_URI;

// Lista de nombres de canales rotos que queremos eliminar
const BROKEN_CHANNELS = [
    'ESPPN 4HD',
    'ESPPN 5HD',
    'ESPPN 6',
    'ESPPN 6HD',
    'ESPPN 7',
    'ESPPN 7HD',
    'ESPPN CO',
    'ESPPN HD',
    'ESPPN Premium HD',
    'Enllace',
    'Esnne TV',
    'FX',
    'FX  HD'
];

// Importar el modelo de Channel
const Channel = require('./models/Channel');

async function deleteChannels() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado exitosamente\n');

        // Contar cuántos canales hay en total
        const totalCount = await Channel.countDocuments();
        console.log(`📊 Total de canales en la base de datos: ${totalCount}\n`);

        // Buscar los canales rotos
        console.log('🔍 Buscando canales rotos...\n');
        const brokenChannelsInDb = await Channel.find({
            name: { $in: BROKEN_CHANNELS }
        });

        console.log(`📋 Canales rotos encontrados: ${brokenChannelsInDb.length}`);
        brokenChannelsInDb.forEach(channel => {
            console.log(`   - ${channel.name} (ID: ${channel._id})`);
        });

        if (brokenChannelsInDb.length === 0) {
            console.log('\n✨ No se encontraron canales rotos para eliminar');
            await mongoose.connection.close();
            return;
        }

        // Eliminar los canales
        console.log(`\n🗑️  Eliminando ${brokenChannelsInDb.length} canales rotos...\n`);

        const result = await Channel.deleteMany({
            name: { $in: BROKEN_CHANNELS }
        });

        console.log(`✅ Eliminados ${result.deletedCount} canales exitosamente\n`);

        // Verificar el nuevo total
        const newTotalCount = await Channel.countDocuments();
        console.log(`📊 Total de canales después de la limpieza: ${newTotalCount}`);
        console.log(`🎉 Se eliminaron ${totalCount - newTotalCount} canales en total\n`);

        await mongoose.connection.close();
        console.log('🔌 Desconectado de MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

deleteChannels();
