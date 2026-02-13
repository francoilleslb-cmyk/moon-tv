@echo off
REM Moon TV - Script de Inicio Rapido con Docker (Windows)
REM ========================================================

echo.
echo 🌙 Moon TV - Inicio con Docker
echo ================================
echo.

REM Verificar si Docker esta instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker no esta instalado
    echo 📥 Descargalo desde: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker encontrado
echo.

:menu
echo Selecciona una opcion:
echo.
echo 1) 🚀 Iniciar Moon TV (primera vez)
echo 2) ▶️  Iniciar Moon TV
echo 3) ⏸️  Detener Moon TV
echo 4) 📺 Importar canales
echo 5) 📊 Ver estado
echo 6) 📋 Ver logs
echo 7) 🔄 Reiniciar servicios
echo 8) 🗑️  Limpiar todo (PRECAUCION)
echo 9) ❌ Salir
echo.

set /p option="Opcion [1-9]: "

if "%option%"=="1" goto first_start
if "%option%"=="2" goto start
if "%option%"=="3" goto stop
if "%option%"=="4" goto import
if "%option%"=="5" goto status
if "%option%"=="6" goto logs
if "%option%"=="7" goto restart
if "%option%"=="8" goto clean
if "%option%"=="9" goto exit

echo ❌ Opcion invalida
pause
goto menu

:first_start
echo.
echo 🚀 Iniciando Moon TV por primera vez...
echo.

REM Crear archivo .env si no existe
if not exist "backend\.env" (
    echo 📝 Creando archivo .env...
    copy backend\.env.example backend\.env >nul 2>&1
)

docker-compose up -d --build

echo.
echo ⏳ Esperando que los servicios esten listos...
timeout /t 30 /nobreak >nul

docker-compose ps

echo.
echo ✅ Moon TV esta corriendo!
echo.
echo 🌐 Aplicacion: http://localhost:3000
echo 🔧 API: http://localhost:5000
echo.
pause
goto menu

:start
echo.
echo ▶️  Iniciando Moon TV...
docker-compose up -d

timeout /t 5 /nobreak >nul
docker-compose ps

echo.
echo ✅ Moon TV esta corriendo!
echo 🌐 Aplicacion: http://localhost:3000
pause
goto menu

:stop
echo.
echo ⏸️  Deteniendo Moon TV...
docker-compose down
echo ✅ Detenido
pause
goto menu

:import
echo.
echo 📺 Importando canales...
echo.
echo ⚠️  Asegurate de haber editado: backend\scripts\channels.m3u
pause

docker-compose exec backend npm run seed
pause
goto menu

:status
echo.
echo 📊 Estado de los contenedores:
docker-compose ps
pause
goto menu

:logs
echo.
echo 📋 Logs (Ctrl+C para salir):
docker-compose logs -f
goto menu

:restart
echo.
echo 🔄 Reiniciando servicios...
docker-compose restart
echo ✅ Reiniciado
pause
goto menu

:clean
echo.
echo ⚠️  PRECAUCION: Esto eliminara TODOS los datos
set /p confirm="Estas seguro? (escribe SI para confirmar): "

if "%confirm%"=="SI" (
    echo 🗑️  Eliminando contenedores y volumenes...
    docker-compose down -v --rmi all
    echo ✅ Todo eliminado
) else (
    echo ❌ Cancelado
)
pause
goto menu

:exit
echo 👋 Hasta luego!
exit /b 0
