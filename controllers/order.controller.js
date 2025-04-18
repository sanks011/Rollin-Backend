const { database } = require('../config/firebase.config');
const { ref, get, set, push, query, orderByChild, equalTo } = require('firebase/database');

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { shippingAddress } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }
    
    // Get user cart
    const cartRef = ref(database, `carts/${userId}`);
    const cartSnapshot = await get(cartRef);
    
    if (!cartSnapshot.exists() || !cartSnapshot.val().items) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }
    
    const cartData = cartSnapshot.val();
    const items = [];
    let total = 0;
    
    // Process cart items with product details for the order
    for (const itemId in cartData.items) {
      const item = cartData.items[itemId];
      const productRef = ref(database, `products/${item.productId}`);
      const productSnapshot = await get(productRef);
      
      if (productSnapshot.exists()) {
        const product = productSnapshot.val();
        const itemTotal = item.quantity * product.price;
        
        items.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          itemTotal
        });
        
        total += itemTotal;
      }
    }
    
    if (items.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }
    
    // Create a new order
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    
    const order = {
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await set(newOrderRef, order);
    
    // Clear the user's cart after successful order
    await set(cartRef, {
      userId,
      items: {},
      updatedAt: new Date().toISOString()
    });
    
    return res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrderRef.key,
      order: {
        ...order,
        id: newOrderRef.key
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;
    
    const orderRef = ref(database, `orders/${id}`);
    const orderSnapshot = await get(orderRef);
    
    if (!orderSnapshot.exists()) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orderSnapshot.val();
    
    // Check if the order belongs to the current user
    if (order.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to access this order' });
    }
    
    return res.status(200).json({
      order: {
        ...order,
        id: orderSnapshot.key
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all orders for the current user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const ordersRef = ref(database, 'orders');
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
    const ordersSnapshot = await get(userOrdersQuery);
    
    if (!ordersSnapshot.exists()) {
      return res.status(200).json({ orders: [] });
    }
    
    const orders = [];
    
    ordersSnapshot.forEach(childSnapshot => {
      orders.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort orders by creation date, most recent first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getOrderById,
  getUserOrders
};