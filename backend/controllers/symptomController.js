const SymptomRecord = require('../models/SymptomRecord');
const { analyzeSymptoms } = require('../utils/symptomLogic');

// @desc    Analyze symptoms and save record
// @route   POST /api/symptoms/analyze
// @access  Private
const analyzeAndSave = async (req, res) => {
    const { symptoms, duration, severity } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
        return res.status(400).json({ message: 'Symptoms must be an array' });
    }

    // 1. Run Analysis Logic
    const analysisResult = analyzeSymptoms(symptoms);

    // 2. Save to Database
    try {
        const record = await SymptomRecord.create({
            user: req.user.id,
            symptoms,
            duration,
            severity,
            analysisResult
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user history
// @route   GET /api/symptoms/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const history = await SymptomRecord.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get analytics data
// @route   GET /api/symptoms/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const records = await SymptomRecord.find({ user: req.user.id }).sort({ createdAt: 1 });

        // Aggregate symptom frequency
        const symptomFrequency = {};
        records.forEach(record => {
            record.symptoms.forEach(symptom => {
                symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
            });
        });

        // Severity distribution
        const severityDistribution = {
            Mild: 0,
            Moderate: 0,
            Severe: 0
        };
        records.forEach(record => {
            severityDistribution[record.severity]++;
        });

        // Symptom trends (group by month)
        const trendData = {};
        records.forEach(record => {
            const monthYear = new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            if (!trendData[monthYear]) {
                trendData[monthYear] = { count: 0, severe: 0 };
            }
            trendData[monthYear].count++;
            if (record.severity === 'Severe') {
                trendData[monthYear].severe++;
            }
        });

        // Most common conditions
        const conditionFrequency = {};
        records.forEach(record => {
            if (record.analysisResult?.conditions) {
                record.analysisResult.conditions.forEach(condition => {
                    conditionFrequency[condition.name] = (conditionFrequency[condition.name] || 0) + 1;
                });
            }
        });

        res.json({
            totalChecks: records.length,
            symptomFrequency,
            severityDistribution,
            trendData,
            conditionFrequency,
            recentRecords: records.slice(-5).reverse()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

// @desc    Delete a symptom record
// @route   DELETE /api/symptoms/:id
// @access  Private
const deleteRecord = async (req, res) => {
    try {
        const record = await SymptomRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check if user owns the record
        if (record.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await record.deleteOne();
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
};

module.exports = {
    analyzeAndSave,
    getHistory,
    getAnalytics,
    deleteRecord
};
