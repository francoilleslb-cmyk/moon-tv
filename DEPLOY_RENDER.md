# 🚀 Desplegar Moon TV en Render (GRATIS)

## 🎯 Por qué Render es la MEJOR opción gratis

✅ **512 MB RAM** por servicio (Fly.io solo 256 MB)
✅ **Deploy automático** desde Git
✅ **SSL gratis** automático
✅ **Más fácil** que Fly.io
✅ **MongoDB Atlas gratis** (512 MB)
✅ **No requiere tarjeta** de crédito para empezar

**Perfecto para Moon TV con series, películas y canales.**

---

## 📋 Lo que necesitas (TODO GRATIS)

1. Cuenta en [Render.com](https://render.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. Cuenta en [GitHub](https://github.com)

**Tiempo total:** 30 minutos

---

## 🗄️ PASO 1: MongoDB Atlas (Base de Datos)

### 1.1 Crear cuenta y cluster

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Registrate (email, Google o GitHub)
3. Click **"Build a Database"**
4. Selecciona **M0 FREE** (el verde)
5. Provider: **AWS**
6. Region: **N. Virginia (us-east-1)** o la más cercana
7. Cluster Name: `moontv`
8. Click **"Create"**

### 1.2 Crear usuario

1. En "Security Quickstart"
2. Username: `moontvadmin`
3. **Autogenerate Secure Password** → COPIA LA CONTRASEÑA
4. Click **"Create User"**

### 1.3 Permitir acceso

1. En "Where would you like to connect from?"
2. **Add My Current IP Address**
3. También click **"Add a Different IP Address"**
4. IP: `0.0.0.0/0`
5. Description: `Allow from anywhere`
6. Click **"Finish and Close"**

### 1.4 Obtener Connection String

1. Click **"Connect"** en tu cluster
2. **"Drivers"**
3. Copia el string (se ve así):

```
mongodb+srv://moontvadmin:<password>@moontv.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

4. **Reemplaza `<password>`** con tu contraseña
5. **Agrega el nombre de la BD** al final: `/moontv`

**String final:**
```
mongodb+srv://moontvadmin:TU_PASSWORD@moontv.xxxxx.mongodb.net/moontv?retryWrites=true&w=majority
```

✅ **GUARDA ESTE STRING** - lo usarás en 5 minutos

---

## 📤 PASO 2: Subir a GitHub

### 2.1 Crear repositorio

1. Ve a https://github.com/new
2. Repository name: `moon-tv`
3. Public o Private (tu eliges)
4. **NO marques** README, .gitignore, ni license
5. Click **"Create repository"**

### 2.2 Subir el código

```bash
# En tu computadora, descomprimir
tar -xzf moon-tv-universal.tar.gz
cd moon-tv

# Inicializar Git
git init
git add .
git commit -m "Moon TV - Initial deployment"

# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/moon-tv.git
git branch -M main
git push -u origin main
```

✅ **Código subido** - ahora vamos a Render

---

## 🔧 PASO 3: Backend en Render

### 3.1 Crear Web Service

1. Ve a https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. **"Connect GitHub"** y autoriza
4. Selecciona el repo `moon-tv`
5. Click **"Connect"**

### 3.2 Configurar

**Settings:**
```
Name: moon-tv-backend
Environment: Node
Region: Oregon (US West) o la más cercana
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**Instance Type:** Free

### 3.3 Variables de Entorno

Click **"Advanced"** → **"Add Environment Variable"**

Agrega estas 5 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | *(pega tu string de MongoDB aquí)* |
| `JWT_SECRET` | `moon_tv_secret_render_2024_change_this` |
| `CORS_ORIGIN` | `*` *(cambiaremos esto después)* |

### 3.4 Desplegar

1. Click **"Create Web Service"**
2. ⏳ Espera 3-5 minutos...
3. Verás logs en pantalla

**Cuando termine:**
```
✅ Live: https://moon-tv-backend.onrender.com
```

✅ **COPIA ESTA URL** - la necesitas para el frontend

---

## 🎨 PASO 4: Frontend en Render

### 4.1 Crear otro Web Service

1. Dashboard → **"New +"** → **"Web Service"**
2. Selecciona `moon-tv` de nuevo
3. Click **"Connect"**

### 4.2 Configurar

**Settings:**
```
Name: moon-tv-frontend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npm run preview -- --host 0.0.0.0 --port $PORT
```

**Instance Type:** Free

### 4.3 Variable de Entorno

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://moon-tv-backend.onrender.com` |

⚠️ **Usa TU URL del backend** (del paso anterior)

### 4.4 Desplegar

1. Click **"Create Web Service"**
2. ⏳ Espera 3-5 minutos...

**Cuando termine:**
```
✅ Live: https://moon-tv-frontend.onrender.com
```

---

## 🔗 PASO 5: Conectar Frontend y Backend

### 5.1 Actualizar CORS

1. Dashboard → `moon-tv-backend`
2. **"Environment"** (menú izquierdo)
3. Edita `CORS_ORIGIN`:
   ```
   https://moon-tv-frontend.onrender.com
   ```
4. **"Save Changes"**

El backend se redesplegará (2 min).

### 5.2 Probar conexión

Abre en tu navegador:
```
https://moon-tv-frontend.onrender.com
```

Deberías ver **Moon TV** cargando.

---

## 📺 PASO 6: Importar Contenido

### Método 1: Render Shell (Fácil)

1. Dashboard → `moon-tv-backend`
2. Click **"Shell"** (arriba derecha)
3. Se abre una terminal en el servidor

**Para importar tu archivo M3U:**

```bash
# Crear archivo temporal con tu contenido
cat > /tmp/channels.m3u << 'ENDFILE'
#EXTM3U
#EXTINF:-1 tvg-name="La Ley y el Orden S12 E06" tvg-logo="https://image.tmdb.org/t/p/w600_and_h900_bestv2/ruSz0Pk6Y09Jmn2o3QJlQXLqbLD.jpg" group-title="SERIES-CRIMEN",La Ley y el Orden S12 E06
http://tv.zeuspro.xyz:8080/series/brucasarez2/UEzQwpa6pV/71608.mkv

... PEGA AQUÍ TODO TU ARCHIVO M3U ...

ENDFILE

# Copiar a scripts
cp /tmp/channels.m3u scripts/channels.m3u

# Importar
node scripts/importUniversal.js
```

### Método 2: MongoDB Compass

1. Descarga [Compass](https://www.mongodb.com/try/download/compass)
2. Conecta con tu string de MongoDB
3. Importa archivos JSON directamente

---

## 🎉 ¡LISTO! Usar Moon TV

Abre:
```
https://moon-tv-frontend.onrender.com
```

**URLs importantes:**
- 🏠 Home: `/`
- 📺 Canales: `/channels`
- 🎬 Películas: `/movies`
- 📺 Series: `/series`
- 🔐 Login: `/login`

---

## ⚡ Optimización: Evitar Sleep

Los servicios gratuitos se **duermen después de 15 minutos** sin uso.

### Solución: Cron Job Gratis

1. Ve a https://cron-job.org/en/
2. Registrate gratis
3. **"Create cronjob"**
4. **URL:** `https://moon-tv-backend.onrender.com`
5. **Schedule:** Every 10 minutes
6. **"Create"**

✅ Ahora se hará ping cada 10 min y nunca dormirá

---

## 🔍 Verificar que Todo Funciona

### Checklist:

```bash
# 1. Backend responde
curl https://moon-tv-backend.onrender.com

# 2. Frontend carga
curl https://moon-tv-frontend.onrender.com

# 3. MongoDB conectado
# Ve a los logs del backend, debe decir:
# "✅ MongoDB Connected"
```

---

## 🐛 Solución de Problemas

### "Application failed to respond"

**Causa:** El servicio está iniciando

**Solución:** Espera 1-2 minutos más

---

### "MongoDB connection failed"

**Causa:** String de conexión incorrecto

**Solución:**
1. Verifica el password
2. Verifica que `/moontv` esté al final
3. Verifica IP 0.0.0.0/0 permitida

---

### Frontend carga pero no hay datos

**Causa:** CORS o API URL incorrecta

**Solución:**
1. Verifica `VITE_API_URL` en frontend
2. Verifica `CORS_ORIGIN` en backend
3. Verifica en Network tab del navegador

---

### "Build failed"

**Causa:** Error en el código o dependencias

**Solución:**
1. Ve a los logs en Render
2. Busca el error específico
3. Posible `npm install` falló

---

## 💰 Costos y Límites

### Plan Gratuito:

| Recurso | Límite |
|---------|--------|
| RAM | 512 MB/servicio |
| CPU | Compartido |
| Bandwidth | 100 GB/mes |
| Horas | 750 h/mes/servicio |
| Servicios | Ilimitados |
| Sleep | Después de 15 min |

**Perfecto para:**
- ✅ Proyectos personales
- ✅ Demos y portfolios
- ✅ Hasta 50-100 usuarios simultáneos

### Plan Paid:

**$7/mes por servicio:**
- ✅ No sleep
- ✅ Horas ilimitadas
- ✅ Mejor performance
- ✅ Prioridad en support

---

## 🚀 Mejoras Futuras

### Custom Domain

1. Compra un dominio (ej: moontv.com)
2. Render → Settings → Custom Domain
3. Agrega: `app.moontv.com`
4. Actualiza DNS según instrucciones

### CI/CD Automático

Ya está configurado! Cada push a `main`:
1. Se actualiza automáticamente
2. Se rebuilds
3. Se redespliega

```bash
git add .
git commit -m "Update feature"
git push
# 🎉 Se despliega automáticamente
```

### Backups

MongoDB Atlas hace backups automáticos (gratis).

---

## 📊 Monitoreo

### Logs en Tiempo Real

1. Dashboard → Tu servicio
2. **"Logs"** → Ver en tiempo real

### Métricas

Dashboard muestra:
- Requests/segundo
- Memoria usada
- CPU
- Uptime

---

## 🎯 Arquitectura Final

```
Internet
    │
    ├─→ Render (Frontend)
    │   https://moon-tv-frontend.onrender.com
    │   ├── React App (512 MB)
    │   └── SSL Gratis
    │
    ├─→ Render (Backend)
    │   https://moon-tv-backend.onrender.com
    │   ├── Node.js API (512 MB)
    │   └── SSL Gratis
    │
    └─→ MongoDB Atlas
        mongodb+srv://...
        └── Database (512 MB gratis)
```

---

## ✅ Checklist Final

- [ ] MongoDB Atlas cluster creado
- [ ] String de conexión guardado
- [ ] Código subido a GitHub
- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] CORS configurado
- [ ] Contenido importado
- [ ] Cron job activo (opcional)
- [ ] Todo funciona en el navegador

---

## 🆘 Ayuda Extra

**Documentación:**
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)

**Videos tutoriales:**
- [Deploy Node.js en Render](https://www.youtube.com/results?search_query=deploy+nodejs+render)
- [MongoDB Atlas Setup](https://www.youtube.com/results?search_query=mongodb+atlas+setup)

---

**¡Moon TV online en 30 minutos y GRATIS! 🌙📺**

**Tu app estará en:**
`https://moon-tv-frontend.onrender.com`
