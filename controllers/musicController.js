const apiServices = require('../services/apiServices');
const axios = require('axios');

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

// --- UPDATED PROXY STREAM FUNCTION ---
exports.streamAudio = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "URL is required" });

        // Prepare headers for the CDN request
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.youtube.com/'
        };

        // Forward the Range header from the browser to the CDN (for streaming)
        if (req.headers.range) {
            headers.Range = req.headers.range;
        }

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: headers
        });

        // Forward the CDN's headers back to the browser
        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        if (response.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', response.headers['accept-ranges']);
        }
        
        // Set the status code (200 or 206 for partial content)
        res.status(response.status);

        // Pipe the audio data
        response.data.pipe(res);

    } catch (error) {
        console.error("Stream Error:", error.message);
        const status = error.response ? error.response.status : 500;
        res.status(status).json({ error: "Failed to stream audio", details: error.message });
    }
};

exports.identifySong = async (req, res) => {
    res.json({ status: true, message: "Shazam feature coming soon!" });
};
