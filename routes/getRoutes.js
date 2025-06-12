const express = require('express');
const router = express.Router();
const { getRandomJoke } = require('../services/jokeService');

router.get('/', async (req, res) => {
    try {
        const joke = await getRandomJoke();
        res.render('index', { joke });
    } catch (error) {
        console.error('Error rendering joke:', error);
        res.render('index', { joke: { 
            setup: 'Kunne ikke hente vitsen', 
            punchline: 'Prøv igjen senere' 
        }});
    }
});

router.get('/api/joke', async (req, res) => {
    try {
        const joke = await getRandomJoke();
        res.json(joke);
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.status(500).json({ error: 'Kunne ikke hente vitsen' });
    }
});

module.exports = router;