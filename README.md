# Bakery Website Backend

This is the backend server for the Bakery Website with Firebase integration.

## Features

- Google authentication with Firebase Auth
- Product management with Firebase Realtime Database
- Shopping cart functionality
- Order placement and management
- RESTful API architecture

## Setup Instructions

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Configure Firebase:
   - Make sure your Firebase project has Google Authentication enabled
   - Enable the Realtime Database in your Firebase project
   - Update the databaseURL in `config/firebase.config.js` if needed

4. Start the development server:
```
npm run dev
```

5. To initialize the database with sample data:
```
npm run init-db
```

## API Routes

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user information

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product by ID
- `GET /api/products/category/:category` - Get products by category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/place` - Place a new order
- `GET /api/orders/:id` - Get a specific order
- `GET /api/orders` - Get all orders for the current user

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-secret-key
NODE_ENV=development
INITIALIZE_DB=true
```