const express = require('express');
const {
  getOverviewData,
  getRevenueData,
  getTotalRevenue,
  getTransactionData,
  getOrderFulfillmentRatio
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/overview', getOverviewData);
router.get('/revenue/:period', getRevenueData); // period can be day, week, month, year
router.get('/total-revenue/:period', getTotalRevenue); // period can be day, week, month, year
router.get('/transactions/:period', getTransactionData); // period can be day, week, month, year
router.get('/fulfillment-ratio', getOrderFulfillmentRatio);

module.exports = router;