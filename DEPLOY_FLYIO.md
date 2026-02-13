# 🚀 Desplegar Moon TV en Fly.io

## ✅ Por qué Fly.io

- ✅ **GRATIS** hasta 3 apps con 256MB RAM
- ✅ **Soporta Docker** nativamente
- ✅ **Rápido** - Deploy en 2 minutos
- ✅ **Global** - Servidores en Latinoamérica (São Paulo)
- ✅ **SSL Gratis** - HTTPS automático
- ✅ **CLI Potente** - Fácil de usar

---

## 📋 Requisitos Previos

1. Cuenta en [fly.io](https://fly.io) (gratis)
2. MongoDB Atlas (gratis) - [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
3. Fly CLI instalada

---

## 🛠️ Paso 1: Instalar Fly CLI

### Linux/Mac:
```bash
curl -L https://fly.io/install.sh | sh
```

### Windows (PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Verificar instalación:
```bash
fly version
```

---

## 🔐 Paso 2: Login en Fly.io

```bash
fly auth login
```

Esto abrirá tu navegador para autenticarte.

---

## 💾 Paso 3: Configurar MongoDB Atlas

### 3.1 Crear cuenta gratuita
1. Ve a [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un cluster (M0 Sandbox - GRATIS)
4. Selecciona región: **São Paulo (sa-east-1)** (más cerca de Argentina)

### 3.2 Configurar acceso
1. Database Access → Add New Database User
   - Username: `moontv`
   - Password: (genera uno seguro)
   - Database User Privileges: `Atlas Admin`

2. Network Access → Add IP Address
   - Click: **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Esto es necesario para Fly.io

### 3.3 Obtener Connection String
1. Database → Connect
2. Drivers → Node.js
3. Copiar la cadena de conexión:
   ```
   mongodb+srv://moontv:<password>@cluster0.xxxxx.mongodb.net/moontv?retryWrites=true&w=majority
   ```
4. Reemplazar `<password>` con tu password real

---

## 🚀 Paso 4: Preparar el Proyecto

```bash
cd moon-tv
```

---

## 📦 Paso 5: Crear la App en Fly.io

```bash
fly launch --no-deploy
```

**Responde a las preguntas:**

```
? Choose an app name: moon-tv
? Choose a region: São Paulo, Brazil (gru)
? Would you like to set up a Postgresql database? No
? Would you like to set up an Upstash Redis database? No
```

---

## 🔒 Paso 6: Configurar Variables de Entorno

```bash
# MongoDB URI (reemplaza con tu string de Atlas)
fly secrets set MONGODB_URI="mongodb+srv://moontv:TU_PASSWORD@cluster0.xxxxx.mongodb.net/moontv"

# JWT Secret (genera uno random)
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"

# CORS Origin (tu URL de fly.io)
fly secrets set CORS_ORIGIN="https://moon-tv.fly.dev"
```

---

## 🚢 Paso 7: Desplegar

```bash
fly deploy
```

**Tiempo:** 2-4 minutos

---

## 🌐 Paso 8: Abrir tu App

```bash
fly open
```

`https://moon-tv.fly.dev`

---

## 📺 Paso 9: Importar Canales

```bash
# Conectarte a la app
fly ssh console

# Crear archivo e importar
cd /app/backend
node scripts/importUniversal.js
```

---

## 📊 Comandos Útiles

```bash
fly logs           # Ver logs
fly status         # Estado
fly dashboard      # Dashboard web
fly restart        # Reiniciar
fly ssh console    # SSH
```

---

## 💰 Costos

### Plan Hobby (GRATIS):
- ✅ 3 apps gratis
- ✅ 256MB RAM por app
- ✅ 1GB almacenamiento
- ✅ SSL incluido

---

**¡Tu Moon TV estará online en 15 minutos! 🎬📺**
