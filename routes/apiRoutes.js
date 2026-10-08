const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
const musicController = require('../controllers/musicController');
const shazamController = require('../controllers/shazamController');

// --- TEST ROUTE ---
router.get('/test', (req, res) => {
    res.json({ status: true, message: "API Routes are working perfectly!" });
});

// --- APP ROUTES ---
router.get('/search', musicController.searchSong);
router.get('/lyrics', musicController.getLyrics);
router.get('/trending', musicController.getTrending); // <-- NEW TRENDING ROUTE

// The shazam route uses the multer middleware to handle the audio upload
router.post('/shazam', shazamController.uploadAudio, shazamController.identifySong);

module.exports = router;