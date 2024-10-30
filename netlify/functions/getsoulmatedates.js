const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  try {
    // Parse the POST request body
    const { day, month, year, hour, min, city } = JSON.parse(event.body);

    // Construct the URL
    const url = `https://horoscopes.astro-seek.com/calculate-personal-tracker/?edit_input_data=1&send_calculation=1&muz_narozeni_den=${day}&muz_narozeni_mesic=${month}&muz_narozeni_rok=${year}&muz_narozeni_hodina=${hour}&muz_narozeni_minuta=${min}&muz_narozeni_city=${encodeURIComponent(city)}`;

    // Fetch the HTML from the URL
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract transits data
    const transits = [];
    const transitRows = $('table tbody tr');

    // Start from the third row
    transitRows.each((index, element) => {
      if (index < 2) return; // Skip first two rows

      // Extract the required data
      const LatLong = $(element).find('td').eq(0).text().trim();
      const transitsFromYear = $(element).find('td').eq(2).text().trim();

      // Add data to the transits array if valid
      if (transitsFromYear) {
        transits.push({ LatLong, transitsFromYear });
      }
    });

    // Return the transits data
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
      body: JSON.stringify(transits),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
