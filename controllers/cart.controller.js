const { database } = require('../config/firebase.config');
const { ref, get, set, update, remove, push } = require('firebase/database');

// Get user cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartRef = ref(database, `carts/${userId}`);
    const snapshot = await get(cartRef);
    
    if (!snapshot.exists()) {
      return res.status(200).json({ cart: [], total: 0 });
    }
    
    const cartData = snapshot.val();
    const items = [];
    let total = 0;
    
    // Process cart items with product details
    for (const itemId in cartData.items) {
      const item = cartData.items[itemId];
      const productRef = ref(database, `products/${item.productId}`);
      const productSnapshot = await get(productRef);
      
      if (productSnapshot.exists()) {
        const product = productSnapshot.val();
        const itemTotal = item.quantity * product.price;
        
        items.push({
          id: itemId,
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
          itemTotal
        });
        
        total += itemTotal;
      }
    }
    
    return res.status(200).json({
      cart: items,
      total
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Check if product exists
    const productRef = ref(database, `products/${productId}`);
    const productSnapshot = await get(productRef);
    
    if (!productSnapshot.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has a cart
    const cartRef = ref(database, `carts/${userId}`);
    const cartSnapshot = await get(cartRef);
    
    if (!cartSnapshot.exists()) {
      // Create new cart
      await set(cartRef, {
        userId,
        items: {},
        updatedAt: new Date().toISOString()
      });
    }
    
    // Check if product already exists in cart
    const itemsRef = ref(database, `carts/${userId}/items`);
    const itemsSnapshot = await get(itemsRef);
    let existingItemId = null;
    
    if (itemsSnapshot.exists()) {
      itemsSnapshot.forEach(childSnapshot => {
        const item = childSnapshot.val();
        if (item.productId === productId) {
          existingItemId = childSnapshot.key;
        }
      });
    }
    
    if (existingItemId) {
      // Update existing item
      const itemRef = ref(database, `carts/${userId}/items/${existingItemId}`);
      const itemSnapshot = await get(itemRef);
      const currentQuantity = itemSnapshot.val().quantity || 0;
      
      await update(itemRef, {
        quantity: currentQuantity + quantity
      });
    } else {
      // Add new item
      const newItemRef = push(ref(database, `carts/${userId}/items`));
      await set(newItemRef, {
        productId,
        quantity
      });
    }
    
    // Update cart timestamp
    await update(cartRef, {
      updatedAt: new Date().toISOString()
    });
    
    // Return updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }
    
    // Check if item exists in cart
    const itemRef = ref(database, `carts/${userId}/items/${itemId}`);
    const itemSnapshot = await get(itemRef);
    
    if (!itemSnapshot.exists()) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update item quantity
    await update(itemRef, { quantity });
    
    // Update cart timestamp
    const cartRef = ref(database, `carts/${userId}`);
    await update(cartRef, {
      updatedAt: new Date().toISOString()
    });
    
    // Return updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    
    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    
    // Check if item exists in cart
    const itemRef = ref(database, `carts/${userId}/items/${itemId}`);
    const itemSnapshot = await get(itemRef);
    
    if (!itemSnapshot.exists()) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Remove item
    await remove(itemRef);
    
    // Update cart timestamp
    const cartRef = ref(database, `carts/${userId}`);
    await update(cartRef, {
      updatedAt: new Date().toISOString()
    });
    
    // Return updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Check if cart exists
    const cartRef = ref(database, `carts/${userId}`);
    const cartSnapshot = await get(cartRef);
    
    if (!cartSnapshot.exists()) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Clear items but keep cart
    await set(cartRef, {
      userId,
      items: {},
      updatedAt: new Date().toISOString()
    });
    
    return res.status(200).json({
      message: 'Cart cleared successfully',
      cart: [],
      total: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};