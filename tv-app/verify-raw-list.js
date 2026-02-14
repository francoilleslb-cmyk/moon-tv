const axios = require('axios');

// Input del usuario (Lista raw)
const RAW_INPUT = `
138.121.114.86:8000/play/a0ce/index.m3u8
#EXTINF:-1,26TV
138.121.114.86:8000/play/a05x/index.m3u8
#EXTINF:-1,A&E HD
138.121.114.86:8000/play/a0cz/index.m3u8
#EXTINF:-1,A24
138.121.114.86:8000/play/a05u/index.m3u8
#EXTINF:-1,AM Sports
138.121.114.86:8000/play/a061/index.m3u8
#EXTINF:-1,AMC
138.121.114.86:8000/play/a064/index.m3u8
#EXTINF:-1,AXN
138.121.114.86:8000/play/a0da/index.m3u8
#EXTINF:-1,Adult swim HD
138.121.114.86:8000/play/a08d/index.m3u8
#EXTINF:-1,America TV
138.121.114.86:8000/play/a0d0/index.m3u8
#EXTINF:-1,Baby TV
138.121.114.86:8000/play/a06j/index.m3u8
#EXTINF:-1,C5N
138.121.114.86:8000/play/a05v/index.m3u8
#EXTINF:-1,CNN en Espaæol
138.121.114.86:8000/play/a0cw/index.m3u8
#EXTINF:-1,Canal a
138.121.114.86:8000/play/a06d/index.m3u8
#EXTINF:-1,Canal de la Ciudad
138.121.114.86:8000/play/a07c/index.m3u8
#EXTINF:-1,Cartoon Network HD
138.121.114.86:8000/play/a083/index.m3u8
#EXTINF:-1,Cine.AR
138.121.114.86:8000/play/a069/index.m3u8
#EXTINF:-1,Cinecanal HD
138.121.114.86:8000/play/a089/index.m3u8
#EXTINF:-1,Cinemax
138.121.114.86:8000/play/a0d1/index.m3u8
#EXTINF:-1,Comedy Central HD
138.121.114.86:8000/play/a072/index.m3u8
#EXTINF:-1,Crðnica
138.121.114.86:8000/play/a05w/index.m3u8
#EXTINF:-1,DeporTV
138.121.114.86:8000/play/a0d9/index.m3u8
#EXTINF:-1,Discovery Channel HD
138.121.114.86:8000/play/a08g/index.m3u8
#EXTINF:-1,Discovery H&H HD
138.121.114.86:8000/play/a08f/index.m3u8
#EXTINF:-1,Discovery Kids
138.121.114.86:8000/play/a07r/index.m3u8
#EXTINF:-1,Discovery Science
138.121.114.86:8000/play/a06p/index.m3u8
#EXTINF:-1,Discovery Theater HD
138.121.114.86:8000/play/a074/index.m3u8
#EXTINF:-1,Discovery Turbo
138.121.114.86:8000/play/a062/index.m3u8
#EXTINF:-1,Discovery World HD
138.121.114.86:8000/play/a076/index.m3u8
#EXTINF:-1,Disney Channel HD
138.121.114.86:8000/play/a06w/index.m3u8
#EXTINF:-1,Disney Junior
138.121.114.86:8000/play/a0cx/index.m3u8
#EXTINF:-1,Dispor
138.121.114.86:8000/play/a0cp/index.m3u8
#EXTINF:-1,E! Entertainment
138.121.114.86:8000/play/a08z/index.m3u8
#EXTINF:-1,ESPN 2 HD
138.121.114.86:8000/play/a098/index.m3u8
#EXTINF:-1,ESPN 3 HD
138.121.114.86:8000/play/a09a/index.m3u8
#EXTINF:-1,ESPN 4 HD
138.121.114.86:8000/play/a084/index.m3u8
#EXTINF:-1,ESPN HD
138.121.114.86:8000/play/a099/index.m3u8
#EXTINF:-1,ESPN Premium HD
138.121.114.86:8000/play/a086/index.m3u8
#EXTINF:-1,El Canal de las Estrellas
138.121.114.86:8000/play/a07x/index.m3u8
#EXTINF:-1,El Gourmet
138.121.114.86:8000/play/a07u/index.m3u8
#EXTINF:-1,Encuentro
138.121.114.86:8000/play/a05s/index.m3u8
#EXTINF:-1,Europa Europa
138.121.114.86:8000/play/a07t/index.m3u8
#EXTINF:-1,FX HD
138.121.114.86:8000/play/a070/index.m3u8
#EXTINF:-1,Film & Arts HD
138.121.114.86:8000/play/a075/index.m3u8
#EXTINF:-1,Fox Sports 2 HD
138.121.114.86:8000/play/a0cv/index.m3u8
#EXTINF:-1,Fox Sports 3 HD
138.121.114.86:8000/play/a06y/index.m3u8
#EXTINF:-1,Fox Sports HD
138.121.114.86:8000/play/a085/index.m3u8
#EXTINF:-1,Galicia TV
138.121.114.86:8000/play/a06v/index.m3u8
#EXTINF:-1,HBO
138.121.114.86:8000/play/a07m/index.m3u8
#EXTINF:-1,HBO 2
138.121.114.86:8000/play/a07o/index.m3u8
#EXTINF:-1,HBO Family
138.121.114.86:8000/play/a07p/index.m3u8
#EXTINF:-1,HBO Mundi
138.121.114.86:8000/play/a06f/index.m3u8
#EXTINF:-1,HBO Plus
138.121.114.86:8000/play/a07n/index.m3u8
#EXTINF:-1,HBO Signature
138.121.114.86:8000/play/a06h/index.m3u8
#EXTINF:-1,HBO Xtreme
138.121.114.86:8000/play/a06g/index.m3u8
#EXTINF:-1,HGTV
138.121.114.86:8000/play/a06o/index.m3u8
#EXTINF:-1,HTV
138.121.114.86:8000/play/a06t/index.m3u8
#EXTINF:-1,History 2
138.121.114.86:8000/play/a06n/index.m3u8
#EXTINF:-1,History Channel
138.121.114.86:8000/play/a090/index.m3u8
#EXTINF:-1,LAGUNA TV
138.121.114.86:8000/play/a0ch/index.m3u8
#EXTINF:-1,LAPACHO
138.121.114.86:8000/play/a0cs/index.m3u8
#EXTINF:-1,La Nacion TV
138.121.114.86:8000/play/a05y/index.m3u8
#EXTINF:-1,Lifetime
138.121.114.86:8000/play/a07l/index.m3u8
#EXTINF:-1,MTV
138.121.114.86:8000/play/a06r/index.m3u8
#EXTINF:-1,Metro
138.121.114.86:8000/play/a06l/index.m3u8
#EXTINF:-1,Nat Geo HD
138.121.114.86:8000/play/a09f/index.m3u8
#EXTINF:-1,Nick Jr
138.121.114.86:8000/play/a07s/index.m3u8
#EXTINF:-1,Nickelodeon
138.121.114.86:8000/play/a08y/index.m3u8
#EXTINF:-1,PASIONES
138.121.114.86:8000/play/a0d6/index.m3u8
#EXTINF:-1,Pakapaka
138.121.114.86:8000/play/a05t/index.m3u8
#EXTINF:-1,Paramount HD
138.121.114.86:8000/play/a073/index.m3u8
#EXTINF:-1,Playboy
138.121.114.86:8000/play/a077/index.m3u8
#EXTINF:-1,Quiero Musica
138.121.114.86:8000/play/a06s/index.m3u8
#EXTINF:-1,RAI Italia
138.121.114.86:8000/play/a06u/index.m3u8
#EXTINF:-1,RT en Espaæol
138.121.114.86:8000/play/a07d/index.m3u8
#EXTINF:-1,Rural
138.121.114.86:8000/play/a06k/index.m3u8
#EXTINF:-1,Sextreme
138.121.114.86:8000/play/a079/index.m3u8
#EXTINF:-1,Sony HD
138.121.114.86:8000/play/a09c/index.m3u8
#EXTINF:-1,Sony Movies HD
138.121.114.86:8000/play/a09j/index.m3u8
#EXTINF:-1,Space HD
138.121.114.86:8000/play/a071/index.m3u8
#EXTINF:-1,Star Channel HD
138.121.114.86:8000/play/a087/index.m3u8
#EXTINF:-1,Studio Universal
138.121.114.86:8000/play/a067/index.m3u8
#EXTINF:-1,TCM
138.121.114.86:8000/play/a065/index.m3u8
#EXTINF:-1,TELEFUTURO
138.121.114.86:8000/play/a0cf/index.m3u8
#EXTINF:-1,TLNovelas
138.121.114.86:8000/play/a07y/index.m3u8
#EXTINF:-1,TN HD
138.121.114.86:8000/play/a097/index.m3u8
#EXTINF:-1,TNT
138.121.114.86:8000/play/a0d4/index.m3u8
#EXTINF:-1,TNT Novelas HD
138.121.114.86:8000/play/a0d5/index.m3u8
#EXTINF:-1,TNT Series HD
138.121.114.86:8000/play/a0d7/index.m3u8
#EXTINF:-1,TNT Sports HD
138.121.114.86:8000/play/a06z/index.m3u8
#EXTINF:-1,TV Publica HD
138.121.114.86:8000/play/a095/index.m3u8
#EXTINF:-1,Telefe HD
138.121.114.86:8000/play/a08a/index.m3u8
#EXTINF:-1,The History Channel HD
138.121.114.86:8000/play/a09g/index.m3u8
#EXTINF:-1,TyC Sports HD
138.121.114.86:8000/play/a0d2/index.m3u8
#EXTINF:-1,UNICANAL
138.121.114.86:8000/play/a0ck/index.m3u8
#EXTINF:-1,USA Network
138.121.114.86:8000/play/a068/index.m3u8
#EXTINF:-1,Universal HD
138.121.114.86:8000/play/a09i/index.m3u8
#EXTINF:-1,Venus
138.121.114.86:8000/play/a078/index.m3u8
#EXTINF:-1,Volver
138.121.114.86:8000/play/a066/index.m3u8
#EXTINF:-1,Warner Channel HD
138.121.114.86:8000/play/a09d/index.m3u8
#EXTINF:-1,animal
138.121.114.86:8000/play/a0dd/index.m3u8
#EXTINF:-1,ciudad magazine
138.121.114.86:8000/play/a06m/index.m3u8
#EXTINF:-1,el nueve HD
138.121.114.86:8000/play/a08k/index.m3u8
#EXTINF:-1,el trece HD
138.121.114.86:8000/play/a07b/index.m3u8
#EXTINF:-1,snt
138.121.114.86:8000/play/a0cy/index.m3u8
`;

// Función para parsear la lista
function parsePlaylist(raw) {
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
    const channels = [];

    // Si la primera línea es una URL, la omitimos o la asignamos a un "Canal Sin Nombre"
    let currentChannel = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('#EXTINF')) {
            // Ejemplo: #EXTINF:-1,26TV
            const name = line.split(',')[1] || 'Sin Nombre';
            currentChannel = { name: cleanName(name) };
        } else if (line.match(/\d+\.\d+\.\d+\.\d+/)) {
            // Es una línea que parece tener una IP/URL
            let url = line;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'http://' + url;
            }

            if (currentChannel.name) {
                currentChannel.streamUrl = url;
                currentChannel.category = guessCategory(currentChannel.name);
                channels.push(currentChannel);
                currentChannel = {}; // Reset
            } else {
                // URL huérfana
                channels.push({
                    name: `Canal ${channels.length + 1}`,
                    streamUrl: url,
                    category: 'General'
                });
            }
        }
    }

    return channels;
}

function cleanName(name) {
    return name.replace('æ', 'ñ').replace('ð', 'ó').trim();
}

function guessCategory(name) {
    const n = name.toLowerCase();

    if (n.includes('espn') || n.includes('fox sports') || n.includes('tyc') || n.includes('deport') || n.includes('ddxt') || n.includes('sports')) return 'Deportes';
    if (n.includes('disney') || n.includes('cartoon') || n.includes('nick') || n.includes('kids') || n.includes('baby') || n.includes('pakapaka')) return 'Infantil';
    if (n.includes('hbo') || n.includes('cine') || n.includes('film') || n.includes('tnt') || n.includes('space') || n.includes('star channel') || n.includes('amc') || n.includes('axn') || n.includes('fx')) return 'Películas y Series';
    if (n.includes('discovery') || n.includes('history') || n.includes('geo') || n.includes('animal') || n.includes('tlc')) return 'Documentales';
    if (n.includes('noticias') || n.includes('tn') || n.includes('c5n') || n.includes('a24') || n.includes('cnn') || n.includes('cronica') || n.includes('nacion')) return 'Noticias';
    if (n.includes('mtv') || n.includes('htv') || n.includes('quiero')) return 'Música';
    if (n.includes('playboy') || n.includes('venus') || n.includes('sextreme')) return 'Adultos';

    return 'General';
}

async function testStream(url) {
    try {
        const response = await axios.head(url, {
            timeout: 5000,
            validateStatus: status => status < 400
        });
        return true;
    } catch {
        return false;
    }
}

async function run() {
    console.log('📋 Parseando lista de canales...\n');
    const channels = parsePlaylist(RAW_INPUT);
    console.log(`📊 Total de canales encontrados: ${channels.length}\n`);

    const workingChannels = [];

    for (const channel of channels) {
        process.stdout.write(`Probando: ${channel.name}... `);
        const works = await testStream(channel.streamUrl);

        if (works) {
            console.log('✅ Funciona');
            workingChannels.push(channel);
        } else {
            console.log('❌ No funciona');
        }
    }

    if (workingChannels.length > 0) {
        console.log(`\n✨ Resultados: ${workingChannels.length} canales funcionando.`);
        console.log('--------------------------------------------------');
        workingChannels.forEach(c => {
            console.log(`📺 ${c.name} (${c.category})`);
            console.log(`🔗 ${c.streamUrl}\n`);
        });
        console.log('--------------------------------------------------');
    } else {
        console.log('\n❌ Ningún canal de la lista parece funcionar.');
    }
}

run();
