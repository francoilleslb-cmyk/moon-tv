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

// ENDPOINT TEMPORAL - Eliminar por lista
router.post('/delete-list', async (req, res) => {
    try {
        const { channels } = req.body;

        if (!channels || !Array.isArray(channels) || channels.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere una lista de canales en el body: { channels: ["Nombre1", "Nombre2"] }'
            });
        }

        // Contar cuántos canales hay en total
        const totalCount = await Channel.countDocuments();

        // Buscar los canales a eliminar
        const channelsInDb = await Channel.find({
            name: { $in: channels }
        });

        if (channelsInDb.length === 0) {
            return res.json({
                success: true,
                message: 'No se encontraron canales para eliminar',
                totalBefore: totalCount,
                totalAfter: totalCount,
                deletedCount: 0
            });
        }

        // Eliminar los canales
        const result = await Channel.deleteMany({
            name: { $in: channels }
        });

        // Verificar el nuevo total
        const newTotalCount = await Channel.countDocuments();

        res.json({
            success: true,
            message: `Eliminados ${result.deletedCount} canales exitosamente`,
            totalBefore: totalCount,
            totalAfter: newTotalCount,
            deletedCount: result.deletedCount,
            deletedChannels: channelsInDb.map(c => c.name)
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
