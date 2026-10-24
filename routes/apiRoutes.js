const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const shazamController = require('../controllers/shazamController');

router.get('/test', (req, res) => res.json({ status: true, message: "API Routes are working perfectly!" }));

router.get('/search', musicController.searchSong);
router.get('/lyrics', musicController.getLyrics);
router.get('/trending', musicController.getTrending);
router.get('/download', musicController.getDownloadLink); // <-- NEW ROUTE
router.post('/shazam', shazamController.uploadAudio, shazamController.identifySong);

module.exports = router;
