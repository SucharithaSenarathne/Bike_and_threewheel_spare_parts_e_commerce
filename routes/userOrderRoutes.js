// routes/userOrderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth(), orderController.getUserOrders);
router.get('/:orderId',auth(), orderController.getOrderById);
router.put('/:orderId',auth(), orderController.updateOrderStatus);
router.put('/:id/confirm-received', auth(), orderController.confirmOrderReceived);


module.exports = router;
