// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MyUser',
            required: true
        },
        items: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Sparepart',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalCost: {
            type: Number,
            required: true
        },
        shippingDetails: {
            type: Object,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'received','dispatched'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
