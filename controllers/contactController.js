// controllers/contactController.js
const ContactMessage = require('../models/ContactMessage');

const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newMessage = new ContactMessage({
        name,
        email,
        message
    });

    try {
        const savedMessage = await newMessage.save();
        res.json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message' });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find();
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

module.exports = {
    submitContactForm,
    getMessages
};
