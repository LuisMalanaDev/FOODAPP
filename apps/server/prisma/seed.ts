import { PrismaClient, SpiceLevel, Difficulty } from '@prisma/client';
import { SEEDED_CATEGORIES, SEEDED_RECIPES } from '../src/services/fallbackData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.step.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.category.deleteMany();

  console.log(`🌿 Seeding ${SEEDED_CATEGORIES.length} Categories...`);
  const categoryMap = new Map<string, string>();

  for (const cat of SEEDED_CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        filipinoName: cat.filipinoName,
        description: cat.description,
        iconName: cat.iconName,
        displayOrder: cat.displayOrder,
      },
    });
    categoryMap.set(cat.id, created.id);
    categoryMap.set(cat.slug, created.id);
  }

  console.log(`🥘 Seeding ${SEEDED_RECIPES.length} Authentic Filipino Recipes...`);

  for (const recipe of SEEDED_RECIPES) {
    const targetCategoryId = categoryMap.get(recipe.categoryId) || Array.from(categoryMap.values())[0];

    await prisma.recipe.create({
      data: {
        slug: recipe.slug,
        title: recipe.title,
        englishTitle: recipe.englishTitle,
        description: recipe.description,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        servings: recipe.servings,
        spiceLevel: (recipe.spiceLevel as SpiceLevel) || SpiceLevel.NONE,
        originRegion: recipe.originRegion,
        difficulty: (recipe.difficulty as Difficulty) || Difficulty.MEDIUM,
        imageUrl: recipe.imageUrl,
        featured: recipe.featured,
        isExternal: recipe.isExternal ?? false,
        mainIngredient: recipe.mainIngredient,
        cutOrType: recipe.cutOrType,
        categoryId: targetCategoryId,
        ingredients: {
          create: (recipe.ingredients || []).map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            notes: ing.notes,
            isOptional: ing.isOptional,
          })),
        },
        steps: {
          create: (recipe.steps || []).map((st) => ({
            stepNumber: st.stepNumber,
            instruction: st.instruction,
            timerMinutes: st.timerMinutes,
            tips: st.tips,
          })),
        },
      },
    });
  }

  console.log(`✅ Seeding completed successfully! ${SEEDED_RECIPES.length} recipes created.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
