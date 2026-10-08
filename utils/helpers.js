// --- 1. FORMAT DURATION ---
// Converts raw seconds (e.g., 218) into a readable format (e.g., "3:38")
const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- 2. EXTRACT YOUTUBE VIDEO ID ---
// Pulls the video ID out of a YouTube URL
// Example: "https://youtu.be/xJ2Lm8lV280" -> "xJ2Lm8lV280"
const extractYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// --- 3. CLEAN SEARCH QUERY ---
// Removes extra spaces from the user's search
// Example: "  Superficial   love  " -> "Superficial love"
const cleanQuery = (query) => {
    if (!query) return "";
    return query.trim().replace(/\s+/g, ' ');
};

// --- 4. GENERATE RANDOM STRING ---
// Useful if you ever need a random ID for a temporary file or token
const generateRandomString = (length = 10) => {
    return Math.random().toString(36).substring(2, 2 + length);
};

module.exports = {
    formatDuration,
    extractYouTubeId,
    cleanQuery,
    generateRandomString
};