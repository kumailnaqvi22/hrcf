const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/CategoriesController');

// CREATE - Add a new category
router.post('/categories', CategoriesController.createCategory);

// READ - Get all categories (with optional filters)
router.get('/categories', CategoriesController.getCategories);

// READ - Get category by ID
router.get('/categories/:id', CategoriesController.getCategoryById);

// UPDATE - Update category by ID
router.put('/categories/:id', CategoriesController.updateCategory);

// DELETE - Delete category by ID
router.delete('/categories/:id', CategoriesController.deleteCategory);

// FILTER - Filter categories by status or other criteria
router.get('/categories/filter', CategoriesController.filterCategories);

module.exports = router;
