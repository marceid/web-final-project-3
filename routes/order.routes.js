const express = require('express');
const router  = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken, isAdmin } = require('../utils/auth');

router.get('/orders-list',       authenticateToken,          orderController.getOrders);
router.get('/order-details/:id', authenticateToken,          orderController.getOrderDetails);
router.get('/new-order',         authenticateToken, isAdmin, orderController.getNewOrder);
router.post('/new-order',        authenticateToken, isAdmin, orderController.createOrder);
router.get('/edit-order/:id',    authenticateToken, isAdmin, orderController.getEditOrder);
router.post('/edit-order/:id',   authenticateToken, isAdmin, orderController.editOrder);
router.post('/delete-order/:id', authenticateToken, isAdmin, orderController.deleteOrder);

module.exports = router;
