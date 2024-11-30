const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const testToken = async () => {
    const token = 'your_jwt_token_here';
    const decoded = jwt.verify(token, 'your_jwt_secret_here');
    console.log('Decoded token:', decoded);

    await mongoose.connect('your_mongo_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findById(decoded.userId).select('-password');
    console.log('User:', user);
};

testToken().catch(console.error);
