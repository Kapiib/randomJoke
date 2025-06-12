const Rating = require('../models/Rating');

const ratingController = {
    // Submit a rating for a joke
    rateJoke: async (req, res) => {
        try {
            const { jokeId, rating } = req.body;
            
            if (!jokeId) {
                return res.status(400).json({ error: 'Mangler vits-ID' });
            }
            
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Vurderingen må være mellom 1 og 5 stjerner' });
            }
            
            // Find existing rating document or create new one
            const result = await Rating.findOneAndUpdate(
                { jokeId: jokeId },
                {
                    $inc: { 
                        totalRating: rating,
                        ratingCount: 1
                    }
                },
                {
                    new: true,
                    upsert: true,
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
    },

    // Get average rating for a joke
    getJokeRating: async (req, res) => {
        try {
            const { jokeId } = req.params;
            
            // Find rating document for this joke
            const ratingDoc = await Rating.findOne({ jokeId });
            
            if (!ratingDoc || ratingDoc.ratingCount === 0) {
                return res.json({ average: 0, count: 0 });
            }
            
            // Calculate the average
            const average = (ratingDoc.totalRating / ratingDoc.ratingCount).toFixed(1);
            
            res.json({
                average: average,
                count: ratingDoc.ratingCount
            });
        } catch (error) {
            console.error('Error fetching average rating:', error);
            res.status(500).json({ error: 'Kunne ikke hente gjennomsnittsvurdering' });
        }
    }
};

module.exports = ratingController;