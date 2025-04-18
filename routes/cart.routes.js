const express = require('express');
const { 
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all cart routes
router.use(verifyToken);

// Cart routes
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:itemId', updateCartItem);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;