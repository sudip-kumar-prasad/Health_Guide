const WellnessLog = require('../models/WellnessLog');

exports.createWellnessLog = async (req, res) => {
    try {
        const { mood, energyLevel, sleepHours, notes } = req.body;

        // Check if a log already exists for today for this user
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const existingLog = await WellnessLog.findOne({
            user: req.user.id,
            createdAt: { $gte: startOfToday }
        });

        if (existingLog) {
            // Update existing log
            existingLog.mood = mood;
            existingLog.energyLevel = energyLevel;
            existingLog.sleepHours = sleepHours;
            existingLog.notes = notes;
            await existingLog.save();
            return res.json(existingLog);
        }

        const newLog = new WellnessLog({
            user: req.user.id,
            mood,
            energyLevel,
            sleepHours,
            notes
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(500).json({ message: 'Error saving wellness log', error: error.message });
    }
};

exports.getWellnessLogs = async (req, res) => {
    try {
        const logs = await WellnessLog.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(30); // Last 30 days
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wellness logs', error: error.message });
    }
};

exports.getLatestWellnessLog = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const log = await WellnessLog.findOne({
            user: req.user.id,
            createdAt: { $gte: startOfToday }
        });
        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today\'s wellness log', error: error.message });
    }
};
