const axios = require('axios');

// --- SEARCH SONG ---
// This handles searching for songs using the Azbry API you found
exports.searchSong = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Please provide a search query" });
        }

        // Calling the Azbry YouTube Search API
        const response = await axios.get(`https://api.azbry.com/api/search/yts?q=${query}`);
        
        // Sending the data back to your app
        res.json(response.data);

    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
};

// --- GET LYRICS ---
// This handles fetching lyrics using the Nexray API you found
exports.getLyrics = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Please provide a song name for lyrics" });
        }

        // Calling the Nexray Lyrics API
        const response = await axios.get(`https://api.nexray.eu.cc/search/lyrics?q=${query}`);
        
        // Sending the lyrics data back to your app
        res.json(response.data);

    } catch (error) {
        console.error("Lyrics Error:", error.message);
        res.status(500).json({ error: "Failed to fetch lyrics" });
    }
};

// --- SHAZAM / IDENTIFY SONG ---
// This is a placeholder for the Shazam feature. We will add file uploads later.
exports.identifySong = async (req, res) => {
    try {
        // For now, just return a message. We will integrate the audio upload logic in the next phase.
        res.json({ status: true, message: "Shazam feature coming soon!" });
    } catch (error) {
        console.error("Shazam Error:", error.message);
        res.status(500).json({ error: "Failed to identify song" });
    }
};