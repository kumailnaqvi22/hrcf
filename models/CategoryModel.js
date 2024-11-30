const mongoose = require('mongoose');  

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  });
  
  module.exports = mongoose.model('Category', CategorySchema);
  