const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Profile route must come before any route that uses parameters like :id
router.get('/profile', protect, userController.getProfile); 
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', protect, userController.updateUserById); 
router.delete('/:id', protect, userController.deleteUserById); 

module.exports = router;