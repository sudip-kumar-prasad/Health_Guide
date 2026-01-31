const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['bmi', 'blood_pressure', 'blood_sugar', 'weight', 'temperature', 'heart_rate'],
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be number or object for BP
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
healthMetricSchema.index({ user: 1, type: 1, recordedAt: -1 });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
