const express = require('express');
const router = express.Router();
const { analyzeAndSave, getHistory, getAnalytics, deleteRecord } = require('../controllers/symptomController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeAndSave);
router.get('/history', protect, getHistory);
router.get('/analytics', protect, getAnalytics);
router.delete('/:id', protect, deleteRecord);

module.exports = router;
