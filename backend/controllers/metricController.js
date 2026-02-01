const HealthMetric = require('../models/HealthMetric');

// Add a health metric
const addMetric = async (req, res) => {
    try {
        const { type, value, unit, notes, recordedAt } = req.body;

        const metric = await HealthMetric.create({
            user: req.user.id,
            type,
            value,
            unit,
            notes,
            recordedAt: recordedAt || Date.now()
        });

        res.status(201).json(metric);
    } catch (error) {
        res.status(500).json({ message: 'Error adding metric', error: error.message });
    }
};

// Get all metrics for a user (with optional type filter)
const getMetrics = async (req, res) => {
    try {
        const { type, limit = 30, startDate, endDate } = req.query;

        const query = { user: req.user.id };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.recordedAt = {};
            if (startDate) query.recordedAt.$gte = new Date(startDate);
            if (endDate) query.recordedAt.$lte = new Date(endDate);
        }

        const metrics = await HealthMetric.find(query)
            .sort({ recordedAt: -1 })
            .limit(parseInt(limit));

        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching metrics', error: error.message });
    }
};

// Get metric statistics
const getMetricStats = async (req, res) => {
    try {
        const { type } = req.params;

        const metrics = await HealthMetric.find({
            user: req.user.id,
            type
        }).sort({ recordedAt: -1 }).limit(100);

        if (metrics.length === 0) {
            return res.json({
                type,
                count: 0,
                latest: null,
                average: null,
                min: null,
                max: null,
                trend: []
            });
        }

        let values = [];

        // Handle different metric types
        if (type === 'blood_pressure') {
            values = metrics.map(m => m.value.systolic);
        } else if (type === 'bmi') {
            values = metrics.map(m => parseFloat(m.value));
        } else {
            values = metrics.map(m => parseFloat(m.value));
        }

        const average = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        res.json({
            type,
            count: metrics.length,
            latest: metrics[0],
            average: average.toFixed(2),
            min: min.toFixed(2),
            max: max.toFixed(2),
            trend: metrics.slice(0, 10).reverse() // Last 10 readings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

// Delete a metric
const deleteMetric = async (req, res) => {
    try {
        const metric = await HealthMetric.findById(req.params.id);

        if (!metric) {
            return res.status(404).json({ message: 'Metric not found' });
        }

        // Verify ownership
        if (metric.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await metric.deleteOne();
        res.json({ message: 'Metric deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting metric', error: error.message });
    }
};

// Calculate BMI
const calculateBMI = async (req, res) => {
    try {
        const { height, weight, unit = 'metric' } = req.body; // unit: metric or imperial

        let heightInMeters, weightInKg;

        if (unit === 'imperial') {
            // Convert feet/inches to meters, pounds to kg
            heightInMeters = height * 0.0254; // inches to meters
            weightInKg = weight * 0.453592; // pounds to kg
        } else {
            heightInMeters = height / 100; // cm to meters
            weightInKg = weight;
        }

        const bmi = weightInKg / (heightInMeters * heightInMeters);

        let category;
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        // Save BMI record
        const metric = await HealthMetric.create({
            user: req.user.id,
            type: 'bmi',
            value: bmi.toFixed(2),
            unit: 'kg/m²',
            notes: `Height: ${height}${unit === 'imperial' ? 'in' : 'cm'}, Weight: ${weight}${unit === 'imperial' ? 'lbs' : 'kg'}`
        });

        res.json({
            bmi: bmi.toFixed(2),
            category,
            metric
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating BMI', error: error.message });
    }
};

module.exports = {
    addMetric,
    getMetrics,
    getMetricStats,
    deleteMetric,
    calculateBMI
};
