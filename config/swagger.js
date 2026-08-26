const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'EventPulse API', version: '1.0.0', description: 'Event Management Backend API' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJSDoc(options);
