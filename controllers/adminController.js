// backend/controllers/adminController.js
const User = require('../models/User');

// Controller function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to promote a user to admin
const promoteToAdmin = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isAdmin = true;
        await user.save();
        res.status(200).json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Controller function to manage users
const manageUsers = async (req, res) => {
    // Logic to manage users (e.g., listing, updating user roles, etc.)
};

module.exports = {
    getAllUsers,
    promoteToAdmin,
    manageUsers
};
