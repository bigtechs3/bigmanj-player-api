const mongoose = require('mongoose');

// Sub-schema for songs inside a playlist
const playlistSongSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String },
    url: { type: String, required: true },
    videoId: { type: String, required: true },
    duration: { type: String }
});

// Main Playlist Schema
const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this playlist to a specific user
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    songs: [playlistSongSchema],
    coverImage: {
        type: String,
        default: "" // Will use the first song's cover if empty
    }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);