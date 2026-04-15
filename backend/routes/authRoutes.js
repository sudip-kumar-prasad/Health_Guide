const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, updatePassword, forgotPassword, resetPassword, googleLogin, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;
