const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const {authenticateToken, isAdmin} = require("../utils/auth");

router.get('/all-products', authenticateToken, productController.getProducts);
router.get('/product-details/:id', authenticateToken, productController.getProductDetails);
router.get('/new-product', authenticateToken, isAdmin, productController.newProductForm);
router.post('/new-product', authenticateToken, isAdmin, productController.upload, productController.createProduct);
router.get('/edit-product/:id', authenticateToken, isAdmin, productController.editProductForm);
router.post('/edit-product/:id', authenticateToken, isAdmin, productController.upload, productController.updateProduct);
router.post('/delete-product/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
