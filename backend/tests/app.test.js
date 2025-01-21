const request = require('supertest');
const app = require('../server.js');

describe('Backend API Tests', () => {
  it('should respond with status 200 on the health check endpoint', async () => {
    const res = await request(app).get('/api/data');
    expect(res.statusCode).toBe(200);
  });
});
