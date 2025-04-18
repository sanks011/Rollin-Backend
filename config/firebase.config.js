const admin = require('firebase-admin');
const { getDatabase } = require('firebase/database');
const { initializeApp } = require('firebase/app');
require('dotenv').config();

// Regular Firebase configuration for database access
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

// Initialize regular Firebase for database
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Create a service account from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN
};

// Initialize admin with credential
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  console.error('Firebase Admin authentication will not work correctly');
}

module.exports = { 
  app: firebaseApp, 
  database,
  admin,
  auth: admin.auth() // Use admin auth for server-side token verification
};