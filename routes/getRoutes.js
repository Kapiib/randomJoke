const express = require('express');
const router = express.Router();

const jokeController = require('../controllers/jokeController');
const pageController = require('../controllers/pageController');

// Page Routes Only
router.get('/', jokeController.renderHomePage);
router.get('/brukerveiledning', pageController.renderGuide);

module.exports = router;