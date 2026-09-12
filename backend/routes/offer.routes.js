const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', offerController.getOffers);
router.post('/', authenticateToken, requireAdmin, offerController.createOffer);
router.put('/:id', authenticateToken, requireAdmin, offerController.updateOffer);
router.delete('/:id', authenticateToken, requireAdmin, offerController.deleteOffer);

module.exports = router;
