const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticateToken, isAdmin } = require('../utils/auth');

router.get('/customers-list', authenticateToken, customerController.getCustomers);
router.get('/customer-details/:id', authenticateToken, customerController.getCustomerDetails);
router.get('/new-customer', authenticateToken, isAdmin, customerController.getNewCustomer);
router.post('/new-customer', authenticateToken, isAdmin, customerController.createCustomer);
router.get('/edit-customer/:id', authenticateToken, isAdmin, customerController.getEditCustomer);
router.post('/edit-customer/:id', authenticateToken, isAdmin, customerController.editCustomer);
router.post('/delete-customer/:id', authenticateToken, isAdmin, customerController.deleteCustomer);

module.exports = router;
