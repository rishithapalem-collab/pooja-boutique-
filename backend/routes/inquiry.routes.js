const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', inquiryController.createInquiry);
router.get('/', authenticateToken, requireAdmin, inquiryController.getInquiries);
router.patch('/:id/status', authenticateToken, requireAdmin, inquiryController.updateInquiryStatus);
router.delete('/:id', authenticateToken, requireAdmin, inquiryController.deleteInquiry);

module.exports = router;
