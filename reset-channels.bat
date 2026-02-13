@echo off
echo.
echo 🌙 Moon TV - Reset y Re-importacion de Canales
echo ==============================================
echo.
echo ⚠️  Este script va a:
echo    1. Limpiar todos los canales existentes
echo    2. Importar 106 canales nuevos
echo.
set /p confirm="Deseas continuar? (s/n): "

if /i not "%confirm%"=="s" (
    echo ❌ Operacion cancelada
    exit /b 0
)

echo.
echo 🗑️  Paso 1: Limpiando base de datos...
echo.

REM Limpiar la coleccion de canales en MongoDB
docker-compose exec mongodb mongosh moontv --eval "db.channels.deleteMany({})" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Base de datos limpiada
) else (
    echo ❌ Error al limpiar la base de datos
    echo    Asegurate de que MongoDB este corriendo: docker-compose ps
    exit /b 1
)

echo.
echo 📺 Paso 2: Importando canales...
echo.

REM Ejecutar el script de importacion
docker-compose exec backend npm run seed

echo.
echo ✅ Proceso completado!
echo.
echo 🌐 Puedes verificar los canales en:
echo    http://localhost:3000/channels
echo.
pause
