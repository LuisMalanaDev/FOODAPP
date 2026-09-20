import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../services/db';
import { fetchFilipinoMealsFromApi, getOrCacheExternalRecipe } from '../services/externalApi';
import { SEEDED_RECIPES } from '../services/fallbackData';

interface SearchQuery {
  q?: string;
  query?: string;
  category?: string;
  region?: string;
}

export async function searchRoutes(fastify: FastifyInstance) {
  fastify.get('/api/search', async (request: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply) => {
    const searchTerm = (request.query.q || request.query.query || '').trim();
    const { category, region } = request.query;

    let localResults: any[] = [];

    try {
      if (!searchTerm && !category && !region) {
        localResults = await prisma.recipe.findMany({
          take: 15,
          orderBy: { featured: 'desc' },
          include: {
            category: true,
            ingredients: true,
            steps: { orderBy: { stepNumber: 'asc' } },
          },
        });
      } else {
        const whereClause: any = {};

        if (category) {
          whereClause.category = {
            OR: [
              { slug: { equals: category, mode: 'insensitive' } },
              { name: { contains: category, mode: 'insensitive' } },
              { filipinoName: { contains: category, mode: 'insensitive' } },
            ],
          };
        }

        if (region) {
          whereClause.originRegion = { contains: region, mode: 'insensitive' };
        }

        if (searchTerm) {
          whereClause.OR = [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { englishTitle: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { originRegion: { contains: searchTerm, mode: 'insensitive' } },
            {
              ingredients: {
                some: {
                  name: { contains: searchTerm, mode: 'insensitive' },
                },
              },
            },
          ];
        }

        localResults = await prisma.recipe.findMany({
          where: whereClause,
          include: {
            category: true,
            ingredients: true,
            steps: { orderBy: { stepNumber: 'asc' } },
          },
        });
      }
    } catch (error) {
      fastify.log.warn('Database offline, using fallback dataset for search');
      const q = searchTerm.toLowerCase();
      localResults = SEEDED_RECIPES.filter((r) => {
        const matchCategory = category
          ? r.categoryId === category || r.category?.slug === category
          : true;
        const matchRegion = region
          ? r.originRegion.toLowerCase().includes(region.toLowerCase())
          : true;
        const matchQuery = q
          ? r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.originRegion.toLowerCase().includes(q) ||
            r.ingredients?.some((i) => i.name.toLowerCase().includes(q))
          : true;

        return matchCategory && matchRegion && matchQuery;
      });
    }

    // Query TheMealDB external API if search query is provided
    let externalResults: any[] = [];
    if (searchTerm && searchTerm.length >= 3) {
      try {
        const meals = await fetchFilipinoMealsFromApi();
        const lowerTerm = searchTerm.toLowerCase();

        const matchingExternal = meals.filter(
          (m) =>
            m.strMeal.toLowerCase().includes(lowerTerm) &&
            !localResults.some((loc) => loc.externalId === m.idMeal || loc.title.toLowerCase() === m.strMeal.toLowerCase())
        );

        for (const m of matchingExternal.slice(0, 3)) {
          try {
            const cached = await getOrCacheExternalRecipe(m.idMeal);
            if (cached) {
              externalResults.push(cached);
            }
          } catch {
            // If caching fails due to DB offline, construct a direct item
            externalResults.push({
              id: `ext_${m.idMeal}`,
              slug: `${m.strMeal.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ext-${m.idMeal}`,
              title: m.strMeal,
              englishTitle: m.strMeal,
              description: `Authentic Filipino dish sourced from global culinary records.`,
              prepTimeMinutes: 15,
              cookTimeMinutes: 30,
              servings: 4,
              spiceLevel: 'NONE',
              originRegion: 'Philippines',
              difficulty: 'MEDIUM',
              imageUrl: m.strMealThumb,
              featured: false,
              isExternal: true,
              externalId: m.idMeal,
              ingredients: [],
              steps: [],
            });
          }
        }
      } catch (err) {
        fastify.log.warn(`External search fetch warning: ${err}`);
      }
    }

    const combined = [...localResults, ...externalResults];

    return reply.send({
      success: true,
      count: combined.length,
      query: searchTerm,
      data: combined,
    });
  });
}
