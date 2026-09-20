import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../services/db';
import { SpiceLevel } from '@prisma/client';
import { getOrCacheExternalRecipe } from '../services/externalApi';
import { SEEDED_RECIPES } from '../services/fallbackData';

interface RecipeQuery {
  categoryId?: string;
  search?: string;
  region?: string;
  spiceLevel?: SpiceLevel;
  featured?: string;
  mainIngredient?: string;
  cutOrType?: string;
  subCategory?: string;
  detailed?: string;
  page?: string;
  limit?: string;
}

export async function recipeRoutes(fastify: FastifyInstance) {
  // GET /api/recipes/featured
  fastify.get('/api/recipes/featured', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      let featured = await prisma.recipe.findMany({
        where: { featured: true },
        include: {
          category: true,
          ingredients: true,
          steps: { orderBy: { stepNumber: 'asc' } },
        },
      });

      if (featured.length === 0) {
        featured = await prisma.recipe.findMany({
          take: 4,
          include: {
            category: true,
            ingredients: true,
            steps: { orderBy: { stepNumber: 'asc' } },
          },
        });
      }

      return reply.send({
        success: true,
        data: featured,
      });
    } catch (error) {
      fastify.log.warn('Database offline, using fallback featured recipes');
      const featured = SEEDED_RECIPES.filter((r) => r.featured);
      return reply.send({
        success: true,
        data: featured,
      });
    }
  });

  // GET /api/recipes
  fastify.get('/api/recipes', async (request: FastifyRequest<{ Querystring: RecipeQuery }>, reply: FastifyReply) => {
    const { categoryId, search, region, spiceLevel, featured, mainIngredient, cutOrType, subCategory, detailed, page = '1', limit = '20' } = request.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;
    const cutFilter = cutOrType || subCategory;
    const isDetailed = detailed === 'true';

    try {
      const whereClause: any = {};

      if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (mainIngredient) {
        whereClause.mainIngredient = {
          equals: mainIngredient,
          mode: 'insensitive',
        };
      }

      if (cutFilter) {
        whereClause.cutOrType = {
          contains: cutFilter,
          mode: 'insensitive',
        };
      }

      if (region) {
        whereClause.originRegion = {
          contains: region,
          mode: 'insensitive',
        };
      }

      if (spiceLevel) {
        whereClause.spiceLevel = spiceLevel;
      }

      if (featured !== undefined) {
        whereClause.featured = featured === 'true';
      }

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { englishTitle: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { originRegion: { contains: search, mode: 'insensitive' } },
          { cutOrType: { contains: search, mode: 'insensitive' } },
          {
            ingredients: {
              some: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        ];
      }

      const includeQuery = isDetailed
        ? {
            category: true,
            ingredients: true,
            steps: {
              orderBy: { stepNumber: 'asc' as const },
            },
          }
        : {
            category: true,
          };

      const [items, total] = await Promise.all([
        prisma.recipe.findMany({
          where: whereClause,
          skip,
          take: limitNum,
          orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
          include: includeQuery,
        }),
        prisma.recipe.count({ where: whereClause }),
      ]);

      return reply.send({
        success: true,
        data: {
          items,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasMore: skip + items.length < total,
        },
      });
    } catch (error) {
      fastify.log.warn('Database offline, filtering fallback recipes');
      let filtered = [...SEEDED_RECIPES];

      if (categoryId) {
        filtered = filtered.filter((r) => r.categoryId === categoryId || r.category?.slug === categoryId);
      }

      if (mainIngredient) {
        filtered = filtered.filter((r) => r.mainIngredient?.toLowerCase() === mainIngredient.toLowerCase());
      }

      if (cutFilter) {
        const cLower = cutFilter.toLowerCase();
        filtered = filtered.filter((r) => r.cutOrType?.toLowerCase().includes(cLower));
      }

      if (region) {
        filtered = filtered.filter((r) => r.originRegion.toLowerCase().includes(region.toLowerCase()));
      }

      if (featured !== undefined) {
        filtered = filtered.filter((r) => r.featured === (featured === 'true'));
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            (r.englishTitle && r.englishTitle.toLowerCase().includes(q)) ||
            r.description.toLowerCase().includes(q) ||
            r.originRegion.toLowerCase().includes(q) ||
            (r.cutOrType && r.cutOrType.toLowerCase().includes(q)) ||
            r.ingredients?.some((i) => i.name.toLowerCase().includes(q))
        );
      }

      const paginated = filtered.slice(skip, skip + limitNum);
      return reply.send({
        success: true,
        data: {
          items: paginated,
          total: filtered.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filtered.length / limitNum),
          hasMore: skip + paginated.length < filtered.length,
        },
      });
    }
  });

  // GET /api/recipes/:id
  fastify.get('/api/recipes/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;

    try {
      let recipe = await prisma.recipe.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { externalId: id }],
        },
        include: {
          category: true,
          ingredients: true,
          steps: {
            orderBy: { stepNumber: 'asc' },
          },
        },
      });

      if (!recipe && (/^\d+$/.test(id) || id.startsWith('ext_'))) {
        const cleanExternalId = id.replace('ext_', '');
        recipe = await getOrCacheExternalRecipe(cleanExternalId);
      }

      if (recipe) {
        return reply.send({
          success: true,
          data: recipe,
        });
      }
    } catch (error) {
      fastify.log.warn(`Database offline, checking fallback recipes for ${id}`);
    }

    const fallbackRecipe = SEEDED_RECIPES.find((r) => r.id === id || r.slug === id);
    if (fallbackRecipe) {
      return reply.send({
        success: true,
        data: fallbackRecipe,
      });
    }

    return reply.status(404).send({
      success: false,
      message: `Recipe not found for identifier: ${id}`,
    });
  });
}
