const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const promClient = require('prom-client');  // Import Prometheus client

const app = express();
const port = 3000;
app.use(cors({ origin: '*' }));

// Environment variable to determine if we're running in Docker or locally
const dbHost = process.env.DB_HOST || 'localhost'; // Use localhost if running locally

// Set up Prometheus metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });  // Collect default metrics like memory, CPU, etc.

// Define custom metrics for your application (e.g., API requests counter)
const apiRequests = new promClient.Counter({
  name: 'api_requests_total',
  help: 'Total number of API requests',
});

// Increment counter on each API request
app.use((req, res, next) => {
  apiRequests.inc();
  next();
});

// Expose Prometheus metrics at /metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

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

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend',
    },
  },
  apis: ['./server.js'], // File(s) containing annotations for the OpenAPI Specification
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define API routes
/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Retrieve a simple message
 *     responses:
 *       200:
 *         description: A JSON object containing a message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
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
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
}
