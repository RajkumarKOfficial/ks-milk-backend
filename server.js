// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// API endpoint for placing order
app.post('/order', async (req, res) => {
  const { customerName, address, landmark, quantity } = req.body; // add landmark here

  try {
    const newOrder = await pool.query(
      'INSERT INTO orders (customer_name, address, landmark, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [customerName, address, landmark, quantity]
    );
    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('KS MILK Backend is Running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
