const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');
const ratingController = require('../controllers/ratingController');
const pageController = require('../controllers/pageController');

// API endpoints
router.get('/joke', jokeController.getJoke);
router.post('/rate', ratingController.rateJoke);
router.get('/rating/:jokeId', ratingController.getJokeRating);
router.get('/test-rate-limit', pageController.testRateLimit);

module.exports = router;