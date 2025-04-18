const { auth } = require('../config/firebase.config');
const { ref, get } = require('firebase/database');
const { database } = require('../config/firebase.config');

const verifyToken = async (req, res, next) => {
  try {
    // Check for token in authorization header
    const authHeader = req.headers.authorization;
    let token = authHeader ? authHeader.split(' ')[1] : null;
    
    // If no token in header, check for session cookie
    if (!token && req.cookies) {
      token = req.cookies.session;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Handle different token formats
    if (token.startsWith('auth_')) {
      // Handle our custom simple token format
      try {
        const parts = token.split('_');
        if (parts.length >= 3) {
          const uid = parts[2];
          // Fetch user from database to verify
          const userRef = ref(database, `users/${uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            req.user = {
              uid,
              email: userData.email,
              name: userData.displayName,
              picture: userData.photoURL,
              ...userData
            };
            return next();
          } else {
            throw new Error('User not found');
          }
        } else {
          throw new Error('Invalid token format');
        }
      } catch (error) {
        console.error('Simple token verification failed:', error);
        return res.status(401).json({ message: 'Invalid authentication token' });
      }
    } else {
      // Try to verify as a Firebase token
      try {
        // Try as session cookie first
        let decodedClaims;
        if (req.cookies && req.cookies.session === token) {
          try {
            decodedClaims = await auth.verifySessionCookie(token, true);
          } catch (cookieError) {
            console.log('Not a valid session cookie, trying as ID token');
            decodedClaims = await auth.verifyIdToken(token);
          }
        } else {
          // Otherwise verify as an ID token
          decodedClaims = await auth.verifyIdToken(token);
        }
        
        req.user = decodedClaims;
        return next();
      } catch (firebaseError) {
        console.error('Firebase token verification failed:', firebaseError);
        
        // If Firebase verification fails, try to decode the token
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const encodedPayload = tokenParts[1];
            const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf8');
            const payload = JSON.parse(decodedPayload);
            
            const uid = payload.user_id || payload.sub;
            if (uid) {
              // Check if user exists in database
              const userRef = ref(database, `users/${uid}`);
              const snapshot = await get(userRef);
              
              if (snapshot.exists()) {
                const userData = snapshot.val();
                req.user = {
                  uid,
                  email: payload.email || userData.email,
                  name: payload.name || userData.displayName,
                  picture: payload.picture || userData.photoURL,
                  ...userData
                };
                return next();
              }
            }
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
        }
        
        return res.status(401).json({ message: 'Invalid or expired authentication token' });
      }
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};

module.exports = { verifyToken };