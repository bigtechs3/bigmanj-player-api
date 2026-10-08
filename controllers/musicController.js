const apiServices = require('../services/apiServices');

// --- SEARCH SONG ---
exports.searchSong = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Please provide a search query" });
        }

        // Uses the service to search YouTube
        const data = await apiServices.searchYouTube(query);
        res.json(data);

    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
};

// --- GET LYRICS ---
exports.getLyrics = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Please provide a song name for lyrics" });
        }

        // Uses the service to get lyrics
        const data = await apiServices.getLyrics(query);
        res.json(data);

    } catch (error) {
        console.error("Lyrics Error:", error.message);
        res.status(500).json({ error: "Failed to fetch lyrics" });
    }
};

// --- GET TRENDING SONGS ---
exports.getTrending = async (req, res) => {
    try {
        const data = await apiServices.getTrendingSongs();
        res.json(data);
    } catch (error) {
        console.error("Trending Error:", error.message);
        res.status(500).json({ error: "Failed to fetch trending songs" });
    }
};

// --- SHAZAM / IDENTIFY SONG ---
exports.identifySong = async (req, res) => {
    try {
        // Placeholder - will be handled by shazamController
        res.json({ status: true, message: "Shazam feature coming soon!" });
    } catch (error) {
        console.error("Shazam Error:", error.message);
        res.status(500).json({ error: "Failed to identify song" });
    }
};