const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Connect to PostgreSQL using Sequelize
const sequelize = new Sequelize('your-db', 'your-user', 'your-password', {
  host: 'database',  // The service name for your database container (from docker-compose)
  dialect: 'postgres',
  logging: console.log,
});

// Define a User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Sync the database (this will create the table if it doesn't exist)
sequelize.sync()
  .then(() => {
    console.log("Database synced!");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Middleware for parsing JSON
app.use(express.json());

// Simulating a simple data fetch
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Route to get all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new user to the database
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  // Simple validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
