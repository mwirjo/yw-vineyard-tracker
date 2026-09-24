const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

const { connectDB } = require('./config/db');
const trackerRoutes = require('./routes/trackerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api', trackerRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('YW Vineyard Tracker API is running.');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server active on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
});