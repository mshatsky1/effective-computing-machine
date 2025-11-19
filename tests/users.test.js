const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/users');
const userStore = require('../data/userStore');
const requireJson = require('../middleware/requireJson');

const app = express();
app.use(requireJson);
app.use(express.json());
app.use('/api/users', userRoutes);

function seedUsers() {
  userStore.create({
    name: 'Alice Carter',
    email: 'alice@acme.io',
    role: 'admin',
    status: 'active'
  });
  userStore.create({
    name: 'Ben Wright',
    email: 'ben@acme.io',
    role: 'member',
    status: 'inactive'
  });
}

describe('User API', () => {
  beforeEach(() => {
    userStore.reset();
    seedUsers();
  });

  test('GET /api/users returns paginated payload with filters metadata', async () => {
    const res = await request(app).get('/api/users?limit=1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.filters.search).toBeNull();
  });

  test('GET /api/users respects search and status filters', async () => {
    const res = await request(app).get('/api/users?search=ben&status=inactive');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].email).toBe('ben@acme.io');
  });

  test('GET /api/users validates sort parameters', async () => {
    const invalid = await request(app).get('/api/users?sort=unknown');
    expect(invalid.statusCode).toBe(400);

    const sorted = await request(app).get('/api/users?sort=name&direction=asc');
    expect(sorted.statusCode).toBe(200);
    expect(sorted.body.data[0].name).toBe('Alice Carter');
    expect(sorted.body.filters.sort).toBe('name');
    expect(sorted.body.filters.direction).toBe('asc');
  });

  test('GET /api/users rejects invalid date filters', async () => {
    const res = await request(app).get('/api/users?createdAfter=not-a-date');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid createdAfter/);
  });

  test('POST /api/users creates user and prevents duplicates', async () => {
    const payload = { name: 'Clara Finch', email: 'clara@acme.io', role: 'member' };
    const created = await request(app).post('/api/users').send(payload);
    expect(created.statusCode).toBe(201);
    const duplicate = await request(app).post('/api/users').send(payload);
    expect(duplicate.statusCode).toBe(409);
  });

  test('POST /api/users enforces JSON content type', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Content-Type', 'text/plain')
      .send('invalid');
    expect(res.statusCode).toBe(415);
  });

  test('PUT /api/users/:id updates record and enforces unique email', async () => {
    const [alice, ben] = userStore.list();
    const res = await request(app)
      .put(`/api/users/${alice.id}`)
      .send({ name: 'Alice Updated', email: 'alice.updated@acme.io' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Alice Updated');

    const conflict = await request(app)
      .put(`/api/users/${alice.id}`)
      .send({ name: 'Alice', email: ben.email });
    expect(conflict.statusCode).toBe(409);
  });

  test('DELETE /api/users/:id removes the user', async () => {
    const [alice] = userStore.list();
    const res = await request(app).delete(`/api/users/${alice.id}`);
    expect(res.statusCode).toBe(204);
    const missing = await request(app).get(`/api/users/${alice.id}`);
    expect(missing.statusCode).toBe(404);
  });

  test('GET /api/users/summary returns aggregated counts', async () => {
    const res = await request(app).get('/api/users/summary');
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.byRole.admin).toBe(1);
    expect(res.body.byStatus.inactive).toBe(1);
  });
});

