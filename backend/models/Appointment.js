const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorSpecialty: {
        type: String,
        required: true
    },
    doctorAddress: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'missed'],
        default: 'scheduled'
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for getting upcoming appointments
appointmentSchema.index({ user: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
