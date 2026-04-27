import request from 'supertest';
import app from '../server.js';

describe('CarCore Backend API Integrációs Teszt', () => {
  test('TC01: GET /api - Egészségellenőrzés (Health Check)', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message');
  });

  test('TC02: GET /api/products - Terméklista lekérése', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(typeof response.body[0].id).toBe('number');
      expect(typeof response.body[0].name).toBe('string');
    }
  });

  test('TC03: GET /api/nemletezo - Hibakezelés tesztelése (404)', async () => {
    const response = await request(app).get('/api/nemletezo');

    expect(response.status).toBe(404);
  });
});