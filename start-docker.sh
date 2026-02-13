#!/bin/bash

# Moon TV - Script de Inicio Rápido con Docker
# ============================================

echo "🌙 Moon TV - Inicio con Docker"
echo "================================"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado"
    echo "📥 Descárgalo desde: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Verificar si Docker Compose está disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible"
    exit 1
fi

echo "✅ Docker encontrado"
echo ""

# Función para mostrar el estado
function show_status() {
    echo ""
    echo "📊 Estado de los contenedores:"
    docker-compose ps
}

# Función para mostrar logs
function show_logs() {
    echo ""
    echo "📋 Logs (Ctrl+C para salir):"
    docker-compose logs -f
}

# Menú principal
echo "Selecciona una opción:"
echo ""
echo "1) 🚀 Iniciar Moon TV (primera vez)"
echo "2) ▶️  Iniciar Moon TV"
echo "3) ⏸️  Detener Moon TV"
echo "4) 📺 Importar canales"
echo "5) 📊 Ver estado"
echo "6) 📋 Ver logs"
echo "7) 🔄 Reiniciar servicios"
echo "8) 🗑️  Limpiar todo (PRECAUCIÓN)"
echo "9) ❌ Salir"
echo ""
read -p "Opción [1-9]: " option

case $option in
    1)
        echo ""
        echo "🚀 Iniciando Moon TV por primera vez..."
        echo ""
        
        # Crear archivo .env si no existe
        if [ ! -f "backend/.env" ]; then
            echo "📝 Creando archivo .env..."
            cp backend/.env.example backend/.env 2>/dev/null || echo "⚠️  Archivo .env.example no encontrado, usando configuración por defecto"
        fi
        
        # Construir e iniciar
        docker-compose up -d --build
        
        echo ""
        echo "⏳ Esperando que los servicios estén listos (30 segundos)..."
        sleep 30
        
        show_status
        
        echo ""
        echo "✅ Moon TV está corriendo!"
        echo ""
        echo "🌐 Aplicación: http://localhost:3000"
        echo "🔧 API: http://localhost:5000"
        echo ""
        read -p "¿Deseas importar canales ahora? (s/n): " import
        
        if [[ $import == "s" || $import == "S" ]]; then
            echo ""
            echo "📺 Para importar canales:"
            echo "1. Edita: backend/scripts/channels.m3u"
            echo "2. Ejecuta: docker-compose exec backend npm run seed"
            echo ""
            read -p "Presiona Enter para continuar..."
        fi
        ;;
        
    2)
        echo ""
        echo "▶️  Iniciando Moon TV..."
        docker-compose up -d
        
        sleep 5
        show_status
        
        echo ""
        echo "✅ Moon TV está corriendo!"
        echo "🌐 Aplicación: http://localhost:3000"
        ;;
        
    3)
        echo ""
        echo "⏸️  Deteniendo Moon TV..."
        docker-compose down
        echo "✅ Detenido"
        ;;
        
    4)
        echo ""
        echo "📺 Importando canales..."
        echo ""
        echo "⚠️  Asegúrate de haber editado: backend/scripts/channels.m3u"
        read -p "¿Continuar? (s/n): " confirm
        
        if [[ $confirm == "s" || $confirm == "S" ]]; then
            docker-compose exec backend npm run seed
        fi
        ;;
        
    5)
        show_status
        ;;
        
    6)
        show_logs
        ;;
        
    7)
        echo ""
        echo "🔄 Reiniciando servicios..."
        docker-compose restart
        echo "✅ Reiniciado"
        ;;
        
    8)
        echo ""
        echo "⚠️  PRECAUCIÓN: Esto eliminará TODOS los datos"
        read -p "¿Estás seguro? (escribe 'SI' para confirmar): " confirm
        
        if [ "$confirm" = "SI" ]; then
            echo "🗑️  Eliminando contenedores y volúmenes..."
            docker-compose down -v --rmi all
            echo "✅ Todo eliminado"
        else
            echo "❌ Cancelado"
        fi
        ;;
        
    9)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
        
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✨ ¡Listo!"
echo ""
