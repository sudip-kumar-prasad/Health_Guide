const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String, // e.g., "500mg", "1 tablet"
        required: true
    },
    frequency: {
        type: String, // e.g., "Daily", "Twice a day", "Every 8 hours"
        required: true
    },
    timeOfDay: [{
        type: String, // e.g., ["08:00", "20:00"]
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    instructions: {
        type: String, // e.g., "Take after food"
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stockLeft: {
        type: Number,
        default: 0
    },
    refillReminder: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for user medications
medicationSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('Medication', medicationSchema);
