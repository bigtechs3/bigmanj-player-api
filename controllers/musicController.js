const apiServices = require('../services/apiServices');

exports.searchSong = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Please provide a search query" });
        const data = await apiServices.searchYouTube(query);
        res.json(data);
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
};

exports.getLyrics = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: "Please provide a song name" });
        const data = await apiServices.getLyrics(query);
        res.json(data);
    } catch (error) {
        console.error("Lyrics Error:", error.message);
        res.status(500).json({ error: "Failed to fetch lyrics" });
    }
};

exports.getTrending = async (req, res) => {
    try {
        const data = await apiServices.getTrendingSongs();
        res.json(data);
    } catch (error) {
        console.error("Trending Error:", error.message);
        res.status(500).json({ error: "Failed to fetch trending songs" });
    }
};

// --- NEW: GET DOWNLOAD LINK ---
exports.getDownloadLink = async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).json({ error: "Video URL is required" });

        const data = await apiServices.getYtDownloadLink(videoUrl);
        res.json(data);
    } catch (error) {
        console.error("Download Link Error:", error.message);
        res.status(500).json({ error: "Failed to get MP3 link" });
    }
};

exports.identifySong = async (req, res) => {
    res.json({ status: true, message: "Shazam feature coming soon!" });
};
