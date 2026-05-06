const express = require('express');
const authController = require('../controllers/auth.controller');
const {authenticateToken} = require("../utils/auth");
const router = express.Router();

router.get('/register', authController.register);

// Register POST
router.post('/register', authController.registerRequest);

// Login GET (show login form)
router.get('/login', authController.login);

// Login POST
router.post('/login', authController.loginRequest);

// Dashboard example - Protected route
router.get('/dashboard', authenticateToken, authController.dashboard);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
