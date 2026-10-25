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

// --- NEW: STREAM AUDIO USING PIPED API (Bypasses YouTube bot block) ---
exports.streamAudio = async (req, res) => {
    try {
        const { videoId } = req.query;
        if (!videoId) return res.status(400).json({ error: "Video ID is required" });

        // We use Piped API to bypass YouTube's AWS bot block
        const instances = [
            'https://pipedapi.kavin.rocks',
            'https://pipedapi.adminforge.de',
            'https://api.piped.private.coffee',
            'https://pipedapi.reallyaweso.me'
        ];

        let audioUrl = null;

        for (const instance of instances) {
            try {
                const response = await axios.get(`${instance}/streams/${videoId}`);
                const audioStreams = response.data.audioStreams;
                if (audioStreams && audioStreams.length > 0) {
                    // Get the highest quality audio stream
                    audioUrl = audioStreams[0].url;
                    break; // Found a working URL, stop trying other instances
                }
            } catch (err) {
                console.log(`Piped instance ${instance} failed, trying next...`);
            }
        }

        if (!audioUrl) {
            return res.status(500).json({ error: "Could not find audio stream on any Piped instance" });
        }

        // Fetch the audio stream and pipe it to the user
        const streamResponse = await axios({
            method: 'get',
            url: audioUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Range': req.headers.range || 'bytes=0-'
            }
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        if (streamResponse.headers['content-length']) {
            res.setHeader('Content-Length', streamResponse.headers['content-length']);
        }
        if (streamResponse.headers['accept-ranges']) {
            res.setHeader('Accept-Ranges', streamResponse.headers['accept-ranges']);
        }
        
        streamResponse.data.pipe(res);

    } catch (error) {
        console.error("Stream Error:", error.message);
        res.status(500).json({ error: "Failed to stream audio" });
    }
};

exports.identifySong = async (req, res) => {
    res.json({ status: true, message: "Shazam feature coming soon!" });
};
