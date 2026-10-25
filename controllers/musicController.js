const apiServices = require('../services/apiServices');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// --- STREAM AUDIO DIRECTLY FROM AWS USING YT-DLP + PO TOKEN PROVIDER ---
exports.streamAudio = async (req, res) => {
    try {
        const { videoId } = req.query;
        if (!videoId) return res.status(400).json({ error: "Video ID is required" });

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const outputPath = path.join(__dirname, `../temp_${videoId}.mp3`);

        // Command uses Node runtime and local Docker PO Token Provider
        const command = `yt-dlp -x --audio-format mp3 --js-runtimes node --extractor-args "youtubepot-bgutilhttp:base_url=http://127.0.0.1:4416" -o "${outputPath}" "${videoUrl}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`yt-dlp error: ${error.message}`);
                console.error(`yt-dlp stderr: ${stderr}`);
                return res.status(500).json({ error: "Failed to download audio" });
            }

            // Send the file to the app
            res.sendFile(outputPath, (err) => {
                // Delete the file after sending to save space
                if (!err) {
                    fs.unlink(outputPath, (unlinkErr) => {
                        if (unlinkErr) console.error("Failed to delete temp file:", unlinkErr);
                    });
                }
            });
        });

    } catch (error) {
        console.error("Stream Error:", error.message);
        res.status(500).json({ error: "Failed to stream audio" });
    }
};

exports.identifySong = async (req, res) => {
    res.json({ status: true, message: "Shazam feature coming soon!" });
};
