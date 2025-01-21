const request = require('supertest');
const { app, sequelize } = require('../server.js');

// Set the base URL for testing depending on the environment
const baseUrl = process.env.NODE_ENV === 'docker' ? 'http://backend:3000' : 'http://localhost:3000';

// Define test data
const userData = { name: 'Test User', email: 'test@example.com' };

beforeAll(async () => {
  // Ensure the database is synced before tests run
  console.log('Syncing database...');
  await sequelize.sync({ force: true });  // Clear tables before each test

  // Log the userData to ensure it’s correct
  console.log('Inserting user data:', userData);

  // Insert test user into the database
  try {
    await sequelize.models.User.create(userData);
    console.log('User inserted');
  } catch (err) {
    console.error('Error inserting user:', err);
  }

  // Verify the user is inserted by checking count
  const userCount = await sequelize.models.User.count();
  console.log(`Number of users in database: ${userCount}`);
});

afterAll(async () => {
  // Close the database connection after tests
  await sequelize.close();
});

describe('Backend API Tests', () => {
  it('should fetch the users list', async () => {
    console.log('Making GET request to /api/users');
    const res = await request(baseUrl)
      .get('/api/users')
      .set('Content-Type', 'application/json')
      .send();

    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', res.body);

    // Check if the response status is 200
    expect(res.statusCode).toBe(200);

    // Ensure that there is at least one user
    expect(res.body).toHaveLength(1);

    // Check that the user's name and email match
    expect(res.body[0].name).toBe(userData.name);
    expect(res.body[0].email).toBe(userData.email);
  });
});
