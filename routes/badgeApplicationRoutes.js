const express = require('express');
const {
  submitBadgeApplication,
  getAllBadgeApplications,
  getBadgeApplicationById,
  updateBadgeApplication,
  deleteBadgeApplication,
} = require('../controllers/badgeApplicationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public route: Submit a badge application
router.post('/submit',  submitBadgeApplication);

// Admin routes
router.get('/', protect, admin, getAllBadgeApplications); // Get all applications
router.get('/:id', protect, admin, getBadgeApplicationById); // Get application by ID
router.put('/:id', protect, admin, updateBadgeApplication); // Update application by ID
router.delete('/:id', protect, admin, deleteBadgeApplication); // Delete application by ID

module.exports = router;
