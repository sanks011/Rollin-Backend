const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

// Import Firebase config and initialization
const { database } = require('./config/firebase.config');
const { initializeDatabase } = require('./config/initialize-db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'bakery-website-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Bakery Website API is running');
});

// Initialize database with sample data
if (process.env.INITIALIZE_DB === 'true') {
  initializeDatabase()
    .then(() => console.log('Database initialization complete'))
    .catch(err => console.error('Database initialization error:', err));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});