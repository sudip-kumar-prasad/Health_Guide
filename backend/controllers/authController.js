const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Helper for lean user data to improve payload speed
const toLeanUser = (user, token) => ({
    _id: user._id || user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age,
    gender: user.gender,
    profileImage: user.profileImage,
    token: token || undefined
});

const { sendOTPEmail } = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // Register User
    const { name, email, password, age, gender, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    try {
        const user = await User.create({
            name,
            email,
            password,
            age,
            gender,
            phone,
            otp,
            otpExpires
        });

        if (user) {
            // Send OTP email
            await sendOTPEmail(user.email, user.name, otp);
            
            res.status(201).json({
                message: 'OTP sent to your email. Please verify to complete registration.',
                email: user.email // Return email so frontend knows which user to verify
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid user data', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }
        res.json(toLeanUser(user, generateToken(user._id)));
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(toLeanUser(req.user));
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.age = req.body.age !== undefined ? req.body.age : user.age;
            user.gender = req.body.gender || user.gender;
            // Explicitly check if phone is provided in body to allow clearing it or setting it
            if (req.body.phone !== undefined) {
                user.phone = req.body.phone;
            }
            user.profileImage = req.body.profileImage || user.profileImage;

            // Update medical history
            if (req.body.medicalHistory) {
                user.medicalHistory = {
                    ...user.medicalHistory,
                    ...req.body.medicalHistory
                };
            }

            // Update emergency contact
            if (req.body.emergencyContact) {
                user.emergencyContact = {
                    ...user.emergencyContact,
                    ...req.body.emergencyContact
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                age: updatedUser.age,
                gender: updatedUser.gender,
                profileImage: updatedUser.profileImage,
                medicalHistory: updatedUser.medicalHistory,
                emergencyContact: updatedUser.emergencyContact,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Profile update failed', error: error.message });
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Password update failed', error: error.message });
    }
};

// @desc    Forgot password - send reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // In production, send email with reset link
        // For now, return token (in production, this should be sent via email)
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        res.json({
            message: 'Password reset token generated',
            resetToken, // Remove this in production
            resetUrl
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({
            message: 'Password reset successful',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, sub, picture } = ticket.getPayload();

        // Atomic operation: find and update or create in one DB round trip
        const user = await User.findOneAndUpdate(
            { email },
            {
                $set: { googleId: sub },
                $setOnInsert: {
                    name,
                    email,
                    profileImage: picture,
                    role: 'user',
                    isVerified: true // Google users are already verified
                }
            },
            { upsert: true, new: true, runValidators: false }
        );

        // Update profile image if missing on existing user
        if (!user.profileImage && picture) {
            user.profileImage = picture;
            await user.save();
        }

        res.json(toLeanUser(user, generateToken(user._id)));
    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ message: 'Google login failed', error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Automatically log them in by returning the token
        res.json(toLeanUser(user, generateToken(user._id)));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTPEmail(user.email, user.name, otp);

        res.json({ message: 'New OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    googleLogin,
    verifyOTP,
    resendOTP,
};
