const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', settingsController.getSettings);
router.put('/', authenticateToken, requireAdmin, settingsController.updateSettings);
router.get('/dashboard-stats', authenticateToken, requireAdmin, settingsController.getDashboardStats);

module.exports = router;
