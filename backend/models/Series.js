const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  streamUrl: {
    type: String,
    required: true
  },
  synopsis: String,
  duration: Number, // en minutos
  airDate: Date,
  thumbnail: String
});

const seasonSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  title: String,
  episodes: [episodeSchema],
  year: Number,
  poster: String
});

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
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
  startYear: {
    type: Number,
    min: 1900
  },
  endYear: {
    type: Number,
    min: 1900
  },
  status: {
    type: String,
    enum: ['En emisión', 'Finalizada', 'Cancelada', 'Renovada'],
    default: 'En emisión'
  },
  genres: [String],
  creator: [String],
  cast: [String],
  country: String,
  language: {
    type: String,
    default: 'es'
  },
  network: String,
  seasons: [seasonSchema],
  rating: {
    imdb: { type: Number, min: 0, max: 10 },
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
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
seriesSchema.index({ title: 'text', synopsis: 'text', tags: 'text' });
seriesSchema.index({ genres: 1, isActive: 1 });
seriesSchema.index({ startYear: -1 });
seriesSchema.index({ 'rating.average': -1 });
seriesSchema.index({ viewCount: -1 });

// Método para incrementar visualizaciones
seriesSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Método para obtener total de episodios
seriesSchema.virtual('totalEpisodes').get(function() {
  return this.seasons.reduce((total, season) => total + season.episodes.length, 0);
});

module.exports = mongoose.model('Series', seriesSchema);
