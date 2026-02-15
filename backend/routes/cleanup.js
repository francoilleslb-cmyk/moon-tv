const express = require('express');
const router = express.Router();
const cleanupController = require('../controllers/cleanupController');

router.get('/reset-content', cleanupController.resetContent);

module.exports = router;
