const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, wellnessController.createWellnessLog);
router.get('/', protect, wellnessController.getWellnessLogs);
router.get('/today', protect, wellnessController.getLatestWellnessLog);

module.exports = router;
