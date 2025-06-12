const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const apiRateLimiter = require('./middleware/rateLimitMiddleware'); // Import the rate limiter
require('dotenv').config();

// Import routes
const connectDB = require('./db/dbConfig');
const getRoutes = require('./routes/getRoutes');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.set('trust proxy', 1);

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rate-limiting middleware
app.use('/api', apiRateLimiter);

// Routes
app.use('/api', apiRoutes);
app.use('/', getRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});