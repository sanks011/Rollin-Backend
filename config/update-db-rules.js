const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const fs = require('fs');
const path = require('path');
const firebaseConfig = require('./firebase.config');

// Function to update database rules
async function updateDatabaseRules() {
  try {
    console.log('Reading database rules from file...');
    const rulesFilePath = path.join(__dirname, 'database-rules.json');
    
    // Check if the rules file exists
    if (!fs.existsSync(rulesFilePath)) {
      console.error('Database rules file not found.');
      return;
    }
    
    // Read the rules from the file
    const rulesJson = fs.readFileSync(rulesFilePath, 'utf8');
    const rules = JSON.parse(rulesJson);
    
    console.log('Rules loaded successfully. Connecting to Firebase...');
    
    // Initialize Firebase Admin SDK
    const admin = require('firebase-admin');
    
    // Check if app is already initialized
    let adminApp;
    try {
      adminApp = admin.app();
    } catch (e) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'service-account-email@example.com',
          // The private key must be replaced with the actual key
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        }),
        databaseURL: firebaseConfig.databaseURL
      });
    }
    
    console.log('Updating database rules...');
    
    // Update the database rules
    await admin.database().setRules(rules);
    
    console.log('Database rules updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database rules:', error);
    process.exit(1);
  }
}

// Alternative method using REST API if Admin SDK doesn't work
async function updateRulesViaRestApi() {
  try {
    console.log('Reading database rules from file...');
    const rulesFilePath = path.join(__dirname, 'database-rules.json');
    
    // Check if the rules file exists
    if (!fs.existsSync(rulesFilePath)) {
      console.error('Database rules file not found.');
      return;
    }
    
    // Read the rules from the file
    const rulesJson = fs.readFileSync(rulesFilePath, 'utf8');
    
    console.log('Rules loaded successfully. Preparing to update via API...');
    console.log('To update the rules:');
    console.log('1. Go to your Firebase console: https://console.firebase.google.com/');
    console.log('2. Select your project: bakery-de534');
    console.log('3. Go to "Realtime Database" from the left menu');
    console.log('4. Click on "Rules" tab');
    console.log('5. Replace the content with the following:');
    console.log('\n' + rulesJson + '\n');
    console.log('6. Click "Publish" button to apply the changes');
    
    console.log('\nAlternatively, you can use the Firebase CLI:');
    console.log('1. Install Firebase CLI: npm install -g firebase-tools');
    console.log('2. Login to Firebase: firebase login');
    console.log('3. Run: firebase database:update / database-rules.json --project=bakery-de534');
    
  } catch (error) {
    console.error('Error preparing rules update instructions:', error);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node update-db-rules.js [--api]');
  console.log('  --api    Show instructions for manual update via Firebase Console');
  process.exit(0);
} else if (args.includes('--api')) {
  updateRulesViaRestApi();
} else {
  updateDatabaseRules();
}