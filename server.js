const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Initialize the Express app
const app = express();

// 4. Middleware (Allows your app to talk to the backend & parse JSON)
app.use(cors());
app.use(express.json());

// 5. Test Route (To make sure your server is alive)
app.get('/', (req, res) => {
    res.send('Bigmanj Player API is running... 🚀');
});

// 6. We will add your main routes here later:
// app.use('/api', require('./routes/apiRoutes'));

// 7. Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});