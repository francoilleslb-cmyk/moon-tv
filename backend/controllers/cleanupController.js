const Channel = require('../models/Channel');
const Movie = require('../models/Movie');
const Series = require('../models/Series');

// @desc    Reset Content (Delete all and seed test channel)
// @route   GET /api/cleanup/reset-content
// @access  Public
exports.resetContent = async (req, res, next) => {
    try {
        // 1. Eliminar todo el contenido
        await Channel.deleteMany({});
        await Movie.deleteMany({});
        await Series.deleteMany({});

        // 2. Crear canal de prueba
        const testChannel = await Channel.create({
            name: 'Canal de Prueba',
            logo: 'https://cdn-icons-png.flaticon.com/512/3658/3658959.png',
            streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            category: 'General',
            is24x7: true,
            isActive: true,
            description: 'Canal de prueba para verificar funcionamiento'
        });

        res.json({
            success: true,
            message: 'Base de datos limpiada. Se ha creado un canal de prueba.',
            testChannel
        });
    } catch (error) {
        next(error);
    }
};
