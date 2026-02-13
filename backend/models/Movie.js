const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  streamUrl: {
    type: String,
    required: [true, 'La URL del stream es requerida']
  },
  poster: {
    type: String,
    default: ''
  },
  backdrop: {
    type: String,
    default: ''
  },
  synopsis: {
    type: String,
    default: ''
  },
  year: {
    type: Number,
    min: 1900,
    max: 2100
  },
  duration: {
    type: Number, // en minutos
    default: 0
  },
  genres: [String],
  director: String,
  cast: [String],
  country: String,
  language: {
    type: String,
    default: 'es'
  },
  rating: {
    imdb: { type: Number, min: 0, max: 10 },
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  quality: {
    type: String,
    enum: ['CAM', 'TS', 'TC', 'DVD', 'HD', 'FHD', '4K'],
    default: 'HD'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  trailer: String
}, {
  timestamps: true
});

// Índices
movieSchema.index({ title: 'text', synopsis: 'text', tags: 'text' });
movieSchema.index({ genres: 1, isActive: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ 'rating.average': -1 });
movieSchema.index({ viewCount: -1 });

// Método para incrementar visualizaciones
movieSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Movie', movieSchema);
