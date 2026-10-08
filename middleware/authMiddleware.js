const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
// NOTE: You will need to add your Firebase Service Account key to your .env file later.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // The private key needs newlines replaced
                privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            }),
        });
    } catch (error) {
        console.error('❌ Firebase admin initialization error:', error.stack);
    }
}

// --- PROTECT MIDDLEWARE ---
// Verifies the Firebase token sent from the mobile app
const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            // Add user data to the request object
            req.user = decodedToken;

            next(); // Let them pass to the controller

        } catch (error) {
            console.error('❌ Token verification error:', error.message);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };