import { prisma } from './db';
import { SpiceLevel, Difficulty } from '@prisma/client';

const MEALDB_BASE = process.env.MEALDB_API_BASE_URL || 'https://www.themealdb.com/api/json/v1/1';

interface TheMealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strSource?: string;
  [key: string]: string | null | undefined;
}

export async function fetchFilipinoMealsFromApi(): Promise<TheMealDBMeal[]> {
  try {
    const response = await fetch(`${MEALDB_BASE}/filter.php?a=Filipino`);
    if (!response.ok) {
      console.warn(`MealDB filter request failed: ${response.status}`);
      return [];
    }
    const data = (await response.json()) as { meals: TheMealDBMeal[] | null };
    return data.meals || [];
  } catch (error) {
    console.error('Error contacting MealDB API:', error);
    return [];
  }
}

export async function fetchMealDetailsFromApi(idMeal: string): Promise<TheMealDBMeal | null> {
  try {
    const response = await fetch(`${MEALDB_BASE}/lookup.php?i=${idMeal}`);
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { meals: TheMealDBMeal[] | null };
    return data.meals && data.meals.length > 0 ? data.meals[0] : null;
  } catch (error) {
    console.error(`Error fetching meal details for ${idMeal}:`, error);
    return null;
  }
}

export async function getOrCacheExternalRecipe(idMeal: string) {
  // 1. Check if recipe is already cached in PostgreSQL
  const cached = await prisma.recipe.findFirst({
    where: { externalId: idMeal },
    include: {
      category: true,
      ingredients: true,
      steps: {
        orderBy: { stepNumber: 'asc' },
      },
    },
  });

  if (cached) {
    return cached;
  }

  // 2. Fetch from MealDB
  const meal = await fetchMealDetailsFromApi(idMeal);
  if (!meal) {
    return null;
  }

  // 3. Find default category or create fallback
  let defaultCategory = await prisma.category.findFirst({
    where: { slug: 'ginisa' },
  });

  if (!defaultCategory) {
    defaultCategory = await prisma.category.findFirst();
  }

  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: {
        slug: 'pambansang-ulam',
        name: 'Pambansang Ulam',
        filipinoName: 'Tradisyunal na Lutuin',
        description: 'Authentic Filipino dishes from global culinary archives.',
        iconName: 'Utensils',
        displayOrder: 99,
      },
    });
  }

  // 4. Parse ingredients (strIngredient1..20, strMeasure1..20)
  const ingredientsData: { name: string; amount: number; unit: string; notes?: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingName = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim() || '';

    if (ingName && ingName.length > 0) {
      // Basic extraction of amount and unit
      const match = measure.match(/^([\d\.\/\s]+)?(.*)$/);
      let amount = 1;
      let unit = measure || 'portion';

      if (match && match[1]) {
        const rawNum = match[1].trim();
        if (rawNum.includes('/')) {
          const parts = rawNum.split('/');
          amount = parseFloat(parts[0]) / (parseFloat(parts[1]) || 1);
        } else {
          amount = parseFloat(rawNum) || 1;
        }
        unit = match[2]?.trim() || 'portion';
      }

      ingredientsData.push({
        name: ingName,
        amount: Math.round(amount * 100) / 100,
        unit: unit || 'portion',
        notes: measure ? `Original measure: ${measure}` : undefined,
      });
    }
  }

  // 5. Parse instructions into discrete numbered steps
  const rawInstructions = meal.strInstructions || 'Cook according to traditional Filipino technique.';
  const stepLines = rawInstructions
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const stepsData: { stepNumber: number; instruction: string; timerMinutes?: number }[] = [];
  let stepIndex = 1;

  for (const line of stepLines) {
    // Clean leading numbers like "1.", "0.\t", "STEP 1:"
    const cleaned = line.replace(/^(\d+[\.\)]|\bstep\s*\d+:?|\d+\t)\s*/i, '').trim();
    if (cleaned.length > 0) {
      // Extract minute timer if mentioned e.g., "30 minutes"
      const timeMatch = cleaned.match(/(\d+)\s*(?:minutes|mins|min)/i);
      const timerMinutes = timeMatch ? parseInt(timeMatch[1], 10) : undefined;

      stepsData.push({
        stepNumber: stepIndex++,
        instruction: cleaned,
        timerMinutes,
      });
    }
  }

  if (stepsData.length === 0) {
    stepsData.push({
      stepNumber: 1,
      instruction: rawInstructions,
    });
  }

  // 6. Generate a unique slug
  const baseSlug = meal.strMeal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slug = `${baseSlug}-ext-${meal.idMeal}`;

  // 7. Upsert into database
  const created = await prisma.recipe.create({
    data: {
      slug,
      title: meal.strMeal,
      englishTitle: meal.strMeal,
      description: `Authentic ${meal.strMeal} sourced and cached from Filipino culinary records.`,
      prepTimeMinutes: 15,
      cookTimeMinutes: 35,
      servings: 4,
      spiceLevel: SpiceLevel.NONE,
      originRegion: 'Philippines',
      difficulty: Difficulty.MEDIUM,
      imageUrl: meal.strMealThumb,
      isExternal: true,
      externalId: meal.idMeal,
      sourceUrl: meal.strSource,
      featured: false,
      categoryId: defaultCategory.id,
      ingredients: {
        create: ingredientsData,
      },
      steps: {
        create: stepsData,
      },
    },
    include: {
      category: true,
      ingredients: true,
      steps: {
        orderBy: { stepNumber: 'asc' },
      },
    },
  });

  return created;
}
