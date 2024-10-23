const Order = require('../models/Order');
const Item = require('../models/Items');

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.checkout = async (req, res) => {
    const { items, totalCost, shippingDetails, paymentMethod } = req.body;

    try {
        if (paymentMethod === 'cash') {
            const newOrder = new Order({
                user: req.user.id,
                items,
                totalCost,
                shippingDetails,
                paymentMethod: 'cash',
                status: 'pending'
            });

            const order = await newOrder.save();

            for (const orderedItem of items) {
                const item = await Item.findById(orderedItem.item);
                if (item) {
                    const quantity = Number(orderedItem.quantity);
                    item.itemsSold = (item.itemsSold || 0) + quantity;
                    item.stock = (item.stock || 0) - quantity;
                    await item.save();
                }
            }

            return res.status(201).json(order);
        } else if (paymentMethod === 'card') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalCost * 100),
                currency: 'usd', 
                metadata: {
                    userId: req.user.id,
                    shippingDetails: JSON.stringify(shippingDetails),
                    items: JSON.stringify(items)
                }
            });

            const newOrder = new Order({
                user: req.user.id,
                items,
                totalCost,
                shippingDetails,
                paymentMethod: 'card',
                status: 'pending'
            });

            const order = await newOrder.save();

            for (const orderedItem of items) {
                const item = await Item.findById(orderedItem.item);
                if (item) {
                    const quantity = Number(orderedItem.quantity);
                    item.itemsSold = (item.itemsSold || 0) + quantity;
                    item.stock = (item.stock || 0) - quantity;
                    await item.save();
                }
            }
            return res.status(200).json({
                order,clientSecret: paymentIntent.client_secret
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);

        if (error.type === 'StripeCardError') {
            res.status(400).json({ message: 'Card error' });
        } else if (error.type === 'StripeInvalidRequestError') {
            res.status(400).json({ message: 'Invalid request' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.item','name image');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate({
            path: 'items.item',
            select: 'name image'
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate({
            path: 'items.item'
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
};

exports.OrderDispatched = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'dispatched';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.confirmOrderReceived = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        order.status = 'received';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

