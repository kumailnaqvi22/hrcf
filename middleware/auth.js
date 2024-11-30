// C:\Users\hasnain haider shah\OneDrive\Desktop\learn1\backend\middleware\auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('Decoded token:', decoded);
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                // console.log('User not found for decoded userId:', decoded.userId);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(`Token verification failed: ${error}`);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No token provided in request');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
