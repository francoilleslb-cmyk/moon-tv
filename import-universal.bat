@echo off
echo.
echo 🎬 Moon TV - Importador Universal
echo ==================================
echo.
echo Este script importa:
echo   📺 Canales de TV
echo   🎬 Peliculas con posters
echo   📺 Series con episodios organizados
echo.

REM Buscar archivo
if exist "tv_channels_brucasarez2_plus.m3u" (
    set "FILE=tv_channels_brucasarez2_plus.m3u"
) else if exist "channels.m3u" (
    set "FILE=channels.m3u"
) else (
    echo ❌ No se encontro archivo M3U
    echo.
    echo 📝 Coloca tu archivo aqui y renombralo a:
    echo    tv_channels_brucasarez2_plus.m3u
    echo.
    pause
    exit /b 1
)

echo ✅ Archivo encontrado: %FILE%
echo.

REM Verificar Docker
echo 🐳 Verificando Docker...
docker-compose ps | findstr "moontv-backend.*Up" >nul 2>&1

if errorlevel 1 (
    echo ⚠️  Iniciando Moon TV...
    docker-compose up -d
    timeout /t 15 /nobreak >nul
)

echo ✅ Docker corriendo
echo.

REM Copiar archivo
echo 📋 Copiando archivo al contenedor...
docker cp "%FILE%" moontv-backend:/app/scripts/channels.m3u

if errorlevel 1 (
    echo ❌ Error al copiar archivo
    pause
    exit /b 1
)

echo ✅ Archivo copiado
echo.

REM Importar
echo 🚀 Iniciando importacion universal...
echo    (Esto puede tomar 5-10 minutos para archivos grandes)
echo.

docker-compose exec backend node scripts/importUniversal.js

echo.
echo ═══════════════════════════════════════
echo.
echo ✅ Proceso completado!
echo.
echo 🌐 Abre tu navegador:
echo    📺 Canales: http://localhost:3000/channels
echo    🎬 Peliculas: http://localhost:3000/movies
echo    📺 Series: http://localhost:3000/series
echo.
pause
