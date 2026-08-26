const express = require('express');

const app = express();

// 1. Global CORS Middleware (No external 'cors' package needed)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Inline Swagger Specification Object (Eliminates filesystem crashes)
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
          '200': { description: 'API is online and healthy' }
        }
      }
    }
  }
};

// 3. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: 'production',
    uptime: process.uptime() + 's',
    timestamp: new Date().toISOString()
  });
});

// 4. Raw Swagger JSON Endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(swaggerSpec);
});

// 5. Standalone CDN-based Swagger UI HTML Route
// app.get('/api-docs', (req, res) => {
//   res.setHeader('Content-Type', 'text/html; charset=utf-8');
//   return res.status(200).send(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>EventPulse API Documentation</title>
//       <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
//       <style>
//         html { box-sizing: border-box; }
//         *, *:before, *:after { box-sizing: inherit; }
//         body { margin: 0; background: #fafafa; }
//       </style>
//     </head>
//     <body>
//       <div id="swagger-ui"></div>
//       <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
//       <script>
//         window.onload = function() {
//           SwaggerUIBundle({
//             url: "/api-docs/swagger.json",
//             dom_id: '#swagger-ui',
//             deepLinking: true,
//             presets: [
//               SwaggerUIBundle.presets.apis
//             ]
//           });
//         };
//       </script>
//     </body>
//     </html>
//   `);
// });
app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send('<h1>Swagger Docs are Loading...</h1>');
});
// Catch-All 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = app;

// Local Development Server Listener
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}