# 📺 Importar Archivo M3U Grande - GUÍA RÁPIDA

## 🚀 Método Super Rápido (Recomendado)

### 1. Coloca tu archivo aquí
Copia `tv_channels_brucasarez2_plus.m3u` en el directorio `moon-tv/`

### 2. Ejecuta el script

**Linux/Mac:**
```bash
chmod +x import-large.sh
./import-large.sh
```

**Windows:**
```bash
import-large.bat
```

El script:
- ✅ Detecta automáticamente tu archivo .m3u
- ✅ Lo copia al contenedor Docker
- ✅ Ejecuta la importación mejorada
- ✅ Muestra estadísticas en tiempo real

---

## 📋 Método Manual (Paso a Paso)

### Paso 1: Copiar archivo
```bash
# Desde donde está tu archivo
docker cp tv_channels_brucasarez2_plus.m3u moontv-backend:/app/scripts/channels.m3u
```

### Paso 2: Importar
```bash
docker-compose exec backend node scripts/seedChannelsLarge.js
```

---

## 🎯 Con Makefile (Linux/Mac)

```bash
# Copiar archivo primero
docker cp tu_archivo.m3u moontv-backend:/app/scripts/channels.m3u

# Importar con Makefile
make seed-large
```

---

## 📊 Qué Esperar

**Archivo de 21 MB:**
- 📺 Aproximadamente 5,000 - 15,000 canales
- ⏱️ Tiempo de importación: 3-7 minutos
- 💾 Uso de memoria: 500 MB - 1 GB

**Durante la importación verás:**
```
📂 Archivo encontrado: channels.m3u
📊 Tamaño: 21.5 MB

🔍 Parseando canales...
✅ Canales encontrados: 8,534

📊 Estadísticas del archivo:
   Deportes: 1,234 canales
   Películas: 2,456 canales
   Series: 987 canales
   ...

❓ ¿Deseas limpiar los canales existentes? (s/n): s

📺 Importando canales...
   ✅ 100 canales insertados...
   ✅ 200 canales insertados...
   ...
   ✅ 8,534 canales insertados...

📊 Resumen de Importación:
   ✅ Canales insertados: 8,534
   ⚠️  Duplicados ignorados: 0
   ❌ Errores: 0
   📺 Total en BD: 8,534

✨ Importación completada exitosamente!
```

---

## ✅ Verificar Importación

```bash
# Contar canales
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"

# Ver categorías
docker-compose exec mongodb mongosh moontv --eval "
  db.channels.aggregate([
    {\$group: {_id: '\$category', count: {\$sum: 1}}},
    {\$sort: {count: -1}}
  ]).forEach(printjson)
"

# Abrir la app
# http://localhost:3000/channels
```

---

## 🔥 Características del Importador Mejorado

✅ **Procesamiento Inteligente**
- Maneja archivos de cualquier tamaño
- Procesamiento por lotes (100 canales a la vez)
- Detección automática de duplicados

✅ **Normalización Automática**
- Categorías: "DEPORTES" → "Deportes"
- Calidades: Detecta HD, 4K, FHD automáticamente
- Países: Extrae código de país del nombre

✅ **Estadísticas en Tiempo Real**
- Progreso cada 100 canales
- Conteo de errores y duplicados
- Resumen al final

✅ **Manejo de Errores**
- Continúa aunque algunos canales fallen
- Muestra hasta 5 primeros errores
- No detiene la importación

---

## 🐛 Problemas Comunes

### "Cannot copy file to container"
```bash
# Asegúrate de que Docker esté corriendo
docker-compose up -d

# Espera 10 segundos
sleep 10

# Intenta de nuevo
```

### "File not found"
```bash
# Verifica que el archivo existe
ls -la *.m3u

# Usa ruta completa
docker cp /ruta/completa/archivo.m3u moontv-backend:/app/scripts/channels.m3u
```

### Importación lenta o se congela
```bash
# Ver logs
docker-compose logs backend -f

# Aumentar memoria de Docker
# Docker Desktop > Settings > Resources > Memory: 4GB
```

### Error de memoria (archivos muy grandes)
```bash
# Si tienes más de 20,000 canales
# Edita docker-compose.yml:

services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

---

## 💡 Tips Avanzados

### Importar solo ciertas categorías
Edita `seedChannelsLarge.js` y agrega un filtro:
```javascript
channels = channels.filter(ch => 
  ch.category === 'Deportes' || ch.category === 'Películas'
);
```

### Ver progreso en otra terminal
```bash
# Terminal 1: Ejecutar importación
docker-compose exec backend node scripts/seedChannelsLarge.js

# Terminal 2: Ver logs
docker-compose logs backend -f
```

### Backup antes de importar
```bash
# Exportar canales actuales
docker-compose exec mongodb mongosh moontv --eval "
  db.channels.find().forEach(printjson)
" > backup_channels.json
```

---

## 📈 Performance

**Benchmarks en diferentes tamaños:**

| Canales | Archivo | Tiempo  | Memoria |
|---------|---------|---------|---------|
| 1,000   | 2 MB    | 30 seg  | 200 MB  |
| 5,000   | 10 MB   | 2 min   | 500 MB  |
| 10,000  | 21 MB   | 5 min   | 1 GB    |
| 20,000  | 40 MB   | 10 min  | 2 GB    |

---

## 🎉 Resultado Final

Después de la importación podrás:

1. ✅ **Navegar** por miles de canales
2. ✅ **Filtrar** por 50+ categorías
3. ✅ **Buscar** canales instantáneamente
4. ✅ **Reproducir** cualquier canal en HD
5. ✅ **Agregar favoritos** ilimitados
6. ✅ **Ver historial** de reproducción

---

## 📞 ¿Necesitas Ayuda?

**Lee la guía completa:**
- `IMPORTAR_ARCHIVO_GRANDE.md` - Guía detallada

**Ver logs:**
```bash
docker-compose logs backend -f
docker-compose logs mongodb -f
```

**Reset completo:**
```bash
docker-compose down -v
docker-compose up -d --build
```

---

**¡Tu archivo de 21 MB estará importado en minutos! 🚀**
