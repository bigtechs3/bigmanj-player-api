const User = require('../models/User');

// --- SYNC USER (AUTH) ---
// Called after Firebase login to ensure the user exists in MongoDB.
// The authMiddleware decodes the Firebase token and puts the user data in req.user
exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        if (!uid || !email) {
            return res.status(400).json({ error: "Invalid token payload. Missing uid or email." });
        }

        // Check if user already exists in MongoDB
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // Create new user
            user = await User.create({
                firebaseUid: uid,
                email: email,
                username: name || email.split('@')[0], // Default username from email
                avatar: picture || "",
                likedSongs: [],
                recentlyPlayed: []
            });
        } else {
            // Update user profile with latest Firebase data
            user.email = email;
            if (name) user.username = name;
            if (picture) user.avatar = picture;
            await user.save();
        }

        res.json({ status: true, message: "User authenticated & synced", user });

    } catch (error) {
        console.error("Auth Sync Error:", error.message);
        res.status(500).json({ error: "Failed to sync user authentication" });
    }
};

// --- GET CURRENT USER ---
// Returns the logged-in user's profile and populated playlists
exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid }).populate('playlists');
        
        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

        res.json({ status: true, user });

    } catch (error) {
        console.error("Get Me Error:", error.message);
        res.status(500).json({ error: "Failed to get user profile" });
    }
};