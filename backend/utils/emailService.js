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
 * Send an OTP verification email
 */
const sendOTPEmail = async (userEmail, userName, otp) => {
    try {
        const mailOptions = {
            from: `"VitallQ Security" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '🔒 Your VitallQ Verification Code',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #1e3a8a; text-align: center;">Welcome to VitallQ!</h2>
                    <p>Hello ${userName},</p>
                    <p>Please use the following 6-digit code to verify your email address and complete your registration:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 2.5rem; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background: #f8fafc; padding: 10px 20px; border-radius: 8px; border: 2px dashed #cbd5e1;">
                            ${otp}
                        </span>
                    </div>
                    <p style="text-align: center; color: #64748b;">This code will expire in 10 minutes.</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #64748b; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = {
    sendMedicationReminder,
    sendAppointmentReminder,
    sendOTPEmail
};
