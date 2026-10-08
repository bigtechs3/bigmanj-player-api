const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Now fully imported!

// --- TEST ROUTE ---
router.get('/test', (req, res) => {
    res.json({ status: true, message: "Auth Routes are working perfectly! 🔐" });
});

// --- AUTH ROUTES ---
// Sync route now uses 'protect' because it needs req.user from the token
router.post('/sync', protect, authController.syncUser);

// Get current user profile (Protected)
router.get('/me', protect, authController.getMe);

module.exports = router;