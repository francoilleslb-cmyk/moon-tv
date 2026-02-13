# 🔧 Solución de Problemas - Moon TV

## 🚨 Problema: 0 Canales Después de Importar

Si después de intentar importar canales ves que tienes 0 canales, sigue estos pasos:

---

## ✅ Solución Rápida (Recomendada)

### Opción 1: Script Automático

**Linux/Mac:**
```bash
chmod +x reset-channels.sh
./reset-channels.sh
```

**Windows:**
```bash
reset-channels.bat
```

Esto automáticamente:
1. ✅ Limpia la base de datos
2. ✅ Importa los 106 canales correctos

---

### Opción 2: Comandos Manuales

#### Paso 1: Verificar que Docker esté corriendo
```bash
docker-compose ps
```

**Deberías ver:**
```
moontv-backend     Up
moontv-frontend    Up
moontv-mongodb     Up
```

Si no están corriendo:
```bash
docker-compose up -d
```

---

#### Paso 2: Limpiar la base de datos
```bash
docker-compose exec mongodb mongosh moontv --eval "db.channels.deleteMany({})"
```

**Respuesta esperada:**
```json
{ acknowledged: true, deletedCount: X }
```

---

#### Paso 3: Verificar el archivo channels.m3u

El archivo ya está actualizado en: `backend/scripts/channels.m3u`

**Verificar contenido:**
```bash
# Linux/Mac
head -n 10 backend/scripts/channels.m3u

# Windows
type backend\scripts\channels.m3u | more
```

**Debe verse así:**
```
#EXTM3U
#EXTINF:-1 group-title="Entretenimiento", AE Mundo
http://181.128.145.103:4000/play/a01g/index.m3u8
```

⚠️ **IMPORTANTE:** Las URLs DEBEN empezar con `http://`

---

#### Paso 4: Importar canales
```bash
docker-compose exec backend npm run seed
```

**O usando Makefile (Linux/Mac):**
```bash
make seed
```

---

## 📊 Verificar Importación Exitosa

### Método 1: Ver logs del script
Durante la importación deberías ver:
```
🚀 Iniciando importación de canales...
📺 Canales encontrados: 106
✅ 50 canales insertados...
✅ 100 canales insertados...

📊 Resumen:
   ✅ Canales insertados: 106
   ❌ Errores: 0
   📺 Total en BD: 106
```

---

### Método 2: Consultar MongoDB directamente
```bash
# Contar canales
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"

# Ver primeros 5 canales
docker-compose exec mongodb mongosh moontv --eval "db.channels.find().limit(5).pretty()"

# Ver canales por categoría
docker-compose exec mongodb mongosh moontv --eval "db.channels.aggregate([{$group: {_id: '$category', count: {$sum: 1}}}])"
```

---

### Método 3: Verificar en la app
1. Abre http://localhost:3000/channels
2. Deberías ver 106 canales
3. Deberías ver categorías como:
   - Deportes (XX canales)
   - Películas (XX canales)
   - General (XX canales)
   - etc.

---

## ❌ Errores Comunes

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB esté corriendo
docker-compose ps mongodb

# Reiniciar MongoDB
docker-compose restart mongodb

# Ver logs de MongoDB
docker-compose logs mongodb
```

---

### Error: "channels.m3u not found"
```bash
# Verificar que el archivo existe
ls -la backend/scripts/channels.m3u

# Si no existe, descarga el proyecto nuevamente
```

---

### Error: "URLs inválidas"
Las URLs DEBEN tener el protocolo `http://` al inicio.

❌ **Incorrecto:**
```
181.128.145.103:4000/play/a01g/index.m3u8
```

✅ **Correcto:**
```
http://181.128.145.103:4000/play/a01g/index.m3u8
```

El archivo ya está corregido en la última versión.

---

### Error: Canales importados pero no aparecen en el frontend
```bash
# Limpiar cache del navegador
# O abrir en modo incógnito

# Reiniciar frontend
docker-compose restart frontend

# Verificar logs del backend
docker-compose logs backend
```

---

## 🔄 Resetear Todo (Última Opción)

Si nada funciona, resetea completamente:

```bash
# Detener todo
docker-compose down -v

# Reconstruir e iniciar
docker-compose up -d --build

# Esperar 30 segundos
sleep 30

# Importar canales
docker-compose exec backend npm run seed
```

---

## 📞 Verificación Final

Ejecuta estos comandos para verificar que todo está OK:

```bash
# 1. Servicios corriendo
docker-compose ps

# 2. Canales en BD
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"

# 3. Backend respondiendo
curl http://localhost:5000/api/channels | grep -o "\"count\":[0-9]*"

# 4. Frontend accesible
curl -I http://localhost:3000
```

**Resultado esperado:**
```
✅ 3 servicios UP
✅ 106 canales en BD
✅ Backend: "count":106
✅ Frontend: HTTP 200 OK
```

---

## 📋 Checklist de Solución

- [ ] Docker está instalado y corriendo
- [ ] `docker-compose ps` muestra 3 servicios UP
- [ ] Archivo `channels.m3u` existe y tiene URLs con `http://`
- [ ] Base de datos limpiada con `deleteMany()`
- [ ] Script de importación ejecutado sin errores
- [ ] Contador de canales en MongoDB = 106
- [ ] Canales visibles en http://localhost:3000/channels

---

## 🆘 ¿Aún no funciona?

1. **Revisa los logs:**
   ```bash
   docker-compose logs backend | tail -50
   docker-compose logs mongodb | tail -50
   ```

2. **Reinicia todo:**
   ```bash
   docker-compose restart
   ```

3. **Limpia y empieza de nuevo:**
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ./reset-channels.sh  # o reset-channels.bat en Windows
   ```

---

## 📝 Notas Importantes

- ✅ El archivo `channels.m3u` ya está actualizado con las 106 URLs correctas
- ✅ Todas las URLs tienen el protocolo `http://` correcto
- ✅ Los canales están categorizados (Deportes, Películas, General, etc.)
- ✅ El script de importación maneja duplicados automáticamente

**Si sigues estos pasos, deberías tener 106 canales funcionando perfectamente.** 🌙📺
