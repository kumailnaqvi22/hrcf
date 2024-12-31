const express = require('express');
const {
    createDonation,
    getDonations,
    getDonationDetails,
    deleteDonation,
} = require('../controllers/donationController');
const { protect, admin } = require('../middleware/auth'); // Middleware for protected routes
const router = express.Router();

// POST /api/donations - Create a new donation (Public)
router.post('/', createDonation);

// Admin-only routes for managing donations
router.get('/all', protect, admin, getDonations); // Get all donations
router.get('/:donationId', protect, admin, getDonationDetails); // Get details of a specific donation
router.delete('/:donationId', protect, admin, deleteDonation); // Delete donation

module.exports = router;
