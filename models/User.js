// C:\Users\hasnain haider shah\OneDrive\Desktop\learn1\backend\models\User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
  },
  otpExpiration: {
    type: Date
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
