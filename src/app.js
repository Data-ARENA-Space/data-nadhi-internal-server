const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/', routes);
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message
  });
});

module.exports = app;