# 📺 Instrucciones para Importar Canales

## Paso 1: Preparar el archivo M3U

1. Ve a `backend/scripts/channels.m3u`
2. Reemplaza el contenido con las URLs de tus canales
3. Usa el formato M3U estándar:

```m3u
#EXTM3U

#EXTINF:-1 group-title="Categoría", Nombre del Canal
https://url-del-stream.m3u8

#EXTINF:-1 group-title="Deportes", ESPN
https://espn-stream.com/live.m3u8
```

## Paso 2: Ejecutar el script de importación

```bash
cd backend
npm run seed
```

Si quieres limpiar los canales existentes antes de importar:
```bash
npm run seed -- --clear
```

## Paso 3: Verificar

El script mostrará:
- Número de canales importados
- Errores (si los hay)
- Estadísticas por categoría

## Formato del archivo M3U

Las URLs que proporcionaste ya están en el formato correcto.
El script parseará automáticamente:

- **Nombre del canal**: después de la última coma en EXTINF
- **Categoría**: group-title="..."
- **País**: prefijo del nombre (MX:, US:, etc.)
- **Calidad**: si contiene "HD" o "4K"
- **Tags**: [NOT 24/7], [SOLO EN PARTIDO], etc.

## Ejemplo de uso

```bash
# 1. Editar el archivo
nano backend/scripts/channels.m3u

# 2. Pegar tus URLs
# (el contenido M3U que proporcionaste)

# 3. Importar
npm run seed

# Resultado esperado:
# ✅ Canales insertados: 500+
# 📊 Bics: 50
# 📊 Bics DEPORTES: 100
# etc...
```

## Solución de Problemas

**Error: archivo no encontrado**
- Verifica que el archivo `channels.m3u` existe en `backend/scripts/`

**URLs no funcionan**
- Algunas URLs pueden requerir VPN
- Verifica que las URLs son accesibles
- Algunas pueden ser temporales

**Duplicados**
- El script automáticamente ignora URLs duplicadas
