const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'API documentation for EventPulse backend services',
    },
    servers: [
      {
        url: 'https://eyouth-31002220101275-event-pulse.vercel.app',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'], // adjust path to your route files if needed
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;