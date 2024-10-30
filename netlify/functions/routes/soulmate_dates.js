const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');

const router = express.Router();

router.post('/getsoulmatedates', async (req, res) => {
    const { day, month, year, hour, min, city } = req.body;

    try {
        // Construct the URL with user parameters
        const url = `https://horoscopes.astro-seek.com/calculate-personal-tracker/?edit_input_data=1&send_calculation=1&muz_narozeni_den=${day}&muz_narozeni_mesic=${month}&muz_narozeni_rok=${year}&muz_narozeni_hodina=${hour}&muz_narozeni_minuta=${min}&muz_narozeni_city=${encodeURIComponent(city)}`;

        // Fetch the data from the URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Extract transits data from the first table
        const transits = [];
        const transitRows = $('table tbody tr'); // Select all rows in the first table

        // Start from the third row (index 2)
        transitRows.each((index, element) => {
            if (index < 2) return; // Skip the first two rows


            // Extract transits from year
            const LatLong = $(element).find('td').eq(0).text().trim(); // Transits from year
            const transitsFromYear = $(element).find('td').eq(2).text().trim(); // Transits from year

            // Push to transits array only if we have valid data
            if (transitsFromYear) {
                transits.push(
                    {
                        transitsFromYear,
                        LatLong
                    }
                );
            }
        });

        // Send the scraped data as the response
        res.json(transits);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;
