const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { authenticateToken, isAdmin } = require('../utils/auth');

router.get('/users-list', authenticateToken, isAdmin, usersController.getUsers);
router.post('/delete-user/:id', authenticateToken, isAdmin, usersController.deleteUser);
router.post('/change-role/:id', authenticateToken, isAdmin, usersController.changeRole);

module.exports = router;
