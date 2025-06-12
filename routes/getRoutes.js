const express = require('express');
const router = express.Router();
const { getRandomJoke } = require('../services/jokeService');
const Rating = require('../models/Rating');

router.get('/', async (req, res) => {
    try {
        const joke = await getRandomJoke();
        res.render('index', { joke });
    } catch (error) {
        console.error('Error rendering joke:', error);
        res.render('index', { joke: { 
            id: 'error',
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

// Get average rating for a joke
router.get('/api/rating/:jokeId', async (req, res) => {
    try {
        const { jokeId } = req.params;
        
        // Find rating document for this joke
        const ratingDoc = await Rating.findOne({ jokeId });
        
        if (!ratingDoc || ratingDoc.ratingCount === 0) {
            return res.json({ average: 0, count: 0 });
        }
        
        // Calculate the average from stored values
        const average = (ratingDoc.totalRating / ratingDoc.ratingCount).toFixed(1);
        
        res.json({
            average: average,
            count: ratingDoc.ratingCount
        });
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ error: 'Kunne ikke hente gjennomsnittsvurdering' });
    }
});

// New rating endpoint
router.post('/api/rate', async (req, res) => {
    try {
        const { jokeId, rating } = req.body;
        
        if (!jokeId) {
            return res.status(400).json({ error: 'Mangler vits-ID' });
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Vurderingen må være mellom 1 og 5 stjerner' });
        }
        
        // Find existing rating document or create new one using findOneAndUpdate
        const result = await Rating.findOneAndUpdate(
            { jokeId: jokeId },
            {
                // If it exists, increment values
                $inc: { 
                    totalRating: rating,
                    ratingCount: 1
                }
            },
            {
                new: true,        // Return updated document
                upsert: true,     // Create if doesn't exist
            }
        );
        
        // Calculate average
        const average = (result.totalRating / result.ratingCount).toFixed(1);
        
        res.status(201).json({ 
            message: 'Vurdering lagret',
            average: average,
            count: result.ratingCount
        });
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ 
            error: 'Kunne ikke lagre vurdering', 
            message: 'Det oppstod en feil ved lagring av din vurdering. Prøv igjen senere.' 
        });
    }
});

// Add this route before module.exports
router.get('/brukerveiledning', (req, res) => {
    try {
        res.render('guide');
    } catch (error) {
        console.error('Error rendering user guide:', error);
        res.status(500).send('Kunne ikke laste brukerveiledningen');
    }
});

// Add this route at the end, before module.exports
router.get('/api/test-rate-limit', (req, res) => {
  console.log(`Test rate limit accessed at ${new Date().toISOString()}`);
  res.json({ success: true, message: 'This route is rate limited', time: new Date().toISOString() });
});

module.exports = router;