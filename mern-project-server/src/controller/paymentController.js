const Razorpay = require('razorpay');
const { CREDIT_PACKS, PLAN_IDS } = require("../constants/paymentConstants");
const crypto = require('crypto');
const Users = require('../model/Users');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
    // One-time payment: Create order
    createOrder: async (request, response) => {
        try {
            const { credits } = request.body;

            if (!CREDIT_PACKS[credits]) {
                return response.status(400).json({
                    message: 'Invalid credit value'
                });
            }

            const amount = CREDIT_PACKS[credits] * 100; // in paisa

            const order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            response.json({ order });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // One-time payment: Verify order
    verifyOrder: async (request, response) => {
        try {
            const {
                razorpay_order_id, razorpay_payment_id,
                razorpay_signature, credits
            } = request.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return response.status(400).json({
                    message: 'Signature verification failed'
                });
            }

            const user = await Users.findById({ _id: request.user.id });
            user.credits += Number(credits);
            await user.save();

            response.json({ user });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // 🔁 SUBSCRIPTION: Create Subscription
    createSubscription: async (request, response) => {
        try {
            const { plan_name } = request.body;

            if (!PLAN_IDS[plan_name]) {
                return response.status(400).json({ message: 'Invalid plan name' });
            }

            const plan = PLAN_IDS[plan_name];

            const subscription = await razorpay.subscriptions.create({
                plan_id: plan.id,
                customer_notify: 1,
                total_count: plan.totalBillingCycleCount,
                notes: { userId: request.user.id }
            });

            response.json({ subscription });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // ✅ SUBSCRIPTION: Verify after frontend confirmation
    verifySubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;
            const subscription = await razorpay.subscriptions.fetch(subscription_id);
            const user = await Users.findById({ _id: request.user.id });

            user.subscription = {
                id: subscription_id,
                planId: subscription.plan_id,
                status: subscription.status
            };
            await user.save();

            response.json({ user });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // ❌ SUBSCRIPTION: Cancel Subscription
    cancelSubscription: async (request, response) => {
        try {
            const { subscription_id } = request.body;
            if (!subscription_id) {
                return response.status(400).json({ message: 'Subscription ID is mandatory' });
            }

            const data = await razorpay.subscriptions.cancel(subscription_id);
            response.json({ data });
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // 🔁 SUBSCRIPTION: Handle webhook from Razorpay
    handleWebhookEvent: async (request, response) => {
        try {
            console.log('Received webhook event');

            const signature = request.headers['x-razorpay-signature'];
            const body = JSON.stringify(request.body);

            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
                .update(body)
                .digest('hex');

            if (expectedSignature !== signature) {
                return response.status(400).send('Invalid Signature');
            }

            const payload = request.body;
            const event = payload.event;
            const subscriptionData = payload.payload.subscription.entity;
            const razorpaySubscriptionId = subscriptionData.id;
            const userId = subscriptionData.notes?.userId;

            if (!userId) {
                console.log('UserId not found in notes');
                return response.status(400).send('UserId not found in notes');
            }

            let newStatus = '';
            switch (event) {
                case 'subscription.activated': newStatus = 'active'; break;
                case 'subscription.pending': newStatus = 'pending'; break;
                case 'subscription.cancelled': newStatus = 'cancelled'; break;
                case 'subscription.completed': newStatus = 'completed'; break;
                default:
                    console.log('Unhandled event: ', event);
                    return response.status(200).send('Unhandled event');
            }

            const user = await Users.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        'subscription.id': razorpaySubscriptionId,
                        'subscription.status': newStatus,
                        'subscription.planId': subscriptionData.plan_id,
                        'subscription:start': subscriptionData.start_at ? new Date(subscriptionData.start_at * 1000) : null,
                        'subscription:end': subscriptionData.end_at ? new Date(subscriptionData.end_at * 1000) : null,
                        'subscription:lastBillDate': subscriptionData.current_start ? new Date(subscriptionData.current_start * 1000) : null,
                        'subscription:nextBillDate': subscriptionData.current_end ? new Date(subscriptionData.current_end * 1000) : null,
                        'subscription:paymentsMade': subscriptionData.paid_count,
                        'subscription:paymentsRemaining': subscriptionData.remaining_count,
                    }
                },
                { new: true }
            );

            if (!user) {
                console.log('User not found');
                return response.status(400).send('User not found');
            }

            console.log(`Updated subscription status for user ${user.username} to ${newStatus}`);
            return response.status(200).send(`Event processed for user: ${userId}`);
        } catch (error) {
            console.log(error);
            return response.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = paymentController;
