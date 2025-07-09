const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const paymentController = require('../controller/paymentController');

// ✅ Webhook route must be placed BEFORE express.json middleware
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }), // Allows raw body for Razorpay
    paymentController.handleWebhookEvent
);

// ✅ Protected Routes (requires JWT and permissions)
router.use(authMiddleware.protect);

router.post('/create-order', authorize('payment:create'), paymentController.createOrder);
router.post('/verify-order', authorize('payment:create'), paymentController.verifyOrder);

router.post('/create-subscription', authorize('payment:create'), paymentController.createSubscription);
router.post('/verify-subscription', authorize('payment:create'), paymentController.verifySubscription);
router.post('/cancel-subscription', authorize('payment:create'), paymentController.cancelSubscription);

module.exports = router;
