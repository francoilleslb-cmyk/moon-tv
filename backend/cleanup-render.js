// Script para ejecutar DIRECTAMENTE en la consola de Render
// Ve a: Render Dashboard > tu servicio backend > Shell

const mongoose = require('mongoose');
require('dotenv').config();

const BROKEN_CHANNELS = [
    'ESPPN 4HD', 'ESPPN 5HD', 'ESPPN 6', 'ESPPN 6HD',
    'ESPPN 7', 'ESPPN 7HD', 'ESPPN CO', 'ESPPN HD',
    'ESPPN Premium HD', 'Enllace', 'Esnne TV', 'FX', 'FX  HD'
];

const Channel = require('./models/Channel');

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        const totalBefore = await Channel.countDocuments();
        console.log(`📊 Total de canales: ${totalBefore}\n`);

        const broken = await Channel.find({ name: { $in: BROKEN_CHANNELS } });
        console.log(`📋 Canales rotos encontrados: ${broken.length}`);
        broken.forEach(c => console.log(`   - ${c.name}`));

        if (broken.length > 0) {
            const result = await Channel.deleteMany({ name: { $in: BROKEN_CHANNELS } });
            console.log(`\n✅ Eliminados: ${result.deletedCount} canales`);

            const totalAfter = await Channel.countDocuments();
            console.log(`📊 Total después: ${totalAfter}\n`);
        } else {
            console.log('\n✨ No hay canales rotos\n');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
