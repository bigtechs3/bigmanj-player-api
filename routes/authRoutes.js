const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
    res.json({ status: true, message: "Auth Routes are working perfectly! 🔐" });
});

router.post('/sync', protect, authController.syncUser);
router.get('/me', protect, authController.getMe);

module.exports = router;
