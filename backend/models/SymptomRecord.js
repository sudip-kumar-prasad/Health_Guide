const mongoose = require('mongoose');

const SymptomRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: [{
        type: String,
        required: true
    }],
    duration: {
        type: String, // e.g., "2 days", "1 week"
        required: true
    },
    severity: {
        type: String,
        enum: ['Mild', 'Moderate', 'Severe'],
        required: true
    },
    analysisResult: {
        conditions: [{
            name: String,
            probability: String // Low, Medium, High
        }],
        recommendedDoctor: String,
        suggestedMedicine: [String],
        emergencyWarning: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SymptomRecord', SymptomRecordSchema);
