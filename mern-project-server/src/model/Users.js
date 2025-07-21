
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    id: { type: String },
    planId: { type: String },
    status: { type: String },
    start: { type: Date },
    end: { type: Date },
    lastBillDate: { type: Date },
    nextBillDate: { type: Date },
    paymentsMade: { type: Number },
    paymentsRemaining: { type: Number },
});

const UsersSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    isGoogleUser: { type: String, required: false },
    googleId: { type: String, required: false },
    role: { type: String, default: 'admin' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true },
    credits: { type: Number, default: 0 },
    subscription: { type: subscriptionSchema, default: () => ({}) },

    //  New fields for password reset
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
});

module.exports = mongoose.model('users', UsersSchema);
