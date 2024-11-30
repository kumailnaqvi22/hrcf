const express = require('express');
const router = express.Router();
const CouponsController = require('../controllers/CouponsController');

// CREATE - Add a new coupon
router.post('/coupons', CouponsController.createCoupon);

// READ - Get all coupons (with optional filters)
router.get('/coupons', CouponsController.getCoupons);

// READ - Get coupon by ID
router.get('/coupons/:id', CouponsController.getCouponById);

// UPDATE - Update coupon by ID
router.put('/coupons/:id', CouponsController.updateCoupon);

// DELETE - Delete coupon by ID
router.delete('/coupons/:id', CouponsController.deleteCoupon);

// FILTER - Filter coupons by store, category, or status
router.get('/coupons/filter', CouponsController.filterCoupons);

module.exports = router;
