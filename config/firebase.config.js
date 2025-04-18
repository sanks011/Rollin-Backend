const admin = require('firebase-admin');
const { getDatabase } = require('firebase/database');
const { initializeApp } = require('firebase/app');

// Regular Firebase configuration for database access
const firebaseConfig = {
  apiKey: "AIzaSyATR41dIILYkTwJgTWmcx91Lb_attz8vaw",
  authDomain: "bakery-de534.firebaseapp.com",
  projectId: "bakery-de534",
  storageBucket: "bakery-de534.firebasestorage.app",
  messagingSenderId: "443168470834",
  appId: "1:443168470834:web:52150fe8e87656ef64c92b",
  measurementId: "G-N28BE2605Q",
  databaseURL: "https://bakery-de534-default-rtdb.firebaseio.com"
};

// Initialize regular Firebase for database
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Initialize Firebase Admin SDK with a service account for authentication
// Load the service account key file with the correct name
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json.json'); // Fixed the file extension
} catch (error) {
  console.error('Service account key not found. Server-side auth verification will fail:', error.message);
  console.error('Please download the service account key from Firebase Console > Project Settings > Service Accounts');
  serviceAccount = null;
}

// Initialize admin with credential
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bakery-de534-default-rtdb.firebaseio.com"
  });
} else {
  // Initialize with default app config if no service account is available
  // Note: This won't work for verifying tokens but allows the server to start
  admin.initializeApp({
    databaseURL: "https://bakery-de534-default-rtdb.firebaseio.com"
  });
}

module.exports = { 
  app: firebaseApp, 
  database,
  admin,
  auth: admin.auth() // Use admin auth for server-side token verification
};