const mongoose = require('mongoose');

// Sub-schema for songs (used for Liked Songs and Recently Played)
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String },
    url: { type: String, required: true }, // The streaming/download URL
    videoId: { type: String, required: true }, // Unique identifier (e.g., YouTube ID)
    duration: { type: String }
});

// Main User Schema
const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true // Prevents duplicate accounts
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    likedSongs: [songSchema],
    recentlyPlayed: [songSchema],
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }]
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('User', userSchema);