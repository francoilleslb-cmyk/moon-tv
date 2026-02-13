# 🐳 Moon TV - Docker Quick Start

## ⚡ Inicio Super Rápido (1 comando)

```bash
# Descomprimir y entrar al directorio
tar -xzf moon-tv.tar.gz && cd moon-tv

# Iniciar todo con Docker
docker-compose up -d
```

**¡Listo!** Abre http://localhost:3000 en tu navegador 🎉

---

## 📋 Comandos Esenciales

### Linux/Mac
```bash
# Usar el script interactivo
./start-docker.sh

# O usar Makefile
make install      # Primera vez
make start        # Iniciar
make stop         # Detener
make logs         # Ver logs
make seed         # Importar canales
```

### Windows
```bash
# Doble clic en:
start-docker.bat

# O usar comandos directos
docker-compose up -d      # Iniciar
docker-compose down       # Detener
docker-compose logs -f    # Ver logs
```

---

## 📺 Importar Tus Canales

```bash
# 1. Edita el archivo con tus URLs
nano backend/scripts/channels.m3u

# 2. Importa
docker-compose exec backend npm run seed
```

---

## 🌐 URLs de Acceso

- **App Web**: http://localhost:3000
- **API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## 🛠️ Comandos Útiles

```bash
# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar todo
docker-compose restart

# Reconstruir
docker-compose up -d --build

# Limpiar todo (¡cuidado!)
docker-compose down -v
```

---

## ❓ Problemas Comunes

### Puerto ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # Cambiar 3000 por 8080
```

### Frontend no conecta
```bash
docker-compose restart frontend
```

### Cambios no se reflejan
```bash
docker-compose up -d --build
```

---

## 📖 Documentación Completa

- **Guía Docker completa**: `DOCKER_GUIA.md`
- **Instalación manual**: `README.md`
- **Inicio rápido**: `INICIO_RAPIDO.md`

---

## 🎯 Siguientes Pasos

1. ✅ Inicia la app: `docker-compose up -d`
2. ✅ Abre http://localhost:3000
3. ✅ Crea una cuenta
4. ✅ Importa tus canales: `make seed`
5. ✅ ¡Disfruta de Moon TV! 🌙

---

**¿Necesitas ayuda?** Lee `DOCKER_GUIA.md` para instrucciones detalladas.
