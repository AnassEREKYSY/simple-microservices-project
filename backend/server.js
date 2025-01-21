const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors({ origin: '*' })); 

// Environment variable to determine if we're running in Docker or locally
const dbHost = process.env.DB_HOST || 'localhost'; // Use localhost if running locally

// Enable CORS for all routes
app.use(cors());

// Connect to PostgreSQL using Sequelize
const sequelize = new Sequelize('your-db', 'your-user', 'your-password', {
  host: dbHost,  // Host depends on the environment (Docker or Local)
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

// Sync the database
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced!');
    User.count().then(count => {
      console.log(`There are ${count} users in the database.`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

// Middleware for parsing JSON
app.use(express.json());

// Define API routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/users', async (req, res) => {
  console.log("Request received for /api/users");
  try {
    const users = await User.findAll();
    console.log("Users fetched:", users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

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

// Export the app and sequelize for testing
module.exports = { app, sequelize };

// Only start the server if the file is run directly (not when required in tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
  });
}
