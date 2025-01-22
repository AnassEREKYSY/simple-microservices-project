const request = require('supertest');
const { app, sequelize } = require('../server.js');

// Increase Jest timeout
jest.setTimeout(15000);

// Test data
const userData = { name: 'Test User', email: 'test@example.com' };

beforeAll(async () => {
  console.log('Syncing database...');
  await sequelize.authenticate();  // Make sure the connection is active
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  console.log('Closing database connection...');
  await sequelize.close();  // Close the connection after all tests
});

describe('Backend API Tests', () => {
  it('should fetch the users list', async () => {
    console.time('API Response Time');
    const res = await request('http://backend:3000').get('/api/users');
    console.timeEnd('API Response Time');

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
        }),
      ])
    );
  });
});
