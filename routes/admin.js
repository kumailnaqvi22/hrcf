// backend/routes/admin.js
const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');

// Define routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/promote', adminController.promoteToAdmin);
router.get('/manage-users', adminController.manageUsers);

module.exports = router;
