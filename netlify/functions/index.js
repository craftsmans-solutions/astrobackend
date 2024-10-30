const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;

// Import the countries route
const countriesRoute = require('./countries');
const soulmateDatesRoutes = require('./soulmate_dates');

app.use(cors());
app.use(express.json());

// Use the countries route
app.use('/api', countriesRoute);
app.use('/api', soulmateDatesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
