const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const { protect, authorize } = require('../middleware/auth');

// Rutas públicas
router.get('/', channelController.getAllChannels);
router.get('/categories', channelController.getCategories);
router.get('/category/:category', channelController.getChannelsByCategory);
router.get('/search', channelController.searchChannels);
router.get('/:id', channelController.getChannelById);

// Rutas protegidas
router.post('/:id/view', protect, channelController.incrementViews);
router.post('/:id/favorite', protect, channelController.toggleFavorite);
router.post('/:id/rate', protect, channelController.rateChannel);

// Rutas de admin
// COMENTA ESTA LÍNEA ORIGINAL:
// router.post('/', protect, authorize('admin'), channelController.createChannel);

// AGREGA ESTA LÍNEA TEMPORAL:
router.post('/', channelController.createChannel);

router.put('/:id', protect, authorize('admin'), channelController.updateChannel);

// COMENTA ESTA LÍNEA ORIGINAL:
// router.delete('/:id', protect, authorize('admin'), channelController.deleteChannel);

// AGREGA ESTA LÍNEA TEMPORAL:
router.delete('/:id', channelController.deleteChannel);

module.exports = router;
