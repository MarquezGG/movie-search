const request = require('supertest');
const app = require('../index');

describe('POST /api/search', () => {
  it('returns 400 when query is empty', async () => {
    const res = await request(app).post('/api/search').send({ query: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
