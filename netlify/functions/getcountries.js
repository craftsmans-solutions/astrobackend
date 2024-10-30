const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Parse query parameters from event
    const { term } = event.queryStringParameters;

    // Validate that the term was provided
    if (!term) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Location term is required as a query parameter' }),
      };
    }

    // Make API call to fetch countries data
    const url = `https://horoscopes.astro-seek.com/api_gmaps3.php?disable_manual=2&term=${encodeURIComponent(term)}`;
    const { data } = await axios.get(url);

    // Return the fetched data
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Error retrieving data' }),
    };
  }
};
