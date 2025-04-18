const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory 
} = require('../controllers/product.controller');

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

module.exports = router;