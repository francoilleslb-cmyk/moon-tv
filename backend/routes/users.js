const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Obtener favoritos del usuario
router.get('/favorites', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites.channels', 'name logo category streamUrl')
      .populate('favorites.movies', 'title poster genres year')
      .populate('favorites.series', 'title poster genres');

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
});

// Obtener historial de visualización
router.get('/history', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('watchHistory')
      .populate({
        path: 'watchHistory.contentId',
        select: 'name title poster logo'
      })
      .sort({ 'watchHistory.watchedAt': -1 });

    res.json({
      success: true,
      history: user.watchHistory.slice(0, 50) // Últimas 50
    });
  } catch (error) {
    next(error);
  }
});

// Admin: Obtener todos los usuarios
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
