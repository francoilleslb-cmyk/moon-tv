# 🐳 Moon TV - Guía Docker

## 📋 Requisitos

- Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop/))
- Docker Compose (incluido en Docker Desktop)

**Verificar instalación:**
```bash
docker --version
docker-compose --version
```

## 🚀 Inicio Rápido (3 pasos)

### 1. Descomprimir el proyecto
```bash
tar -xzf moon-tv.tar.gz
cd moon-tv
```

### 2. Iniciar con Docker Compose
```bash
docker-compose up -d
```

**Esto iniciará automáticamente:**
- ✅ MongoDB (base de datos)
- ✅ Backend (API en puerto 5000)
- ✅ Frontend (App en puerto 3000)

### 3. Importar canales (opcional)
```bash
# Editar el archivo con tus URLs
nano backend/scripts/channels.m3u

# Importar canales
docker-compose exec backend npm run seed
```

## 🌐 Acceder a la aplicación

Una vez que los contenedores estén corriendo:

- **Aplicación Web**: http://localhost:3000
- **API Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

## 📊 Comandos Útiles

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Estado de los contenedores
```bash
docker-compose ps
```

### Detener la aplicación
```bash
docker-compose down
```

### Detener y eliminar datos (CUIDADO - borra la BD)
```bash
docker-compose down -v
```

### Reiniciar servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo el backend
docker-compose restart backend
```

### Reconstruir las imágenes
```bash
# Reconstruir y reiniciar
docker-compose up -d --build

# Reconstruir solo el backend
docker-compose up -d --build backend
```

### Ejecutar comandos dentro de los contenedores
```bash
# Entrar al backend
docker-compose exec backend sh

# Entrar a MongoDB
docker-compose exec mongodb mongosh moontv

# Importar canales
docker-compose exec backend npm run seed
```

## 🔧 Solución de Problemas

### Error: "port is already allocated"
```bash
# Ver qué está usando el puerto
# Linux/Mac
sudo lsof -i :3000
sudo lsof -i :5000

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Cambiar puertos en docker-compose.yml
```

### Frontend no se conecta al backend
```bash
# Verificar que el backend esté corriendo
docker-compose logs backend

# Reiniciar frontend
docker-compose restart frontend
```

### MongoDB no inicia
```bash
# Ver logs
docker-compose logs mongodb

# Eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d
```

### Cambios en el código no se reflejan
```bash
# Reconstruir las imágenes
docker-compose up -d --build
```

### Limpiar todo y empezar de nuevo
```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Iniciar de nuevo
docker-compose up -d --build
```

## 📦 Producción

Para producción, usar este comando:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Flujo de Trabajo Recomendado

1. **Primera vez:**
   ```bash
   docker-compose up -d
   docker-compose exec backend npm run seed
   ```

2. **Desarrollo diario:**
   ```bash
   # Iniciar
   docker-compose up -d
   
   # Ver logs
   docker-compose logs -f
   
   # Detener al terminar
   docker-compose down
   ```

3. **Agregar más canales:**
   ```bash
   # Editar archivo
   nano backend/scripts/channels.m3u
   
   # Importar
   docker-compose exec backend npm run seed
   ```

## 📊 Monitoreo

Ver recursos utilizados:
```bash
docker stats
```

Ver espacio usado:
```bash
docker system df
```

## 🔒 Seguridad

Para producción, cambiar:
- `JWT_SECRET` en `backend/.env`
- Configurar firewall para MongoDB
- Usar HTTPS
- Configurar variables de entorno seguras

## ✅ Verificación

Después de iniciar, verifica:

```bash
# ¿Están corriendo los contenedores?
docker-compose ps

# ¿Backend responde?
curl http://localhost:5000

# ¿Frontend accesible?
curl http://localhost:3000

# ¿MongoDB está listo?
docker-compose exec mongodb mongosh moontv --eval "db.stats()"
```

## 🎉 ¡Todo listo!

Ahora puedes:
1. Abrir http://localhost:3000
2. Crear una cuenta
3. Ver canales en vivo
4. Agregar favoritos

---

**¿Problemas?** Revisa los logs con `docker-compose logs -f`
