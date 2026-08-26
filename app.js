const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerSpec = require('./swagger.json'); // Ensure swagger.json exists in your project root

const app = express();

// 1. Enable Global CORS (Fixes CORS blocks on Vercel)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Configure Helmet Security (Disables CSP so CDN assets can load cleanly)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'EventPulse API is online' });
});

// 4. Raw Swagger JSON Endpoint
app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// 5. Standalone Swagger UI HTML Route (Zero serverless file-system dependencies)
app.get('/api-docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>EventPulse API Documentation</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.min.css" />
      <style>
        html { box-sizing: border-box; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.min.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: "/api-docs/swagger.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `);
});

// --- Register Your API Routes Here ---
// const eventRoutes = require('./routes/eventRoutes');
// app.use('/api/events', eventRoutes);

// 6. Catch-All 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

// 7. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Export app for Vercel Serverless execution
module.exports = app;

// Local development server listener
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}