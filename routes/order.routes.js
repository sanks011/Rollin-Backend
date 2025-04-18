const express = require('express');
const { 
  placeOrder,
  getOrderById,
  getUserOrders
} = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all order routes
router.use(verifyToken);

// Order routes
router.post('/place', placeOrder);
router.get('/:id', getOrderById);
router.get('/', getUserOrders);

module.exports = router;