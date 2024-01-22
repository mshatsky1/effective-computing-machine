const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/users');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User API', () => {
  beforeEach(() => {
    // Reset users array for each test
    const users = require('../routes/users');
    // This would need to be refactored to allow resetting
  });

  test('GET /api/users should return empty array initially', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

