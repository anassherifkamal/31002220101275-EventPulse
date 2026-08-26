const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

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

// --- Swagger Documentation via CDN HTML (Vercel-Friendly) ---
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>EventPulse API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
          body { margin: 0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api-docs-json',
              dom_id: '#swagger-ui',
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});

// Serve the raw OpenAPI/Swagger JSON spec
app.get('/api-docs-json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API Documentation',
      version: '1.0.0',
      description: 'API documentation for Auth, Events, Registrations, and Announcements',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'https://eyouth-31002220101275-event-pulse.vercel.app',
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
    paths: {
      '/': {
        get: {
          summary: 'API Health Check',
          tags: ['System'],
          responses: {
            200: { description: 'Server is running successfully' },
          },
        },
      },
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Bad request or validation error' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Log in an existing user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns JWT token' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/events': {
        get: {
          summary: 'Retrieve all events',
          tags: ['Events'],
          responses: {
            200: { description: 'A list of events retrieved successfully' },
          },
        },
        post: {
          summary: 'Create a new event',
          tags: ['Events'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'date'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Event created successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
    },
  });
});

// --- Health Check Endpoint ---
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'EventPulse API is running' });
});


// --- AUTH ENDPOINTS ---
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ token: 'sample-jwt-token' });
});


// --- EVENTS ENDPOINTS ---
app.get('/api/events', (req, res) => {
  res.status(200).json([{ id: '1', title: 'Sample Event Pulse' }]);
});

app.post('/api/events', (req, res) => {
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
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (!MONGO_URI) {
    console.warn('Warning: MONGO_URI environment variable is missing!');
    return;
  }
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB successfully');
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

connectDB();

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;