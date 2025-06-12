const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokeController');
const pageController = require('../controllers/pageController');

// Page rendering routes
router.get('/', jokeController.renderHomePage);
router.get('/brukerveiledning', pageController.renderGuide);

module.exports = router;