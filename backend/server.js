require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar rutas
const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const movieRoutes = require('./routes/movies');
const seriesRoutes = require('./routes/series');
const userRoutes = require('./routes/users');
const cleanupRoutes = require('./routes/cleanup'); // TEMPORAL - Eliminar después

const app = express();

// Verificar variables de entorno críticas
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI no está definida');
  process.exit(1);
}

// Conectar a MongoDB
console.log('🔄 Conectando a MongoDB Atlas...');

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ ¡CONEXIÓN EXITOSA A MONGODB ATLAS!');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    // En producción, reintentar conexión
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Reintentando conexión en 5 segundos...');
      setTimeout(() => {
        mongoose.connect(process.env.MONGODB_URI);
      }, 5000);
    }
  });

// Configurar CORS mejorado
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://moon-tv-frontend.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    // Permitir peticiones sin origin (como herramientas de test) o si están en la lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Helmet para seguridad
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Demasiadas solicitudes, por favor intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check para Render
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🌙 Bienvenido a Moon TV API',
    version: '1.0.0',
    status: 'online',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'conectada' : 'desconectada',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      channels: '/api/channels',
      movies: '/api/movies',
      series: '/api/series',
      users: '/api/users'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cleanup', cleanupRoutes); // TEMPORAL - Eliminar después

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // No mostrar stack trace en producción
  const errorResponse = {
    success: false,
    message: err.message || 'Error interno del servidor'
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🌙 ═════════════════════════════════════════');
  console.log('   MOON TV API - Servidor Iniciado');
  console.log('═════════════════════════════════════════');
  console.log(`🚀 Puerto: ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Host: 0.0.0.0`);
  console.log('═════════════════════════════════════════\n');
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  mongoose.connection.close();
  process.exit(0);
});

module.exports = app;