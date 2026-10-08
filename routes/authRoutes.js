const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
// We will uncomment these when we create the controller files in the next step!
// const authController = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// --- AUTH ROUTES ---
// Sync Firebase user with MongoDB (Called after user logs in or signs up on the app)
// router.post('/sync', authController.syncUser);

// Get current logged-in user's profile
// router.get('/me', protect, authController.getMe);

// --- TEST ROUTE ---
// Just to make sure the auth routes are working
router.get('/test', (req, res) => {
    res.json({ status: true, message: "Auth Routes are working perfectly! 🔐" });
});

module.exports = router;