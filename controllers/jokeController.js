const { getRandomJoke } = require('../services/jokeService');

const jokeController = {
    // Get a random joke API endpoint
    getJoke: async (req, res) => {
        try {
            const joke = await getRandomJoke();
            res.json(joke);
        } catch (error) {
            console.error('Error fetching joke:', error);
            res.status(500).json({ error: 'Kunne ikke hente vitsen' });
        }
    },

    // Render home page with a joke
    renderHomePage: async (req, res) => {
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
    }
};

module.exports = jokeController;