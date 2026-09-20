import { FastifyInstance } from 'fastify';
import { prisma } from '../services/db';
import { SEEDED_CATEGORIES } from '../services/fallbackData';

export async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/api/categories', async (_request, reply) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: {
            select: { recipes: true },
          },
        },
      });

      const seededMap = new Map(SEEDED_CATEGORIES.map((c) => [c.slug, c.subCategories]));

      const formatted = categories.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        filipinoName: cat.filipinoName,
        description: cat.description,
        iconName: cat.iconName,
        displayOrder: cat.displayOrder,
        recipesCount: cat._count.recipes,
        subCategories: seededMap.get(cat.slug) || [],
        createdAt: cat.createdAt.toISOString(),
        updatedAt: cat.updatedAt.toISOString(),
      }));

      return reply.send({
        success: true,
        data: formatted,
      });
    } catch (error) {
      fastify.log.warn('Database offline, using authentic fallback categories');
      return reply.send({
        success: true,
        data: SEEDED_CATEGORIES,
      });
    }
  });
}
