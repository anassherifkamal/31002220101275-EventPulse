const request = require('supertest');
const express = require('express');
const errorHandler = require('../../middleware/errorHandler');
const validate = require('../../middleware/validate');
const { createEventValidator } = require('../../middleware/validators');

// Mock Express Server instance for isolated endpoint testing
const app = express();
app.use(express.json());

// Public GET events route
app.get('/api/events', (req, res) => {
  res.status(200).json({ status: 'success', data: [] });
});

// Protected POST events route
app.post('/api/events', createEventValidator, validate, (req, res) => {
  res.status(201).json({ status: 'success', data: req.body });
});

app.use(errorHandler);

describe('Event Endpoints Integration Suite', () => {
  test('GET /api/events should return status 200 OK and an array', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/events with missing required fields returns 422 Unprocessable Entity', async () => {
    const res = await request(app).post('/api/events').send({});
    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe('fail');
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/events with valid schema returns 201 Created', async () => {
    const newEvent = {
      title: 'Tech Conference 2026',
      category: '60d5ecb8b5c9c22b14e2fe11',
      date: '2026-10-15T10:00:00.000Z',
      capacity: 100,
    };
    const res = await request(app).post('/api/events').send(newEvent);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });
});