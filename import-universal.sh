#!/bin/bash

echo "🎬 Moon TV - Importador Universal"
echo "=================================="
echo ""
echo "Este script importa:"
echo "  📺 Canales de TV"
echo "  🎬 Películas con posters"
echo "  📺 Series con episodios organizados"
echo ""

# Buscar archivo
if [ -f "tv_channels_brucasarez2_plus.m3u" ]; then
    FILE="tv_channels_brucasarez2_plus.m3u"
elif [ -f "channels.m3u" ]; then
    FILE="channels.m3u"
else
    echo "❌ No se encontró archivo M3U"
    echo ""
    echo "📝 Coloca tu archivo aquí y renómbralo a:"
    echo "   tv_channels_brucasarez2_plus.m3u"
    echo ""
    exit 1
fi

echo "✅ Archivo encontrado: $FILE"
SIZE=$(du -h "$FILE" | cut -f1)
echo "📊 Tamaño: $SIZE"
echo ""

# Verificar Docker
echo "🐳 Verificando Docker..."
if ! docker-compose ps | grep -q "moontv-backend.*Up"; then
    echo "⚠️  Iniciando Moon TV..."
    docker-compose up -d
    sleep 15
fi

echo "✅ Docker corriendo"
echo ""

# Copiar archivo
echo "📋 Copiando archivo al contenedor..."
docker cp "$FILE" moontv-backend:/app/scripts/channels.m3u

if [ $? -ne 0 ]; then
    echo "❌ Error al copiar archivo"
    exit 1
fi

echo "✅ Archivo copiado"
echo ""

# Importar
echo "🚀 Iniciando importación universal..."
echo "   (Esto puede tomar 5-10 minutos para archivos grandes)"
echo ""

docker-compose exec backend node scripts/importUniversal.js

echo ""
echo "═══════════════════════════════════════"
echo ""
echo "✅ Proceso completado!"
echo ""
echo "🌐 Abre tu navegador:"
echo "   📺 Canales: http://localhost:3000/channels"
echo "   🎬 Películas: http://localhost:3000/movies"
echo "   📺 Series: http://localhost:3000/series"
echo ""
