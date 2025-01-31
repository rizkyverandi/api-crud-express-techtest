import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';

const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
    description: 'API documentation for Express TypeScript application',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Get welcome message',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'text/plain': {
                example: 'Hello World with TypeScript!',
              },
            },
          },
        },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};