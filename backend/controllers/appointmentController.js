const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const {
            doctorName,
            doctorSpecialty,
            doctorAddress,
            appointmentDate,
            reason,
            notes
        } = req.body;

        const appointment = await Appointment.create({
            user: req.user.id,
            doctorName,
            doctorSpecialty,
            doctorAddress,
            appointmentDate,
            reason,
            notes
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling appointment', error: error.message });
    }
};

// Get all appointments for a user
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id })
            .sort({ appointmentDate: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

// Get a single appointment
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment', error: error.message });
    }
};

// Update an appointment (status, rescheduling)
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment
};
