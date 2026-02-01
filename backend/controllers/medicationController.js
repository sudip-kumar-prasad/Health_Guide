const Medication = require('../models/Medication');

// Add a new medication
const addMedication = async (req, res) => {
    try {
        const {
            name,
            dosage,
            frequency,
            timeOfDay,
            startDate,
            endDate,
            instructions,
            stockLeft,
            refillReminder
        } = req.body;

        const medication = await Medication.create({
            user: req.user.id,
            name,
            dosage,
            frequency,
            timeOfDay,
            startDate: startDate || Date.now(),
            endDate,
            instructions,
            stockLeft,
            refillReminder
        });

        res.status(201).json(medication);
    } catch (error) {
        res.status(500).json({ message: 'Error adding medication', error: error.message });
    }
};

// Get all medications for a user
const getMedications = async (req, res) => {
    try {
        const { activeOnly } = req.query;
        const query = { user: req.user.id };

        if (activeOnly === 'true') {
            query.isActive = true;
        }

        const medications = await Medication.find(query).sort({ createdAt: -1 });
        res.json(medications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medications', error: error.message });
    }
};

// Update medication (e.g., mark inactive, update stock)
const updateMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        if (medication.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedMedication = await Medication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedMedication);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medication', error: error.message });
    }
};

// Delete medication
const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        if (medication.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await medication.deleteOne();
        res.json({ message: 'Medication deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medication', error: error.message });
    }
};

module.exports = {
    addMedication,
    getMedications,
    updateMedication,
    deleteMedication
};
