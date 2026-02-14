const express = require('express');
const router = express.Router();
const Series = require('../models/Series');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, status, sort = '-createdAt' } = req.query;

    const query = { isActive: true };
    if (genre) query.genres = genre;
    if (status) query.status = status;

    const series = await Series.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Series.countDocuments(query);

    res.json({
      success: true,
      count: series.length,
      total: count,
      pages: Math.ceil(count / limit),
      series
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const serie = await Series.findById(req.params.id);

    if (!serie) {
      return res.status(404).json({
        success: false,
        message: 'Serie no encontrada'
      });
    }

    res.json({
      success: true,
      serie
    });
  } catch (error) {
    next(error);
  }
});

// Rutas protegidas
// router.post('/', protect, authorize('admin'), async (req, res, next) => {
router.post('/', async (req, res, next) => {
  try {
    const serie = await Series.create(req.body);
    res.status(201).json({
      success: true,
      serie
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
