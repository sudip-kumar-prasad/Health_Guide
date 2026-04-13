const cron = require('node-cron');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendMedicationReminder, sendAppointmentReminder } = require('./emailService');

/**
 * Initialize health reminder cron jobs
 */
const initReminders = () => {
    console.log('Initializing automated health reminders...');

    // 1. Medication Reminder Job (Runs every minute)
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            
            // Find active medications
            const medications = await Medication.find({ isActive: true }).populate('user');

            for (const med of medications) {
                // Skip if user doesn't want medication reminders
                if (med.user?.notificationPreferences?.medicationReminders === false) continue;

                if (med.timeOfDay.includes(currentTime)) {
                    await sendMedicationReminder(
                        med.user.email,
                        med.user.name,
                        med.name,
                        med.dosage,
                        med.instructions
                    );
                }
            }
        } catch (error) {
            console.error('Error in Medication Reminder Job:', error);
        }
    });

    // 2. Appointment Reminder Job (Runs every hour)
    cron.schedule('0 * * * *', async () => {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            // Find upcoming appointments in the next 24 hours that haven't had a reminder sent
            const appointments = await Appointment.find({
                status: 'scheduled',
                reminderSent: false,
                appointmentDate: { 
                    $gte: new Date(), 
                    $lte: tomorrow 
                }
            }).populate('user');

            for (const apt of appointments) {
                // Skip if user doesn't want appointment reminders
                if (apt.user?.notificationPreferences?.appointmentReminders === false) continue;

                await sendAppointmentReminder(
                    apt.user.email,
                    apt.user.name,
                    apt.doctorName,
                    apt.appointmentDate,
                    apt.doctorSpecialty
                );

                // Mark as reminder sent
                apt.reminderSent = true;
                await apt.save();
            }
        } catch (error) {
            console.error('Error in Appointment Reminder Job:', error);
        }
    });

    console.log('Cron jobs scheduled successfully.');
};

module.exports = { initReminders };
