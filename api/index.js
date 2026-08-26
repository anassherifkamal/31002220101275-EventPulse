const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(swaggerSpec);
});

app.get('/api/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>EventPulse API Documentation</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/api/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis]
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Export wrapped for Vercel serverless environment
module.exports = serverless(app);