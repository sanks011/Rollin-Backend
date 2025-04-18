const { database } = require('./firebase.config');
const { ref, set } = require('firebase/database');

// Function to initialize the database with sample data
async function initializeDatabase() {
  try {
    console.log('Initializing database with sample data...');

    // Sample bakery products
    const products = {
      'product1': {
        name: 'Chocolate Cake',
        description: 'Delicious chocolate cake with rich frosting',
        price: 35.99,
        image: '/prod1.png',
        category: 'cakes',
        inStock: true
      },
      'product2': {
        name: 'Strawberry Cupcakes',
        description: 'Fresh strawberry cupcakes with cream cheese frosting',
        price: 3.99,
        image: '/prod2.png',
        category: 'cupcakes',
        inStock: true
      },
      'product3': {
        name: 'Blueberry Muffins',
        description: 'Moist blueberry muffins made with fresh berries',
        price: 2.99,
        image: '/prod3.png',
        category: 'muffins',
        inStock: true
      },
      'product4': {
        name: 'Vanilla Birthday Cake',
        description: 'Classic vanilla cake with colorful sprinkles',
        price: 30.99,
        image: '/2nd.png',
        category: 'cakes',
        inStock: true
      },
      'product5': {
        name: 'Chocolate Chip Cookies',
        description: 'Chewy chocolate chip cookies with walnuts',
        price: 1.99,
        image: '/4th.png',
        category: 'cookies',
        inStock: true
      },
      'product6': {
        name: 'French Baguette',
        description: 'Traditional crispy French baguette',
        price: 4.99,
        image: '/3rf.png',
        category: 'bread',
        inStock: true
      }
    };

    // Add products to the database
    const productsRef = ref(database, 'products');
    await set(productsRef, products);

    console.log('Database initialized successfully with sample data.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = { initializeDatabase };