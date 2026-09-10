const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const trackerRoutes = require('./routes/trackerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', trackerRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('YW Vineyard Tracker API is running.');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server active on http://localhost:${PORT}`);
  });
});