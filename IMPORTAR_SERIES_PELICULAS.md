# 🎬 Importar Archivo con Series y Películas

## 🎯 ¡Tu archivo es ESPECIAL!

Tu archivo `tv_channels_brucasarez2_plus.m3u` de 21 MB contiene:

✅ **Canales de TV en vivo** (.m3u8)
✅ **Películas completas** (.mkv, .mp4) con posters
✅ **Series organizadas** (S##E##) con imágenes
✅ **Imágenes de alta calidad** (posters de TMDB)

---

## 🚀 Importación Super Rápida

### Paso 1: Coloca tu archivo
```bash
# Copia tu archivo al directorio moon-tv/
cp tv_channels_brucasarez2_plus.m3u moon-tv/
cd moon-tv
```

### Paso 2: Ejecuta el script

**Linux/Mac:**
```bash
chmod +x import-universal.sh
./import-universal.sh
```

**Windows:**
```bash
import-universal.bat
```

### Paso 3: Selecciona qué importar

El script te preguntará:

```
❓ ¿Limpiar base de datos antes de importar? (s/n): s

❓ ¿Qué deseas importar?

   1) Todo (canales + series + películas)  👈 RECOMENDADO
   2) Solo canales
   3) Solo series
   4) Solo películas
   5) Series + películas

Selecciona [1-5]: 1
```

---

## 📊 Qué Esperar del Archivo de 21 MB

### Contenido Estimado:

- 📺 **500-1,500 Canales** de TV en vivo
- 🎬 **2,000-5,000 Películas** con posters
- 📺 **200-500 Series** con todos sus episodios
- 🖼️ **Miles de imágenes** de alta calidad

### Tiempo de Importación:

- ⏱️ **5-10 minutos** en total
- 📺 Canales: 1-2 minutos
- 🎬 Películas: 3-5 minutos
- 📺 Series: 2-3 minutos

---

## 🎨 Lo que Verás Durante la Importación

```
📂 Archivo: tv_channels_brucasarez2_plus.m3u
📊 Tamaño: 21.5 MB

🔍 Analizando contenido...
✅ Items encontrados: 8,534

📊 Clasificación:
   📺 Canales: 1,234
   🎬 Películas: 4,567
   📺 Episodios de Series: 2,733

❓ ¿Limpiar base de datos antes de importar? (s/n): s

🗑️  Limpiando base de datos...
   Canales eliminados: 106
   Series eliminadas: 0
   Películas eliminadas: 0

📺 Importando canales...
   ✅ 50 canales...
   ✅ 100 canales...
   ...
✅ Canales importados: 1,234

🎬 Importando películas...
   ✅ 50 películas...
   ✅ 100 películas...
   ...
✅ Películas importadas: 4,567

📺 Importando series...
   ✅ 10 series...
   ✅ 20 series...
   ...
✅ Series importadas: 187

═══════════════════════════════════════
📊 Resumen Final:
   📺 Canales: 1,234
   🎬 Películas: 4,567
   📺 Series: 187
   ❌ Errores: 0

✨ Importación completada!
```

---

## 🎯 Características del Importador Universal

### 🤖 Detección Inteligente

El script detecta automáticamente:

1. **Canales** - URLs con `.m3u8` o `/live/`
2. **Series** - Contenido con `S##E##` en el nombre
3. **Películas** - Archivos `.mkv`, `.mp4` sin patrón de serie

### 📁 Organización Automática

**Series:**
- ✅ Agrupa episodios por serie
- ✅ Organiza por temporadas
- ✅ Ordena episodios automáticamente
- ✅ Guarda posters individuales

**Películas:**
- ✅ Extrae año (2024)
- ✅ Guarda poster de alta calidad
- ✅ Categoriza por género
- ✅ Detecta calidad (HD, 4K)

**Canales:**
- ✅ Normaliza categorías
- ✅ Detecta país
- ✅ Identifica calidad

---

## 🖼️ Ejemplo de Contenido Importado

### Serie: "La Ley y el Orden"

```json
{
  "title": "La Ley y el Orden: Unidad de Víctimas Especiales",
  "poster": "https://image.tmdb.org/t/p/w600_and_h900_bestv2/...",
  "genres": ["Crimen"],
  "seasons": [
    {
      "number": 12,
      "episodes": [
        {
          "number": 6,
          "title": "Episodio 6",
          "streamUrl": "http://tv.zeuspro.xyz:8080/series/.../71608.mkv",
          "thumbnail": "https://image.tmdb.org/t/p/..."
        },
        {
          "number": 7,
          "title": "Episodio 7",
          "streamUrl": "http://tv.zeuspro.xyz:8080/series/.../71609.mkv",
          "thumbnail": "https://image.tmdb.org/t/p/..."
        }
      ]
    }
  ]
}
```

---

## 🌐 Acceder al Contenido

Después de importar, abre tu navegador:

### 📺 Canales
http://localhost:3000/channels

**Verás:**
- Grid de canales con logos
- Filtros por categoría
- Búsqueda en tiempo real
- Reproducción directa

### 🎬 Películas
http://localhost:3000/movies

**Verás:**
- Grid con posters de TMDB
- Filtros por género
- Información: año, rating
- Reproducción al hacer clic

### 📺 Series
http://localhost:3000/series

**Verás:**
- Grid con posters
- Temporadas y episodios
- Género y estado
- Navegación por temporada

---

## 📋 Categorías Detectadas

El importador reconoce estas categorías:

### Canales:
- Deportes, Noticias, Entretenimiento
- Infantil, Películas, Series
- Documentales, Música

### Series:
- SERIES-ACCION
- SERIES-CRIMEN
- SERIES-DRAMA
- SERIES-COMEDIA
- SERIES-TERROR
- Y más...

### Películas:
- PELICULAS-ACCION
- PELICULAS-COMEDIA
- PELICULAS-TERROR
- PELICULAS-DRAMA
- Y más...

---

## 🔍 Verificar Importación

### Ver estadísticas
```bash
# Canales
docker-compose exec mongodb mongosh moontv --eval "db.channels.count()"

# Películas
docker-compose exec mongodb mongosh moontv --eval "db.movies.count()"

# Series
docker-compose exec mongodb mongosh moontv --eval "db.series.count()"
```

### Ver una muestra
```bash
# Ver 5 películas
docker-compose exec mongodb mongosh moontv --eval "
  db.movies.find({}, {title: 1, year: 1, genres: 1}).limit(5).pretty()
"

# Ver series con episodios
docker-compose exec mongodb mongosh moontv --eval "
  db.series.find({}, {title: 1, 'seasons.number': 1}).limit(3).pretty()
"
```

---

## 💡 Tips y Trucos

### Importar Solo lo que Necesitas

Si solo quieres películas y series (sin canales):

```bash
# Durante la importación, selecciona opción 5
❓ ¿Qué deseas importar?
Selecciona [1-5]: 5
```

### Reimportar Sin Duplicados

El script ignora automáticamente duplicados por URL.

### Agregar Más Contenido Después

Simplemente ejecuta el script de nuevo con un nuevo archivo:
- Si seleccionas "No limpiar", se agregarán a los existentes
- Si seleccionas "Limpiar", se reemplazarán

---

## 🐛 Solución de Problemas

### Error: "Cannot detect content type"
✅ El archivo se importa igual, puede que algunos items vayan a categoría incorrecta

### Posters no se ven
✅ Normal, algunas URLs pueden estar caídas
✅ El sistema muestra un placeholder automáticamente

### Importación lenta
```bash
# Ver progreso
docker-compose logs backend -f
```

### Series con episodios desordenados
✅ El script ordena automáticamente por S##E##

---

## 📈 Rendimiento

**Archivo de 21 MB:**

| Tipo | Cantidad | Tiempo |
|------|----------|--------|
| Canales | ~1,200 | 2 min |
| Películas | ~4,500 | 5 min |
| Series | ~200 | 3 min |
| **Total** | **~6,000** | **~10 min** |

---

## 🎉 Resultado Final

Después de importar tendrás:

✅ **Netflix-style** con posters reales
✅ **Navegación por género** para encontrar fácil
✅ **Búsqueda instantánea** en todo el contenido
✅ **Series organizadas** por temporada y episodio
✅ **Reproducción directa** desde el navegador
✅ **Favoritos** y historial de visualización

---

## 🆘 ¿Problemas?

**Documentación:**
- `IMPORTAR_RAPIDO.md` - Guía rápida
- `IMPORTAR_ARCHIVO_GRANDE.md` - Guía detallada
- `DOCKER_GUIA.md` - Ayuda con Docker

**Comandos útiles:**
```bash
# Ver logs
docker-compose logs backend -f

# Reiniciar
docker-compose restart

# Reset completo
docker-compose down -v
docker-compose up -d
```

---

**¡Tu archivo de 21 MB con series y películas será una biblioteca completa! 🎬📺**
