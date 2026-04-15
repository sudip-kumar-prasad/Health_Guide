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

/**
 * Send a verification email
 */
const sendVerificationEmail = async (userEmail, userName, token) => {
    try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
        const mailOptions = {
            from: `"VitallQ Security" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '📧 Verify your email - VitallQ',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #1e3a8a;">Welcome to VitallQ!</h2>
                    <p>Hello ${userName},</p>
                    <p>Thank you for joining our health community. Please verify your email address to get started:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="font-size: 0.9rem; color: #64748b;">${verificationUrl}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #64748b;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

module.exports = {
    sendMedicationReminder,
    sendAppointmentReminder,
    sendVerificationEmail
};
