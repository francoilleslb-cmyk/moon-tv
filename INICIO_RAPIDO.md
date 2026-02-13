# 🚀 Inicio Rápido - Moon TV

## 1. Requisitos
- Node.js v16+
- MongoDB v5+

## 2. Instalación Express (5 minutos)

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tu configuración de MongoDB

# Frontend
cd ../frontend
npm install
```

## 3. Configurar MongoDB

### Opción A: MongoDB Local
```bash
# Iniciar MongoDB
mongod

# En .env del backend:
MONGODB_URI=mongodb://localhost:27017/moontv
```

### Opción B: MongoDB Atlas (Cloud - Gratis)
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Obtener connection string
4. Pegar en .env:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/moontv
```

## 4. Importar Canales

```bash
cd backend/scripts

# Editar channels.m3u con tus URLs
nano channels.m3u

# Importar
npm run seed
```

## 5. Iniciar Aplicación

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# http://localhost:3000
```

## 6. Crear Usuario

1. Abrir http://localhost:3000
2. Clic en "Registrarse"
3. Crear cuenta
4. ¡Listo! 🎉

## 7. Funcionalidades Disponibles

✅ Ver canales en vivo
✅ Buscar canales
✅ Filtrar por categoría
✅ Agregar favoritos
✅ Historial de visualización
✅ Perfil de usuario

## Próximos Pasos

- Agregar más canales en `channels.m3u`
- Personalizar diseño en Tailwind CSS
- Agregar películas y series
- Configurar deploy en producción

## Ayuda

Si tienes problemas:
1. Verifica que MongoDB esté corriendo
2. Revisa los logs en la terminal
3. Asegúrate de tener Node.js actualizado
4. Limpia node_modules y reinstala: `rm -rf node_modules && npm install`
