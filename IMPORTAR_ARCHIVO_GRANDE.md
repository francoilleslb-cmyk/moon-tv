# 📺 Importar tu Archivo M3U Grande (21 MB)

## 🎯 Tres Formas de Hacerlo

---

## ✅ OPCIÓN 1: Script Interactivo (Recomendado)

### Paso 1: Copiar tu archivo al contenedor

**Si Docker está corriendo:**
```bash
# Copiar el archivo al contenedor
docker cp tv_channels_brucasarez2_plus.m3u moontv-backend:/app/scripts/channels.m3u

# Verificar que se copió
docker-compose exec backend ls -lh scripts/channels.m3u
```

### Paso 2: Ejecutar el script de importación mejorado
```bash
docker-compose exec backend node scripts/seedChannelsLarge.js
```

El script te preguntará:
- ¿Deseas limpiar los canales existentes? (s/n)
- Mostrará estadísticas en tiempo real
- Procesará por lotes para mejor rendimiento

---

## ✅ OPCIÓN 2: Sin Docker (Instalación Local)

### Paso 1: Copiar el archivo
```bash
# Copiar tu archivo M3U al directorio de scripts
cp tv_channels_brucasarez2_plus.m3u moon-tv/backend/scripts/channels.m3u
```

### Paso 2: Importar
```bash
cd moon-tv/backend
npm run seed
```

O usar el script mejorado:
```bash
node scripts/seedChannelsLarge.js
```

---

## ✅ OPCIÓN 3: Interfaz Web (Próximamente)

Estoy creando un uploader web para que puedas subir archivos desde el navegador.

---

## 📋 Guía Paso a Paso Detallada

### Para Docker (Paso a Paso):

```bash
# 1. Asegúrate de que Moon TV esté corriendo
docker-compose ps

# 2. Si no está corriendo, inícialo
docker-compose up -d

# 3. Navega a donde está tu archivo
cd /ruta/donde/esta/tu/archivo

# 4. Copia el archivo al contenedor
docker cp tv_channels_brucasarez2_plus.m3u moontv-backend:/app/scripts/channels.m3u

# 5. (Opcional) Verificar que se copió correctamente
docker-compose exec backend ls -lh scripts/

# 6. Ejecutar la importación
docker-compose exec backend node scripts/seedChannelsLarge.js

# 7. Responder "s" si quieres limpiar canales existentes

# 8. Esperar a que termine (puede tomar 2-5 minutos)

# 9. Verificar canales importados
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"
```

---

## 🚀 Script Rápido (Todo en Uno)

**Linux/Mac:**
```bash
#!/bin/bash

echo "📺 Importando archivo M3U grande..."
echo ""

# Verificar que el archivo existe
if [ ! -f "tv_channels_brucasarez2_plus.m3u" ]; then
    echo "❌ Error: No se encuentra el archivo tv_channels_brucasarez2_plus.m3u"
    echo "   Colócalo en el directorio actual y ejecuta de nuevo"
    exit 1
fi

# Copiar al contenedor
echo "📋 Copiando archivo al contenedor..."
docker cp tv_channels_brucasarez2_plus.m3u moontv-backend:/app/scripts/channels.m3u

# Importar
echo ""
echo "🔄 Importando canales..."
docker-compose exec backend node scripts/seedChannelsLarge.js

echo ""
echo "✅ ¡Completado!"
```

Guarda esto como `import-large.sh` y ejecútalo:
```bash
chmod +x import-large.sh
./import-large.sh
```

---

## 🔍 Verificar la Importación

### Ver cuántos canales se importaron:
```bash
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"
```

### Ver categorías:
```bash
docker-compose exec mongodb mongosh moontv --eval "
  db.channels.aggregate([
    {$group: {_id: '\$category', count: {$sum: 1}}},
    {$sort: {count: -1}}
  ]).forEach(printjson)
"
```

### Ver algunos canales:
```bash
docker-compose exec mongodb mongosh moontv --eval "
  db.channels.find({}, {name: 1, category: 1, quality: 1}).limit(10).pretty()
"
```

---

## ⚡ Características del Script Mejorado

✅ **Procesamiento por lotes** - Maneja archivos grandes sin problemas
✅ **Detección de duplicados** - No importa canales repetidos
✅ **Normalización de categorías** - Agrupa categorías similares
✅ **Estadísticas en tiempo real** - Ve el progreso mientras importa
✅ **Manejo de errores** - Continúa aunque algunos canales fallen
✅ **Soporte multi-idioma** - Detecta categorías en español e inglés

---

## 📊 Qué Esperar de un Archivo de 21 MB

Un archivo M3U de 21 MB típicamente contiene:
- 🎯 **5,000 - 15,000 canales**
- 🌍 **100+ categorías**
- 📺 **Canales de múltiples países**
- 🎬 **Múltiples calidades (SD, HD, 4K)**

**Tiempo estimado de importación:**
- Con Docker: 3-7 minutos
- Sin Docker: 2-5 minutos

---

## 🐛 Solución de Problemas

### Error: "Cannot copy file"
```bash
# Verificar que Docker esté corriendo
docker-compose ps

# Verificar el nombre del contenedor
docker ps | grep backend

# Si el nombre es diferente, usa:
docker cp archivo.m3u [nombre-del-contenedor]:/app/scripts/channels.m3u
```

### Error: "File not found"
```bash
# Verificar la ruta completa de tu archivo
ls -la tv_channels_brucasarez2_plus.m3u

# Usar ruta completa
docker cp /ruta/completa/tv_channels_brucasarez2_plus.m3u moontv-backend:/app/scripts/channels.m3u
```

### Importación muy lenta
```bash
# Monitorear uso de recursos
docker stats

# Si es necesario, aumentar memoria de Docker
# Docker Desktop > Settings > Resources > Memory
```

### Memoria insuficiente
Si tienes más de 10,000 canales y aparece error de memoria:

```bash
# Editar docker-compose.yml y agregar límites
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

---

## 📝 Notas Importantes

1. **Backup**: El script pregunta si quieres limpiar los canales existentes
2. **Categorías**: Se normalizarán automáticamente (DEPORTES → Deportes)
3. **Duplicados**: URLs duplicadas se ignoran automáticamente
4. **Errores**: Algunos canales pueden fallar, el script continúa con el resto
5. **Performance**: El procesamiento por lotes optimiza la velocidad

---

## 🎉 Después de Importar

Una vez completada la importación:

1. **Recarga el frontend:**
   ```bash
   docker-compose restart frontend
   ```

2. **Abre la app:**
   - http://localhost:3000/channels

3. **Filtra por categoría:**
   - Usa los filtros para navegar entre miles de canales

4. **Busca canales:**
   - La búsqueda funciona con miles de resultados

---

## 💡 Tips para Archivos Muy Grandes

Si tienes más de 20,000 canales:

1. **Importa por categorías** (modificar el script para filtrar)
2. **Aumenta memoria de MongoDB**
3. **Considera usar MongoDB Atlas** (cloud)
4. **Activa índices adicionales** para búsqueda más rápida

---

## 🆘 ¿Necesitas Ayuda?

Si algo no funciona:

1. **Ver logs durante importación:**
   ```bash
   docker-compose logs backend -f
   ```

2. **Verificar MongoDB:**
   ```bash
   docker-compose logs mongodb -f
   ```

3. **Reset completo:**
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

---

**¡Listo para importar tu archivo de 21 MB! 🚀**
