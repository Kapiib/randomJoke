const axios = require('axios');
require('dotenv').config();

const getRandomJoke = async () => {
  try {
    const response = await axios.get(process.env.API);
    // Make sure we have an ID for the joke
    return {
      id: response.data.id || Math.random().toString(36).substring(2, 15),
      setup: response.data.setup,
      punchline: response.data.punchline
    };
  } catch (error) {
    console.error('Error fetching joke:', error);
    return { 
      id: 'error-' + Date.now(),
      setup: 'Kunne ikke hente vitsen', 
      punchline: 'Prøv igjen senere' 
    };
  }
};

module.exports = { getRandomJoke };