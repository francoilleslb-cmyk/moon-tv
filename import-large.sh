#!/bin/bash

echo "🌙 Moon TV - Importar Archivo M3U Grande"
echo "========================================"
echo ""

# Buscar archivos .m3u en el directorio actual
echo "🔍 Buscando archivos M3U..."
echo ""

m3u_files=(*.m3u)
if [ ${#m3u_files[@]} -eq 0 ] || [ ! -e "${m3u_files[0]}" ]; then
    echo "❌ No se encontraron archivos .m3u en el directorio actual"
    echo ""
    echo "📝 Instrucciones:"
    echo "   1. Coloca tu archivo .m3u en este directorio"
    echo "   2. Ejecuta este script nuevamente"
    echo ""
    exit 1
fi

# Mostrar archivos encontrados
echo "📂 Archivos M3U encontrados:"
echo ""
for i in "${!m3u_files[@]}"; do
    size=$(du -h "${m3u_files[$i]}" | cut -f1)
    echo "   [$i] ${m3u_files[$i]} ($size)"
done
echo ""

# Si solo hay un archivo, seleccionarlo automáticamente
if [ ${#m3u_files[@]} -eq 1 ]; then
    selected_file="${m3u_files[0]}"
    echo "✅ Archivo seleccionado: $selected_file"
else
    # Pedir al usuario que seleccione
    read -p "Selecciona el número del archivo [0-$((${#m3u_files[@]}-1))]: " selection
    
    if [ "$selection" -ge 0 ] && [ "$selection" -lt "${#m3u_files[@]}" ]; then
        selected_file="${m3u_files[$selection]}"
        echo "✅ Archivo seleccionado: $selected_file"
    else
        echo "❌ Selección inválida"
        exit 1
    fi
fi

echo ""

# Verificar que Docker esté corriendo
echo "🐳 Verificando Docker..."
if ! docker-compose ps | grep -q "moontv-backend"; then
    echo "⚠️  Moon TV no está corriendo. Iniciando..."
    docker-compose up -d
    echo "⏳ Esperando 10 segundos..."
    sleep 10
fi

echo "✅ Docker OK"
echo ""

# Copiar archivo al contenedor
echo "📋 Copiando archivo al contenedor..."
docker cp "$selected_file" moontv-backend:/app/scripts/channels.m3u

if [ $? -eq 0 ]; then
    echo "✅ Archivo copiado exitosamente"
else
    echo "❌ Error al copiar el archivo"
    exit 1
fi

echo ""

# Verificar tamaño del archivo en el contenedor
echo "📊 Información del archivo:"
docker-compose exec backend ls -lh scripts/channels.m3u | tail -1

echo ""
echo "🔄 Iniciando importación..."
echo "   (Esto puede tomar varios minutos dependiendo del tamaño)"
echo ""

# Ejecutar importación
docker-compose exec backend node scripts/seedChannelsLarge.js

echo ""
echo "═══════════════════════════════════════"
echo ""
echo "✅ Proceso completado!"
echo ""
echo "🌐 Abre tu navegador en: http://localhost:3000/channels"
echo ""
echo "📊 Ver estadísticas:"
echo "   docker-compose exec mongodb mongosh moontv --eval \"db.channels.count()\""
echo ""
