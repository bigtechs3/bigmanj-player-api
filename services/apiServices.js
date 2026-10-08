const axios = require('axios');

// --- 1. SEARCH YOUTUBE (Azby) ---
exports.searchYouTube = async (query) => {
    const response = await axios.get(`https://api.azbry.com/api/search/yts?q=${encodeURIComponent(query)}`);
    return response.data;
};

// --- 2. SEARCH SPOTIFY (ZellRayy) ---
exports.searchSpotify = async (query) => {
    const response = await axios.get(`https://zellrayy.com/search/spotify?q=${encodeURIComponent(query)}`);
    return response.data;
};

// --- 3. GET DOWNLOAD LINK FROM YOUTUBE ---
exports.getYtDownloadLink = async (youtubeUrl) => {
    const response = await axios.get(`https://api.azbry.com/api/download/ytmp3?url=${encodeURIComponent(youtubeUrl)}`);
    return response.data;
};

// --- 4. GET DOWNLOAD LINK FROM SPOTIFY ---
exports.getSpotifyDownloadLink = async (spotifyUrl) => {
    const response = await axios.get(`https://api.azbry.com/api/download/spotify?url=${encodeURIComponent(spotifyUrl)}`);
    return response.data;
};

// --- 5. GET LYRICS (Nexray) ---
exports.getLyrics = async (query) => {
    const response = await axios.get(`https://api.nexray.eu.cc/search/lyrics?q=${encodeURIComponent(query)}`);
    return response.data;
};

// --- 6. IDENTIFY SONG / SHAZAM (Nexray) ---
exports.identifySongByUrl = async (audioUrl) => {
    const response = await axios.get(`https://api.nexray.eu.cc/tools/whatsmusic?url=${encodeURIComponent(audioUrl)}`);
    return response.data;
};

// --- 7. GET TRENDING SONGS (Deezer) ---
exports.getTrendingSongs = async () => {
    // Using Deezer's free public API for trending charts
    const response = await axios.get('https://api.deezer.com/chart/0/tracks?limit=20');
    return response.data;
};