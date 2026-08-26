const express = require('express');

const app = express();

// Enable basic CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Inlined Swagger Specification Object
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'EventPulse API',
    version: '1.0.0',
    description: 'API documentation for EventPulse backend services'
  },
  servers: [
    {
      url: 'https://eyouth-31002220101275-event-pulse.vercel.app',
      description: 'Production Server'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health Check Endpoint',
        responses: {
          '200': { description: 'API is online' }
        }
      }
    }
  }
};

// 1. Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'EventPulse API is online' });
});

// 2. Raw JSON endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// 3. Fail-Safe API Documentation UI (using Redoc engine - never gets blocked by browser security)
app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EventPulse API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body { margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <redoc spec-url='/api-docs/swagger.json'></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
      </body>
    </html>
  `);
});

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}