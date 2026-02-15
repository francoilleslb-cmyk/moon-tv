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
// @desc    Seed User List (TEMPORAL)
// @route   GET /api/cleanup/seed-list
// @access  Public
exports.seedUserList = async (req, res, next) => {
    try {
        const rawM3U = `#EXTINF:-1,Mega
190.151.80.242:9990/play/a0kd/index.m3u8
#EXTINF:-1,CHV
190.151.80.242:9990/play/a0ke/index.m3u8
#EXTINF:-1,La Red
190.151.80.242:9990/play/a0kb/index.m3u8
#EXTINF:-1,CANAL 13
190.151.80.242:9990/play/a0kf/index.m3u8
#EXTINF:-1,TVN
190.151.80.242:9990/play/a0kc/index.m3u8
#EXTINF:-1 tvg-id="15324hr.cl",24 HORAS
190.151.80.242:9990/play/a0kn/index.m3u8
#EXTINF:-1,CNN Chile
190.151.80.242:9990/play/a0l2/index.m3u8
#EXTINF:-1,Hospicio Television
190.151.80.242:9990/play/a0n3/index.m3u8
#EXTINF:-1,Iquique TV
190.151.80.242:9990/play/a0mi/index.m3u8
#EXTINF:-1,Discovery Turbo
190.151.80.242:9990/play/a0lv/index.m3u8
#EXTINF:-1,Cartoon Network
190.151.80.242:9990/play/a0l5/index.m3u8
#EXTINF:-1,BabyFirst
190.151.80.242:9990/play/a0lc/index.m3u8
#EXTINF:-1,Discovery Kids
190.151.80.242:9990/play/a0k9/index.m3u8
#EXTINF:-1,Disney Channel
190.151.80.242:9990/play/a0jg/index.m3u8
#EXTINF:-1,Disney Jr
190.151.80.242:9990/play/a0km/index.m3u8
#EXTINF:-1,Nick Jr
190.151.80.242:9990/play/a0lu/index.m3u8
#EXTINF:-1,Nickelodeon
190.151.80.242:9990/play/a0ku/index.m3u8
#EXTINF:-1,NTV
190.151.80.242:9990/play/a0kt/index.m3u8
#EXTINF:-1,Enlace
190.151.80.242:9990/play/a0la/index.m3u8
#EXTINF:-1,Esne TV
190.151.80.242:9990/play/a0lw/index.m3u8
#EXTINF:-1,MTV
190.151.80.242:9990/play/a0l0/index.m3u8
#EXTINF:-1,ViaX
190.151.80.242:9990/play/a0k4/index.m3u8
#EXTINF:-1,Zona Latina
190.151.80.242:9990/play/a0l1/index.m3u8
#EXTINF:-1,Canal Estrellas
190.151.80.242:9990/play/a0k5/index.m3u8
#EXTINF:-1,CNN Espanol
190.151.80.242:9990/play/a0ka/index.m3u8
#EXTINF:-1,E Entertainment
190.151.80.242:9990/play/a0jk/index.m3u8
#EXTINF:-1,Lifetime
190.151.80.242:9990/play/a0ld/index.m3u8
#EXTINF:-1,Telemundo
190.151.80.242:9990/play/a0k8/index.m3u8
#EXTINF:-1,TLC
190.151.80.242:9990/play/a0k3/index.m3u8
#EXTINF:-1,TVE
190.151.80.242:9990/play/a0lb/index.m3u8
#EXTINF:-1,AE Mundo
190.151.80.242:9990/play/a0jr/index.m3u8
#EXTINF:-1,AXN
190.151.80.242:9990/play/a0lk/index.m3u8
#EXTINF:-1,Cinecanal
190.151.80.242:9990/play/a0kx/index.m3u8
#EXTINF:-1,Cinemax
190.151.80.242:9990/play/a0li/index.m3u8
#EXTINF:-1,FX
190.151.80.242:9990/play/a0lm/index.m3u8
#EXTINF:-1,HBO
190.151.80.242:9990/play/a0lh/index.m3u8
#EXTINF:-1,HBO 2
190.151.80.242:9990/play/a0ki/index.m3u8
#EXTINF:-1,HBO Family
190.151.80.242:9990/play/a0kl/index.m3u8
#EXTINF:-1,HBO Plus
190.151.80.242:9990/play/a0kj/index.m3u8
#EXTINF:-1,HBO XTREME SD
190.151.80.242:9990/play/a0kk/index.m3u8
#EXTINF:-1,NTV
190.151.80.242:9990/play/a0kz/index.m3u8
#EXTINF:-1,Space
190.151.80.242:9990/play/a0ll/index.m3u8
#EXTINF:-1,Sony
190.151.80.242:9990/play/a0lj/index.m3u8
#EXTINF:-1,STAR CHANNEL
190.151.80.242:9990/play/a0l3/index.m3u8
#EXTINF:-1,Studio Universal
190.151.80.242:9990/play/a0ko/index.m3u8
#EXTINF:-1,USA
190.151.80.242:9990/play/a0le/index.m3u8
#EXTINF:-1,TCM
190.151.80.242:9990/play/a0l4/index.m3u8
#EXTINF:-1,TNT
190.151.80.242:9990/play/a0l6/index.m3u8
#EXTINF:-1,RTC Iquique
190.151.80.242:9990/play/a0n4/index.m3u8
#EXTINF:-1,Universal
190.151.80.242:9990/play/a0ky/index.m3u8
#EXTINF:-1,Universal Cinema SD
190.151.80.242:9990/play/a0kr/index.m3u8
#EXTINF:-1,Universal Comedy SD
190.151.80.242:9990/play/a0ks/index.m3u8
#EXTINF:-1,Universal Premiere SD
190.151.80.242:9990/play/a0kq/index.m3u8
#EXTINF:-1,Warner
190.151.80.242:9990/play/a0jj/index.m3u8
#EXTINF:-1,ESPN
190.151.80.242:9990/play/a0jn/index.m3u8
#EXTINF:-1,ESPN 2
190.151.80.242:9990/play/a0kp/index.m3u8
#EXTINF:-1,ESPN 3
190.151.80.242:9990/play/a0lx/index.m3u8
#EXTINF:-1,ESPN 4
190.151.80.242:9990/play/a0jl/index.m3u8
#EXTINF:-1,ESPN PREMIUM
190.151.80.242:9990/play/a0kh/index.m3u8
#EXTINF:-1,ESPN 7
190.151.80.242:9990/play/a0k6/index.m3u8
#EXTINF:-1,ESPN 6
190.151.80.242:9990/play/a0k7/index.m3u8
#EXTINF:-1,TNT SPORTS Premium
190.151.80.242:9990/play/a0kg/index.m3u8
#EXTINF:-1,13 Kids
190.151.80.242:9990/play/a0p6/index.m3u8
#EXTINF:-1,13 Teleseries
190.151.80.242:9990/play/a0p5/index.m3u8
#EXTINF:-1,ESPN 5
190.151.80.242:9990/play/a0oh/index.m3u8
#EXTINF:-1,El Pinguino
190.151.80.242:9990/play/a0p4/index.m3u8
#EXTINF:-1,TNT SPORTS 3
190.151.80.242:9990/play/a0jq/index.m3u8
#EXTINF:-1,Telefe
190.151.80.242:9990/play/a0oj/index.m3u8
#EXTINF:-1,TyC
190.151.80.242:9990/play/a0op/index.m3u8
#EXTINF:-1,Unicanal
190.151.80.242:9990/play/a0or/index.m3u8
#EXTINF:-1 group-title="-",AMC HD
45.226.205.96:8000/play/a036/index.m3u8
#EXTINF:-1 group-title="-",AXN HD
45.226.205.96:8000/play/a02m/index.m3u8
#EXTINF:-1 group-title="-",Adult Swim
45.226.205.96:8000/play/a01b/index.m3u8`;

        const lines = rawM3U.split('\n');
        const channels = [];
        let currentInfo = null;

        // Categorización simple basada en keywords
        const getCategory = (name) => {
            const n = name.toLowerCase();
            if (n.includes('kids') || n.includes('cartoon') || n.includes('disney') || n.includes('nick') || n.includes('infantil')) return 'Infantil';
            if (n.includes('sport') || n.includes('espn') || n.includes('deportes') || n.includes('liga') || n.includes('futbol')) return 'Deportes';
            if (n.includes('cnn') || n.includes('noticias') || n.includes('24 horas')) return 'Noticias';
            if (n.includes('cine') || n.includes('hbo') || n.includes('movie') || n.includes('film') || n.includes('tnt') || n.includes('universal') || n.includes('warner') || n.includes('space') || n.includes('studio') || n.includes('axn') || n.includes('amc')) return 'Películas';
            if (n.includes('adult') || n.includes('xxx')) return 'Bics';
            if (n.includes('music') || n.includes('mtv')) return 'Música';
            if (n.includes('mega') || n.includes('chv') || n.includes('red') || n.includes('13') || n.includes('tvn')) return 'General';
            return 'General';
        };

        for (const line of lines) {
            if (line.trim().startsWith('#EXTINF')) {
                // Parsear nombre
                const parts = line.split(',');
                let name = parts[parts.length - 1].trim();

                // Parsear etiquetas si existen
                let tags = [];
                if (line.includes('group-title')) {
                    // Extraer info de grupo si es necesario
                }

                currentInfo = { name };
            } else if (line.trim().length > 0 && !line.startsWith('#')) {
                if (currentInfo) {
                    let url = line.trim();
                    if (!url.startsWith('http')) {
                        url = 'http://' + url;
                    }

                    channels.push({
                        name: currentInfo.name,
                        streamUrl: url,
                        category: getCategory(currentInfo.name),
                        isActive: true,
                        is24x7: true,
                        logo: '' // Sin logo por ahora
                    });
                    currentInfo = null;
                }
            }
        }

        // Limpiar nuevamente e Insertar
        await Channel.deleteMany({});
        await Movie.deleteMany({});
        await Series.deleteMany({});

        await Channel.insertMany(channels);

        res.json({
            success: true,
            message: `Se han importado ${channels.length} canales.`,
            count: channels.length,
            sample: channels[0]
        });
    } catch (error) {
        next(error);
    }
};
