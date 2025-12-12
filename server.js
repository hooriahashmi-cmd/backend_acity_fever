require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database'); // ← CHANGED HERE
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));


app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});


app.get('/', (req, res) => {
  res.json({
    message: 'Bistro API is running',
    docs: '/api/health for health check'
  });
});


app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});


app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'All origins (*)'}`);
  console.log(`Database: Connected to PostgreSQL`);
});

module.exports = { app, pool };