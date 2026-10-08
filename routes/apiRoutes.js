const express = require('express');
const router = express.Router();

// --- CONTROLLER IMPORTS ---
// We will uncomment these when we create the controller files in the next step!
// const musicController = require('../controllers/musicController');
// const shazamController = require('../controllers/shazamController');

// --- TEST ROUTE ---
// This just makes sure the routes are working
router.get('/test', (req, res) => {
    res.json({ status: true, message: "API Routes are working perfectly!" });
});

// --- APP ROUTES (Ready for the next step) ---
// router.get('/search', musicController.searchSong);
// router.get('/lyrics', musicController.getLyrics);
// router.post('/shazam', shazamController.identifySong);

module.exports = router;