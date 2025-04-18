const express = require('express');
const { login, logout, googleAuth, getCurrentUser } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;