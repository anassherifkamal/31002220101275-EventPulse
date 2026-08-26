const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize Express App and HTTP Server for Socket.io
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// --- Middleware ---
app.use(express.json());
app.use(cors());
app.use(mongoSanitize());

// --- Swagger Documentation Configuration ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API Documentation',
      version: '1.0.0',
      description: 'API documentation for Auth, Events, Registrations, and Announcements',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Server Environment',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./app.js'], // Scans this file for Swagger/JSDoc annotations
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- Health Check Endpoint ---
/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is running successfully
 */
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'EventPulse API is running' });
});


// --- AUTH ENDPOINTS ---

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or validation error
 */
app.post('/api/auth/register', (req, res) => {
  // TODO: Implement user registration logic
  res.status(201).json({ message: 'User registered successfully' });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/auth/login', (req, res) => {
  // TODO: Implement user login logic
  res.status(200).json({ token: 'sample-jwt-token' });
});


// --- EVENTS ENDPOINTS ---

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
app.get('/api/events', (req, res) => {
  // TODO: Implement get all events logic
  res.status(200).json([{ id: '1', title: 'Sample Event Pulse' }]);
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
app.post('/api/events', (req, res) => {
  // TODO: Implement event creation logic and trigger Socket.io announcement if needed
  io.emit('announcement', { message: 'New event created!' });
  res.status(201).json({ message: 'Event created successfully' });
});


// --- Socket.io Connection Handler ---
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// --- Server and Database Initialization ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventpulse';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    if (process.env.NODE_ENV !== 'production') {
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
      });
    }
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Export app for serverless/testing environments (like Vercel)
module.exports = app;