const express = require('express');
const axios = require('axios');

// Create an Express Router
const router = express.Router();

// API Endpoint to get data based on user-provided location
router.get('/getcountries', async (req, res) => {
  try {
    // Extract the location term from query parameters
    const { term } = req.query;

    // Validate that a location was provided
    if (!term) {
      return res.status(400).json({ message: 'Location term is required as a query parameter' });
    }

    // Fetch the data from the external API using the provided term
    const url = `https://horoscopes.astro-seek.com/api_gmaps3.php?disable_manual=2&term=${encodeURIComponent(term)}`;
    const { data } = await axios.get(url);
    
    // Respond with the data
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
});

module.exports = router;
