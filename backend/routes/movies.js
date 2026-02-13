const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, year, sort = '-createdAt' } = req.query;
    
    const query = { isActive: true };
    if (genre) query.genres = genre;
    if (year) query.year = parseInt(year);

    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Movie.countDocuments(query);

    res.json({
      success: true,
      count: movies.length,
      total: count,
      pages: Math.ceil(count / limit),
      movies
    });
  } catch (error) {
    next(error);
  }
});

router.get('/featured', async (req, res, next) => {
  try {
    const movies = await Movie.find({ isActive: true, isFeatured: true })
      .limit(10)
      .sort('-rating.average');

    res.json({
      success: true,
      movies
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Película no encontrada'
      });
    }

    res.json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
});

// Rutas protegidas
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      movie
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
