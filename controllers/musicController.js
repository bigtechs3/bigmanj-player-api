const axios = require('axios'); // Make sure this is at the top of the file

exports.streamAudio = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: "URL is required" });

        // Fetch the audio from the CDN with browser headers
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.youtube.com/'
            }
        });

        // Set the content type and stream it to the app
        res.setHeader('Content-Type', 'audio/mpeg');
        response.data.pipe(res);

    } catch (error) {
        console.error("Stream Error:", error.message);
        res.status(500).json({ error: "Failed to stream audio" });
    }
};
