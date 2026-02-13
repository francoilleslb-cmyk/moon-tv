#!/bin/bash

echo "🌙 Moon TV - Reset y Re-importación de Canales"
echo "=============================================="
echo ""
echo "⚠️  Este script va a:"
echo "   1. Limpiar todos los canales existentes"
echo "   2. Importar 106 canales nuevos"
echo ""
read -p "¿Deseas continuar? (s/n): " confirm

if [[ $confirm != "s" && $confirm != "S" ]]; then
    echo "❌ Operación cancelada"
    exit 0
fi

echo ""
echo "🗑️  Paso 1: Limpiando base de datos..."
echo ""

# Limpiar la colección de canales en MongoDB
docker-compose exec mongodb mongosh moontv --eval "db.channels.deleteMany({})" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Base de datos limpiada"
else
    echo "❌ Error al limpiar la base de datos"
    echo "   Asegúrate de que MongoDB esté corriendo: docker-compose ps"
    exit 1
fi

echo ""
echo "📺 Paso 2: Importando canales..."
echo ""

# Ejecutar el script de importación
docker-compose exec backend npm run seed

echo ""
echo "✅ Proceso completado!"
echo ""
echo "🌐 Puedes verificar los canales en:"
echo "   http://localhost:3000/channels"
echo ""
