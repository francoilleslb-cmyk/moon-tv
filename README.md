# 🌙 Moon TV - Plataforma de Streaming

Moon TV es una aplicación completa de streaming que permite ver TV en vivo, películas y series. Desarrollada con **Node.js/Express** en el backend y **React + Vite** en el frontend.

## ✨ Características

- 📺 **TV en Vivo**: Más de 500 canales de televisión
- 🎬 **Películas**: Amplio catálogo de películas
- 📺 **Series**: Las mejores series del momento
- 👤 **Sistema de Usuarios**: Registro, login y perfiles
- ⭐ **Favoritos**: Guarda tus canales favoritos
- 🔍 **Búsqueda**: Encuentra contenido fácilmente
- 📱 **Responsive**: Funciona en todos los dispositivos
- 🎨 **Diseño Moderno**: Interfaz oscura y elegante

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs para encriptación
- Express Validator

### Frontend
- React 18
- React Router v6
- Vite
- Tailwind CSS
- Zustand (state management)
- Axios
- React Player
- React Icons
- React Toastify

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v5 o superior)
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd moon-tv
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

**Configuración del archivo .env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/moontv
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
echo "VITE_API_URL=http://localhost:5000" > .env
```

### 4. Importar Canales (Opcional)

Para importar los canales desde el archivo M3U:

```bash
cd backend/scripts

# Crear archivo channels.m3u y pegar el contenido M3U que proporcionaste
# Luego ejecutar:
npm run seed
```

## 🎮 Uso

### Iniciar Backend

```bash
cd backend
npm run dev
# El servidor estará en http://localhost:5000
```

### Iniciar Frontend

```bash
cd frontend
npm run dev
# La aplicación estará en http://localhost:3000
```

## 📁 Estructura del Proyecto

```
moon-tv/
├── backend/
│   ├── controllers/          # Controladores de rutas
│   ├── models/              # Modelos de MongoDB
│   ├── routes/              # Definición de rutas
│   ├── middleware/          # Middleware (auth, etc)
│   ├── scripts/             # Scripts de utilidad
│   │   └── seedChannels.js  # Importar canales
│   ├── server.js            # Servidor principal
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── pages/           # Páginas de la app
    │   ├── store/           # Estado global (Zustand)
    │   ├── App.jsx          # Componente principal
    │   ├── main.jsx         # Punto de entrada
    │   └── index.css        # Estilos globales
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/update-profile` - Actualizar perfil

### Canales
- `GET /api/channels` - Listar canales
- `GET /api/channels/:id` - Obtener canal por ID
- `GET /api/channels/categories` - Listar categorías
- `GET /api/channels/search?q=` - Buscar canales
- `POST /api/channels/:id/favorite` - Agregar/quitar favorito
- `POST /api/channels/:id/view` - Registrar vista

### Películas & Series
- `GET /api/movies` - Listar películas
- `GET /api/series` - Listar series

## 👤 Usuario de Prueba

Puedes crear un usuario o usar las credenciales de administrador:

```json
{
  "email": "admin@moontv.com",
  "password": "admin123"
}
```

## 📝 Scripts Disponibles

### Backend
```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo
npm run seed       # Importar canales
```

### Frontend
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa de build
```

## 🎨 Características del Diseño

- **Tema Oscuro**: Diseño oscuro elegante
- **Gradientes**: Efectos de brillo lunar
- **Responsive**: Adaptado a todos los tamaños
- **Animaciones**: Transiciones suaves
- **Icons**: React Icons
- **Tailwind CSS**: Estilos utilitarios

## 🔒 Seguridad

- Contraseñas encriptadas con bcryptjs
- Autenticación JWT
- Headers de seguridad con Helmet
- Rate limiting
- Validación de datos con Express Validator
- CORS configurado

## 📦 Deploy

### Backend (Heroku, Railway, etc)
1. Configurar variables de entorno
2. Conectar a MongoDB Atlas
3. `npm start`

### Frontend (Vercel, Netlify, etc)
1. Build: `npm run build`
2. Configurar variable VITE_API_URL
3. Deploy carpeta `dist/`

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 👨‍💻 Autor

**Moon TV Team**

## 🙏 Agradecimientos

- Comunidad de React
- Comunidad de Node.js
- Todos los colaboradores

---

**¡Disfruta de Moon TV! 🌙📺**

Para soporte o preguntas: support@moontv.com
