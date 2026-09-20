import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { categoryRoutes } from './routes/categories';
import { recipeRoutes } from './routes/recipes';
import { searchRoutes } from './routes/search';
import { aiRoutes } from './routes/ai';
import { prisma } from './services/db';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Cross-Origin Resource Sharing for React Native / Expo
  app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.register(sensible);

  // Health check endpoint
  app.get('/health', async (_req, reply) => {
    let dbStatus = 'healthy';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'disconnected';
    }

    return reply.send({
      status: 'ok',
      service: 'KusinaDex API Server',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    });
  });

  // API Routes registration
  app.register(categoryRoutes);
  app.register(recipeRoutes);
  app.register(searchRoutes);
  app.register(aiRoutes);

  return app;
}
