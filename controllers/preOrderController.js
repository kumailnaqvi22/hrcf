const PreOrder = require('../models/PreOrder');
const jwt = require('jsonwebtoken');

// Save pre-order data
exports.savePreOrder = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required.' });
    }

    // Decode the token to get user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is defined in your environment variables
    const { userId, email, isAdmin, isMember } = decoded;

    // Validate if required fields are available
    if (!userId || !email) {
      return res.status(400).json({ error: 'User ID and email are required to save pre-order.' });
    }

    // Create and save pre-order
    const preOrder = await PreOrder.create({
      userId,
      email,
      isAdmin,
      isMember,
      createdAt: Date.now(),
    });

    // Respond with success message
    res.status(201).json({
      message: 'Pre-order recorded successfully We will contact you soon.',
      data: preOrder,
    });
  } catch (error) {
    console.error('Error saving pre-order:', error);
    res.status(500).json({ error: 'Pre-order recorded successfully We will contact you soon.' });
  }
};

// Fetch all pre-order data
exports.getPreOrderData = async (req, res) => {
    try {
      // Fetch all pre-orders
      const preOrders = await PreOrder.findAll();
  
      if (preOrders.length > 0) {
        res.status(200).json(preOrders);  // Return all pre-order records
      } else {
        res.status(404).json({ message: 'No pre-orders found.' });
      }
    } catch (error) {
      console.error('Error fetching pre-order data:', error);
      res.status(500).json({ message: 'Error fetching pre-order data' });
    }
  };
  
  