const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 1. Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Initialize the Express app
const app = express();

// 4. Middleware 
// CORS allows your mobile app to talk to this backend
// express.json() allows your backend to read JSON data sent from the app
app.use(cors());
app.use(express.json());

// 5. Test Route (To make sure your server is alive when you visit the URL)
app.get('/', (req, res) => {
    res.send('Bigmanj Player API is running... 🚀');
});

// 6. Main API Routes
app.use('/api', require('./routes/apiRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// 7. Error Handling Middleware (MUST BE LAST)
app.use(notFound);
app.use(errorHandler);

// 8. Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});