const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, room_number } = req.body;

    if (!email || !name || !password || !room_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, name, password, room_number) VALUES ($1, $2, $3, $4) RETURNING id, email, name, room_number',
      [email, name, hashedPassword, room_number]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        room_number: user.room_number
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        room_number: user.room_number
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check hardcoded credentials (or query database)
    const validAdmins = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager123' }
    ];

    const admin = validAdmins.find(a => a.username === username && a.password === password);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      admin: { username },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

module.exports = router;
