const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del canal es requerido'],
    trim: true
  },
  streamUrl: {
    type: String,
    required: [true, 'La URL del stream es requerida'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Bics',
      'Bics Extra Latino',
      'Bics Extra US',
      'Bics Extra Internacional',
      'Bics DEPORTES',
      'Bics DEPORTES LA LIGA',
      'Bics DEPORTES PREMIER',
      'Bics PARIS 2024',
      'Bics LIGA MX',
      'Bics DEPORTES LMB',
      'Bics REGIONALES',
      'General',
      'Deportes',
      'Noticias',
      'Entretenimiento',
      'Infantil',
      'Películas',
      'Series',
      'Cultura',
      'Música'
    ],
    default: 'General'
  },
  country: {
    type: String,
    default: 'MX'
  },
  logo: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  quality: {
    type: String,
    enum: ['SD', 'HD', '4K'],
    default: 'SD'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  is24x7: {
    type: Boolean,
    default: true
  },
  tags: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices para búsqueda rápida
channelSchema.index({ name: 'text', description: 'text', tags: 'text' });
channelSchema.index({ category: 1, isActive: 1 });
channelSchema.index({ country: 1 });

// Método para incrementar contador de visualizaciones
channelSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Channel', channelSchema);
