const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // Only allow POST method for this endpoint
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',   // Allow all origins, you can limit this to specific domains if needed
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
      },
      body: '',
    };
  }

  try {
    const { day, month, year, hour, min, city } = JSON.parse(event.body);

    const url = `https://horoscopes.astro-seek.com/calculate-personal-tracker/?edit_input_data=1&send_calculation=1&muz_narozeni_den=${day}&muz_narozeni_mesic=${month}&muz_narozeni_rok=${year}&muz_narozeni_hodina=${hour}&muz_narozeni_minuta=${min}&muz_narozeni_city=${encodeURIComponent(city)}`;
    
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const transits = [];
    const transitRows = $('table tbody tr');

    transitRows.each((index, element) => {
      if (index < 2) return;

      const LatLong = $(element).find('td').eq(0).text().trim();
      const transitsFromYear = $(element).find('td').eq(2).text().trim();

      if (transitsFromYear) {
        transits.push({ LatLong, transitsFromYear });
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',   // Allow all origins
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
