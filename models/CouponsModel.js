const mongoose = require('mongoose');  

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String },
  expiryDate: { type: Date },
  discount: { type: Number },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  terms: { type: String },
  category: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
});

module.exports = mongoose.model('Coupon', CouponSchema);
