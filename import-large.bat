@echo off
setlocal enabledelayedexpansion

echo.
echo 🌙 Moon TV - Importar Archivo M3U Grande
echo ========================================
echo.

REM Buscar archivos .m3u
echo 🔍 Buscando archivos M3U...
echo.

set count=0
for %%f in (*.m3u) do (
    set /a count+=1
    set "file!count!=%%f"
    echo    [!count!] %%f
)

if %count%==0 (
    echo ❌ No se encontraron archivos .m3u en el directorio actual
    echo.
    echo 📝 Instrucciones:
    echo    1. Coloca tu archivo .m3u en este directorio
    echo    2. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo.

REM Si solo hay un archivo, seleccionarlo automáticamente
if %count%==1 (
    set "selected_file=!file1!"
    echo ✅ Archivo seleccionado: !selected_file!
) else (
    set /p selection="Selecciona el numero del archivo [1-%count%]: "
    set "selected_file=!file%selection%!"
    echo ✅ Archivo seleccionado: !selected_file!
)

echo.

REM Verificar que Docker esté corriendo
echo 🐳 Verificando Docker...
docker-compose ps | findstr "moontv-backend" >nul 2>&1

if errorlevel 1 (
    echo ⚠️  Moon TV no esta corriendo. Iniciando...
    docker-compose up -d
    echo ⏳ Esperando 10 segundos...
    timeout /t 10 /nobreak >nul
)

echo ✅ Docker OK
echo.

REM Copiar archivo al contenedor
echo 📋 Copiando archivo al contenedor...
docker cp "!selected_file!" moontv-backend:/app/scripts/channels.m3u

if errorlevel 0 (
    echo ✅ Archivo copiado exitosamente
) else (
    echo ❌ Error al copiar el archivo
    pause
    exit /b 1
)

echo.

REM Verificar tamaño del archivo en el contenedor
echo 📊 Informacion del archivo:
docker-compose exec backend ls -lh scripts/channels.m3u

echo.
echo 🔄 Iniciando importacion...
echo    (Esto puede tomar varios minutos dependiendo del tamano)
echo.

REM Ejecutar importación
docker-compose exec backend node scripts/seedChannelsLarge.js

echo.
echo ═══════════════════════════════════════
echo.
echo ✅ Proceso completado!
echo.
echo 🌐 Abre tu navegador en: http://localhost:3000/channels
echo.
echo 📊 Ver estadisticas:
echo    docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"
echo.
pause
