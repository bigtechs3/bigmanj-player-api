const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');

// Set up multer to temporarily save the uploaded audio file on the server
const upload = multer({ dest: 'uploads/' });

// Export the multer middleware so the route can use it
exports.uploadAudio = upload.single('audio');

// --- IDENTIFY SONG (SHAZAM FEATURE) ---
exports.identifySong = async (req, res) => {
    try {
        // 1. Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "Please upload an audio file" });
        }

        // 2. Upload the temporary file to Uguu.se to get a public URL
        // (The Nexray API requires a URL, not a direct file upload)
        const formData = new FormData();
        formData.append('files[]', fs.createReadStream(req.file.path));

        const uguuResponse = await axios.post('https://uguu.se/upload.php', formData, {
            headers: formData.getHeaders()
        });

        const fileUrl = uguuResponse.data.files[0].url;

        // 3. Send the URL to the Nexray Shazam API
        const nexrayResponse = await axios.get(`https://api.nexray.eu.cc/tools/whatsmusic?url=${encodeURIComponent(fileUrl)}`);

        // 4. Delete the temporary file from our server to save space
        fs.unlinkSync(req.file.path);

        // 5. Send the identified song data back to the app
        res.json(nexrayResponse.data);

    } catch (error) {
        console.error("Shazam Error:", error.message);
        // Clean up file if it exists and an error occurred
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Failed to identify song" });
    }
};