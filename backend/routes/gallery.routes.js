const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', galleryController.getGallery);
router.post('/', authenticateToken, requireAdmin, galleryController.createGalleryItem);
router.delete('/:id', authenticateToken, requireAdmin, galleryController.deleteGalleryItem);

module.exports = router;
