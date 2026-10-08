const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
const authController = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware'); // We will uncomment this when we build the middleware

// --- TEST ROUTE ---
router.get('/test', (req, res) => {
    res.json({ status: true, message: "Auth Routes are working perfectly! 🔐" });
});

// --- AUTH ROUTES ---
router.post('/sync', authController.syncUser);
router.get('/me', authController.getMe);

module.exports = router;