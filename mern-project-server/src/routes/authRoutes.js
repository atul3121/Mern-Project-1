
const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();
const { body } = require('express-validator');

// Login validation
const loginValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Username must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];

// Routes
router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/is-user-logged-in', authController.isUserLoggedIn);
router.post('/register', authController.register);
router.post('/google-auth', authController.googleAuth);

// New Routes for Forget/Reset Password
router.post('/send-reset-password-token', authController.sendResetPasswordToken);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
