// C:\Users\hasnain haider shah\OneDrive\Desktop\learn1\backend\controllers\authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Register user and send OTP for email verification
const register = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // If the user exists but hasn't verified OTP, update user details
            if (!user.verified) {
                user.name = name;
                user.password = await bcrypt.hash(password, 10); // Re-hash new password
                user.isAdmin = isAdmin;

                // Generate a new OTP and update OTP fields
                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpExpiration = Date.now() + 3600000; // OTP expires in 1 hour

                user.otp = otp;
                user.otpExpiration = otpExpiration;

                await user.save();

                // Send OTP via email
                const subject = 'Verify your email';
                const text = `Your OTP for email verification is: ${otp}`;
                await sendEmail(email, subject, text);

                return res.status(200).json({ message: 'OTP has been resent. Please check your email for the new OTP.' });
            }

            return res.status(400).json({ message: 'User already exists and has been verified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiration = Date.now() + 3600000; // OTP expires in 1 hour

        // Create a new user with OTP and expiration
        user = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin,
            verified: false,
            otp,
            otpExpiration
        });

        await user.save();

        // Send OTP via email
        const subject = 'Verify your email';
        const text = `Your OTP for email verification is: ${otp}`;
        await sendEmail(email, subject, text);

        res.status(201).json({ message: 'User registered. Please check your email for the OTP.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP exists and if it has expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (Date.now() > user.otpExpiration) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // OTP is correct and valid
        user.verified = true; // Mark user as verified
        user.otp = undefined;  // Clear OTP
        user.otpExpiration = undefined;  // Clear OTP expiration time
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '100h' }
        );

        res.status(200).json({ token, user, message: 'OTP verified and user logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email to log in' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '100h' }
        );

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '30m' });

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        const subject = 'Reset your password';
        const text = `
            You are receiving this email because you (or someone else) have requested the reset of the password for your account.
            Please click on the following link to reset your password:
            ${resetLink}
            If you did not request this, please ignore this email and your password will remain unchanged.
        `;
        await sendEmail(email, subject, text);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newToken = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1000h' }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    verifyOtp,
    login,
    forgotPassword,
    refreshToken,
    resetPassword,
};
