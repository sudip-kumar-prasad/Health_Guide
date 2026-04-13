const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send a medication reminder email
 */
const sendMedicationReminder = async (userEmail, userName, medicationName, dosage, instructions) => {
    try {
        const mailOptions = {
            from: `"VitallQ Health" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `💊 Medication Reminder: ${medicationName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #0ea5e9;">Medication Reminder</h2>
                    <p>Hello ${userName},</p>
                    <p>This is a friendly reminder to take your medication:</p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Medicine:</strong> ${medicationName}</p>
                        <p><strong>Dosage:</strong> ${dosage}</p>
                        ${instructions ? `<p><strong>Instructions:</strong> ${instructions}</p>` : ''}
                    </div>
                    <p>Stay healthy!</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #64748b;">VitallQ - Your Personal Health Guide</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} for medication ${medicationName}`);
    } catch (error) {
        console.error('Error sending medication reminder email:', error);
    }
};

/**
 * Send an appointment reminder email
 */
const sendAppointmentReminder = async (userEmail, userName, doctorName, date, specialty) => {
    try {
        const formattedDate = new Date(date).toLocaleString();
        const mailOptions = {
            from: `"VitallQ Health" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `📅 Upcoming Appointment with Dr. ${doctorName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #1e3a8a;">Appointment Reminder</h2>
                    <p>Hello ${userName},</p>
                    <p>You have an upcoming medical appointment:</p>
                    <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
                        <p><strong>Specialty:</strong> ${specialty}</p>
                        <p><strong>Date & Time:</strong> ${formattedDate}</p>
                    </div>
                    <p>Please make sure to arrive 10 minutes early.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #64748b;">VitallQ - Your Personal Health Guide</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${userEmail} for appointment with ${doctorName}`);
    } catch (error) {
        console.error('Error sending appointment reminder email:', error);
    }
};

module.exports = {
    sendMedicationReminder,
    sendAppointmentReminder
};
