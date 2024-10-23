// routes/api/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// Route to handle checkout
router.post('/checkout',auth(), orderController.checkout);
router.get('/',auth(), orderController.getAllOrders);
router.get('/:orderId',auth(), orderController.getOrderById);
router.put('/:orderId',auth(), orderController.updateOrderStatus);
router.put('/:id/order-dispatched', auth(), orderController.OrderDispatched);

module.exports = router;
