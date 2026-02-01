const mongoose = require('mongoose');

const WellnessLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: Number, // 1-5
        required: true
    },
    energyLevel: {
        type: Number, // 1-5
        required: true
    },
    sleepHours: {
        type: Number
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WellnessLog', WellnessLogSchema);
