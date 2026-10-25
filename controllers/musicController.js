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

exports.streamAudio = async (req, res) => {
    try {
        const { videoId } = req.query;
        if (!videoId) return res.status(400).json({ error: "Video ID is required" });

        const instances = [
            'https://pipedapi.leptons.xyz',
            'https://piped-api.lunar.icu',
            'https://pipedapi.r4fo.com',
            'https://pipedapi.ngn.tf',
            'https://pipedapi.kavin.rocks',
            'https://pipedapi.adminforge.de'
        ];

        let audioUrl = null;
        let lastError = null;

        for (const instance of instances) {
            try {
                console.log(`Trying Piped instance: ${instance}`);
                const response = await axios.get(`${instance}/streams/${videoId}`, { timeout: 5000 });
                
                if (response.data && response.data.audioStreams && response.data.audioStreams.length > 0) {
                    audioUrl = response.data.audioStreams[0].url;
                    console.log(`Success with instance: ${instance}`);
                    break;
                }
            } catch (err) {
                console.log(`Piped instance ${instance} failed: ${err.message}`);
                lastError = err;
            }
        }

        if (!audioUrl) {
            console.error("All Piped instances failed. Last error:", lastError);
            return res.status(500).json({ error: "Could not find audio stream on any Piped instance" });
        }

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
