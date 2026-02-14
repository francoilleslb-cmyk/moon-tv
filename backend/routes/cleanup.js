const express = require('express');
const Channel = require('../models/Channel');

const router = express.Router();

// Lista de canales rotos a eliminar
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

// ENDPOINT TEMPORAL - Eliminar después de usarlo
router.delete('/cleanup-broken', async (req, res) => {
    try {
        // Contar cuántos canales hay en total
        const totalCount = await Channel.countDocuments();

        // Buscar los canales rotos
        const brokenChannelsInDb = await Channel.find({
            name: { $in: BROKEN_CHANNELS }
        });

        if (brokenChannelsInDb.length === 0) {
            return res.json({
                success: true,
                message: 'No se encontraron canales rotos para eliminar',
                totalBefore: totalCount,
                totalAfter: totalCount,
                deletedCount: 0
            });
        }

        // Eliminar los canales
        const result = await Channel.deleteMany({
            name: { $in: BROKEN_CHANNELS }
        });

        // Verificar el nuevo total
        const newTotalCount = await Channel.countDocuments();

        res.json({
            success: true,
            message: `Eliminados ${result.deletedCount} canales rotos exitosamente`,
            totalBefore: totalCount,
            totalAfter: newTotalCount,
            deletedCount: result.deletedCount,
            deletedChannels: brokenChannelsInDb.map(c => c.name)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar canales',
            error: error.message
        });
    }
});

module.exports = router;
