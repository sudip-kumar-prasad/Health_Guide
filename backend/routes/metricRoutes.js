const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addMetric,
    getMetrics,
    getMetricStats,
    deleteMetric,
    calculateBMI
} = require('../controllers/metricController');

// All routes are protected
router.post('/', protect, addMetric);
router.get('/', protect, getMetrics);
router.get('/stats/:type', protect, getMetricStats);
router.delete('/:id', protect, deleteMetric);
router.post('/bmi', protect, calculateBMI);

module.exports = router;
