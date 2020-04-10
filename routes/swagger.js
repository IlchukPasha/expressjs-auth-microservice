const swaggerJSDoc = require('swagger-jsdoc');
const express = require('express');

const router = express.Router();

// openapi 2.0  3.0 diff
// https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v2.0/yaml/petstore.yaml
// https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore.yaml

const swaggerSpecv1 = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Auth Microservice API',
      version: '1.0.0'
    },
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        description: 'Primary authorization token for app',
        name: 'x-api-token'
      }
    },
    parameters: {},
    tags: [],
    responses: {
      200: {
        description: 'Ok'
      },
      201: {
        description: 'Created'
      },
      202: {
        description: 'Accepted'
      },
      204: {
        description: 'No content'
      },
      400: {
        description: 'Validation errors'
      },
      401: {
        description: 'Unauthorized'
      },
      403: {
        description: 'Forbidden'
      },
      404: {
        description: 'Not found'
      },
      409: {
        description: 'Conflict'
      }
    }
  },
  apis: [
    './controllers/**/*.js',
    './models/*.js'
  ]
});

router.get('/api/v1/swagger/spec.json', (req, res) => {
  res.json(swaggerSpecv1);
});

module.exports = router;
