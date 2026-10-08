const User = require('../models/User');
const Playlist = require('../models/Playlist');

// --- SYNC USER ---
// Called when a user logs in or signs up via Firebase
// It creates a new user in MongoDB if they don't exist, or returns the existing one
exports.syncUser = async (req, res) => {
    try {
        const { firebaseUid, email, username, avatar } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({ error: "Missing required fields (firebaseUid, email)" });
        }

        // Check if user already exists
        let user = await User.findOne({ firebaseUid });

        if (user) {
            // Update username/avatar if they changed
            if (username) user.username = username;
            if (avatar) user.avatar = avatar;
            await user.save();
            return res.json({ status: true, message: "User synced successfully", user });
        }

        // Create new user
        user = await User.create({
            firebaseUid,
            email,
            username: username || email.split('@')[0], // Default username from email
            avatar: avatar || "",
            likedSongs: [],
            recentlyPlayed: []
        });

        res.status(201).json({ status: true, message: "User created successfully", user });

    } catch (error) {
        console.error("Sync User Error:", error.message);
        res.status(500).json({ error: "Failed to sync user" });
    }
};

// --- GET USER PROFILE ---
// Uses the firebaseUid from the auth middleware to get the user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid }).populate('playlists');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ status: true, user });

    } catch (error) {
        console.error("Get Profile Error:", error.message);
        res.status(500).json({ error: "Failed to get profile" });
    }
};

// --- TOGGLE LIKE SONG ---
// Adds a song to Liked Songs if it's not there, removes it if it is
exports.toggleLikeSong = async (req, res) => {
    try {
        const { songData } = req.body; // { title, artist, cover, url, videoId, duration }
        
        if (!songData || !songData.videoId) {
            return res.status(400).json({ error: "Song data is required" });
        }

        const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if song is already liked
        const isLiked = user.likedSongs.some(song => song.videoId === songData.videoId);

        if (isLiked) {
            // Remove it
            user.likedSongs = user.likedSongs.filter(song => song.videoId !== songData.videoId);
        } else {
            // Add it
            user.likedSongs.push(songData);
        }

        await user.save();
        res.json({ status: true, message: isLiked ? "Song unliked" : "Song liked", likedSongs: user.likedSongs });

    } catch (error) {
        console.error("Toggle Like Error:", error.message);
        res.status(500).json({ error: "Failed to toggle like" });
    }
};

// --- CREATE PLAYLIST ---
exports.createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Playlist name is required" });

        const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newPlaylist = await Playlist.create({
            userId: user._id,
            name,
            songs: []
        });

        user.playlists.push(newPlaylist._id);
        await user.save();

        res.status(201).json({ status: true, message: "Playlist created", playlist: newPlaylist });

    } catch (error) {
        console.error("Create Playlist Error:", error.message);
        res.status(500).json({ error: "Failed to create playlist" });
    }
};