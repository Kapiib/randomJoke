const axios = require('axios');
require('dotenv').config();

const getRandomJoke = async () => {
  try {
    const response = await axios.get(process.env.API);
    return response.data;
  } catch (error) {
    console.error('Error fetching joke:', error);
    return { 
      setup: 'Kunne ikke hente vitsen', 
      punchline: 'Prøv igjen senere' 
    };
  }
};

module.exports = { getRandomJoke };