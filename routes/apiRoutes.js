const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
const musicController = require('../controllers/musicController');

// --- TEST ROUTE ---
router.get('/test', (req, res) => {
    res.json({ status: true, message: "API Routes are working perfectly!" });
});

// --- APP ROUTES ---
router.get('/search', musicController.searchSong);
router.get('/lyrics', musicController.getLyrics);
router.post('/shazam', musicController.identifySong);

module.exports = router;