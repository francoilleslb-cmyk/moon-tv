const { MongoClient } = require('mongodb');

// Conexión a MongoDB
const MONGODB_URI = 'mongodb://admin_moon:Moon2026@cluster0-shard-00-00.xvjmpli.mongodb.net:27017,cluster0-shard-00-01.xvjmpli.mongodb.net:27017,cluster0-shard-00-02.xvjmpli.mongodb.net:27017/moontv?ssl=true&replicaSet=atlas-xvjmpli-shard-0&authSource=admin&retryWrites=true&w=majority';

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

async function deleteChannels() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Conectando a MongoDB...\n');
        await client.connect();
        console.log('✅ Conectado exitosamente\n');

        const db = client.db('moontv');
        const collection = db.collection('channels');

        // Primero, contar cuántos canales hay en total
        const totalCount = await collection.countDocuments();
        console.log(`📊 Total de canales en la base de datos: ${totalCount}\n`);

        // Buscar los canales rotos
        console.log('🔍 Buscando canales rotos...\n');
        const brokenChannelsInDb = await collection.find({
            name: { $in: BROKEN_CHANNELS }
        }).toArray();

        console.log(`📋 Canales rotos encontrados: ${brokenChannelsInDb.length}`);
        brokenChannelsInDb.forEach(channel => {
            console.log(`   - ${channel.name} (ID: ${channel._id})`);
        });

        if (brokenChannelsInDb.length === 0) {
            console.log('\n✨ No se encontraron canales rotos para eliminar');
            return;
        }

        // Confirmar eliminación
        console.log(`\n🗑️  Eliminando ${brokenChannelsInDb.length} canales rotos...\n`);

        const result = await collection.deleteMany({
            name: { $in: BROKEN_CHANNELS }
        });

        console.log(`✅ Eliminados ${result.deletedCount} canales exitosamente\n`);

        // Verificar el nuevo total
        const newTotalCount = await collection.countDocuments();
        console.log(`📊 Total de canales después de la limpieza: ${newTotalCount}`);
        console.log(`🎉 Se eliminaron ${totalCount - newTotalCount} canales en total\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await client.close();
        console.log('\n🔌 Desconectado de MongoDB');
    }
}

deleteChannels();
