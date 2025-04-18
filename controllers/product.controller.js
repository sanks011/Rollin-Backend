const { database } = require('../config/firebase.config');
const { ref, get, query, orderByChild, equalTo } = require('firebase/database');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (!snapshot.exists()) {
      return res.status(200).json({ products: [] });
    }
    
    const products = [];
    snapshot.forEach(childSnapshot => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Get all products error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = ref(database, `products/${id}`);
    const snapshot = await get(productRef);
    
    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = {
      id: snapshot.key,
      ...snapshot.val()
    };
    
    return res.status(200).json({ product });
  } catch (error) {
    console.error('Get product by ID error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const productsRef = ref(database, 'products');
    const productsQuery = query(productsRef, orderByChild('category'), equalTo(category));
    const snapshot = await get(productsQuery);
    
    if (!snapshot.exists()) {
      return res.status(200).json({ products: [] });
    }
    
    const products = [];
    snapshot.forEach(childSnapshot => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Get products by category error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory
};