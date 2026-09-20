const fs = require('fs');
const path = require('path');
const { fetchPage, parseDuration, parseIngredient, classifyRecipe } = require('./panlasangHelpers');

// Load original 56 hand-crafted recipes (first 56 recipes with id starting with rec_pork, rec_chicken, etc.)
// Or load from scripts/buildCatalog.js which contains the pure 56 pristine curated recipes!
const buildCatalog = require('./buildCatalog.js');
let EXISTING_RECIPES = [];
try {
  // Read first 56 recipes from fallbackData or buildCatalog
  const raw = fs.readFileSync(path.join(__dirname, '../apps/server/src/services/fallbackData.ts'), 'utf8');
  const match = raw.match(/export const SEEDED_RECIPES: Recipe\[\] = (\[[\s\S]*?\]);\s*$/);
  if (match) {
    const all = JSON.parse(match[1]);
    // The original 56 curated recipes have IDs without "rec_pp_"
    EXISTING_RECIPES = all.filter(r => !r.id.startsWith('rec_pp_'));
  }
} catch (e) {
  console.log('Error reading existing fallback:', e.message);
}

if (EXISTING_RECIPES.length === 0) {
  console.log('Fallback: Loading from dist...');
  const fallback = require('../apps/server/dist/services/fallbackData.js');
  EXISTING_RECIPES = (fallback.SEEDED_RECIPES || []).filter(r => !r.id.startsWith('rec_pp_'));
}

console.log(`Pristine curated recipes count: ${EXISTING_RECIPES.length}`);

// Load categories
const SEEDED_CATEGORIES = [
  {
    id: 'cat_pork',
    slug: 'pork',
    name: 'Pork (Baboy)',
    filipinoName: 'Mga Lutong Baboy',
    description: 'All authentic Filipino pork dishes categorized by cut: Pork Chops, Pork Belly, Ribs, Giniling, Sisig, and Crispy Pata.',
    iconName: 'Ham',
    displayOrder: 1,
    subCategories: ['Pork Chops', 'Belly / Liempo', 'Ribs', 'Ground (Giniling)', 'Hock / Pata', 'Mask / Sisig'],
    recipesCount: 0,
  },
  {
    id: 'cat_chicken',
    slug: 'chicken',
    name: 'Chicken (Manok)',
    filipinoName: 'Mga Lutong Manok',
    description: 'Every style of Filipino chicken: crispy wings, tender breast, savory adobo, grilled inasal, and comforting tinola.',
    iconName: 'Drumstick',
    displayOrder: 2,
    subCategories: ['Breast', 'Wings', 'Thighs & Legs', 'Whole & Stew'],
    recipesCount: 0,
  },
  {
    id: 'cat_beef',
    slug: 'beef',
    name: 'Beef (Baka)',
    filipinoName: 'Mga Lutong Baka',
    description: 'Tender beef shank bulalo, rich tomato caldereta, bistek tagalog, and peanut-rich oxtail kare-kare.',
    iconName: 'Beef',
    displayOrder: 3,
    subCategories: ['Shank (Bulalo)', 'Brisket & Ribs', 'Sirloin / Flank', 'Oxtail & Tripe'],
    recipesCount: 0,
  },
  {
    id: 'cat_seafood',
    slug: 'seafood',
    name: 'Seafood & Fish (Isda atbp.)',
    filipinoName: 'Mga Isda at Yamang-Dagat',
    description: 'Milkfish (bangus), golden tilapia, butter garlic shrimp, stuffed grilled squid, and salmon head sinigang.',
    iconName: 'Fish',
    displayOrder: 4,
    subCategories: ['Milkfish (Bangus)', 'Tilapia', 'Shrimp (Hipon)', 'Squid (Pusit)', 'Salmon & Crab'],
    recipesCount: 0,
  },
  {
    id: 'cat_vegetables',
    slug: 'vegetables',
    name: 'Vegetables & Greens (Gulay)',
    filipinoName: 'Mga Lutong Gulay',
    description: 'Ginisang ampalaya, coconut laing, pinakbet, diningding, chop suey, ginisang monggo, and sitaw.',
    iconName: 'Carrot',
    displayOrder: 5,
    subCategories: ['Bitter Melon', 'Taro Leaves', 'Squash & Beans', 'Eggplant', 'Legumes & Monggo'],
    recipesCount: 0,
  },
  {
    id: 'cat_eggs',
    slug: 'eggs',
    name: 'Eggs & Breakfast (Itlog at Silog)',
    filipinoName: 'Itlog, Almusal at Silog',
    description: 'Tortang talong, tortang giniling, tapsilog, tocilog, bangsilog, salted egg ensalada, and street kwek-kwek.',
    iconName: 'Egg',
    displayOrder: 6,
    subCategories: ['Omelettes & Tortas', 'Silog Meals', 'Eggs & Ensalada', 'Street Egg Snacks'],
    recipesCount: 0,
  },
  {
    id: 'cat_baking',
    slug: 'baking',
    name: 'Desserts, Cakes & Baking',
    filipinoName: 'Panghimagas, Cake at Baking',
    description: 'Pan de sal, cheesy ensaymada, spanish bread, ube cake, egg pie, mango float, bibingka, and leche flan.',
    iconName: 'Cake',
    displayOrder: 7,
    subCategories: ['Cakes & Pies', 'Breads & Bakeshop', 'Kakanin & Custard'],
    recipesCount: 0,
  },
  {
    id: 'cat_noodles',
    slug: 'noodles',
    name: 'Noodles, Soups & Pancakes',
    filipinoName: 'Pancit, Sabaw at Hotcake',
    description: 'Pancit bihon, canton, palabok, lomi, creamy chicken sopas, and Pinoy street yellow hotcakes.',
    iconName: 'UtensilsCrossed',
    displayOrder: 8,
    subCategories: ['Pancit', 'Pancakes & Crepes', 'Soups & Porridge'],
    recipesCount: 0,
  },
];

// Read all sitemaps
const s1 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/851/content.md', 'utf8');
const s2 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/909/content.md', 'utf8');
const s3 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/913/content.md', 'utf8');

const allUrls = [
  ...s1.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g),
  ...s2.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g),
  ...s3.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g)
].map(m => m[1]);

const nonRecipes = ['school', 'diet', 'hospital', 'what-is', 'how-the', 'benefits', 'substitute', 'difference', 'reasons-why', 'food-list', 'top-', 'guide-', 'review'];
const candidateUrls = [...new Set(allUrls.filter(u => {
  const lower = u.toLowerCase();
  if (nonRecipes.some(k => lower.includes(k))) return false;
  return lower.includes('recipe') || lower.includes('-how-to-cook') || lower.includes('filipino-');
}))];

console.log(`Found ${candidateUrls.length} recipe URLs to process.`);

const existingTitles = new Set(EXISTING_RECIPES.map(r => r.title.toLowerCase().trim()));
const existingSlugs = new Set(EXISTING_RECIPES.map(r => r.slug));

function parseJsonLd(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const s of scripts) {
    try {
      const parsed = JSON.parse(s[1]);
      const graph = parsed['@graph'] || [parsed];
      for (const item of graph) {
        if (item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
          return item;
        }
      }
    } catch(e) {}
  }
  return null;
}

// Concurrent worker pool
async function processPool(urls, concurrency = 8, targetCount = 200) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < urls.length && results.length < targetCount) {
      const i = index++;
      const url = urls[i];

      try {
        const html = await fetchPage(url);
        const schema = parseJsonLd(html);
        if (!schema || !schema.name || !schema.recipeIngredient || schema.recipeIngredient.length < 3) {
          continue;
        }

        const title = schema.name.replace(/\s*-\s*Panlasang Pinoy/i, '').replace(/\s*Recipe$/i, '').trim();
        const slug = path.basename(url.replace(/\/$/, '')).replace(/-recipe$/, '');

        if (existingTitles.has(title.toLowerCase()) || existingSlugs.has(slug)) {
          continue;
        }

        const rawIngredients = schema.recipeIngredient || [];
        const classification = classifyRecipe(title, schema.description || '', schema.recipeCategory || [], rawIngredients);

        const prepMins = parseDuration(schema.prepTime);
        const cookMins = parseDuration(schema.cookTime);

        let imageUrl = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80';
        if (schema.image) {
          if (Array.isArray(schema.image) && schema.image.length > 0) {
            imageUrl = typeof schema.image[0] === 'string' ? schema.image[0] : schema.image[0]?.url || imageUrl;
          } else if (typeof schema.image === 'string') {
            imageUrl = schema.image;
          } else if (schema.image.url) {
            imageUrl = schema.image.url;
          }
        }

        let servings = 4;
        if (schema.recipeYield) {
          const yStr = Array.isArray(schema.recipeYield) ? schema.recipeYield[0] : String(schema.recipeYield);
          const yNum = parseInt(yStr, 10);
          if (yNum && yNum > 0 && yNum < 50) servings = yNum;
        }

        const ingredients = rawIngredients.map((raw, idx) => parseIngredient(raw, idx));

        let steps = [];
        if (Array.isArray(schema.recipeInstructions)) {
          steps = schema.recipeInstructions.map((st, idx) => {
            const text = typeof st === 'string' ? st : (st.text || st.name || '');
            return {
              id: `step_pp_${slug}_${idx + 1}`,
              stepNumber: idx + 1,
              instruction: text.trim(),
              timerMinutes: text.match(/(\d+)\s*(?:minutes|mins)/i) ? parseInt(text.match(/(\d+)\s*(?:minutes|mins)/i)[1], 10) : null,
              tips: 'Cook over steady medium heat to maintain sauce texture and tenderness.',
            };
          }).filter(s => s.instruction.length > 0);
        }

        if (steps.length === 0) continue;

        const recipeObj = {
          id: `rec_pp_${slug.replace(/[^a-zA-Z0-9]/g, '_')}`,
          slug: `pp-${slug}`,
          title,
          englishTitle: title,
          description: schema.description ? schema.description.slice(0, 250).trim() : `Authentic ${title} cooked in traditional Filipino style.`,
          prepTimeMinutes: prepMins,
          cookTimeMinutes: cookMins,
          servings,
          spiceLevel: title.toLowerCase().includes('spicy') || title.toLowerCase().includes('bicol') ? 'SPICY' : 'NONE',
          originRegion: 'National / Traditional',
          difficulty: cookMins > 45 ? 'MEDIUM' : 'EASY',
          imageUrl,
          featured: false,
          isExternal: true,
          sourceUrl: url,
          categoryId: classification.categoryId,
          mainIngredient: classification.mainIngredient,
          cutOrType: classification.cutOrType,
          ingredients,
          steps,
        };

        existingTitles.add(title.toLowerCase());
        existingSlugs.add(slug);
        results.push(recipeObj);
        console.log(`[${results.length}/${targetCount}] Ingested: ${title} -> ${classification.categoryId} (${classification.cutOrType})`);
      } catch (e) {}
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

(async () => {
  console.log('🚀 Launching high-speed concurrent crawler for Panlasang Pinoy recipes...');
  const newRecipes = await processPool(candidateUrls, 12, 220);
  console.log(`🎉 Finished crawling! Ingested ${newRecipes.length} brand new authentic recipes!`);

  const combinedRecipes = [...EXISTING_RECIPES, ...newRecipes];
  console.log(`📊 Grand Total Unified Recipes: ${combinedRecipes.length}`);

  // Count by category
  const updatedCategories = SEEDED_CATEGORIES.map(cat => {
    const count = combinedRecipes.filter(r => r.categoryId === cat.id).length;
    return {
      ...cat,
      recipesCount: count,
    };
  });

  console.log('Breakdown by category:');
  updatedCategories.forEach(c => console.log(` - ${c.name}: ${c.recipesCount} recipes`));

  // Write to server and mobile fallback files
  const serverPath = path.join(__dirname, '../apps/server/src/services/fallbackData.ts');
  const mobilePath = path.join(__dirname, '../apps/mobile/src/services/fallbackData.ts');

  const fileContent = `import { Category, Recipe } from '@kusinadex/types';

export const SEEDED_CATEGORIES: Category[] = ${JSON.stringify(updatedCategories, null, 2)};

export const SEEDED_RECIPES: Recipe[] = ${JSON.stringify(combinedRecipes, null, 2)};
`;

  fs.writeFileSync(serverPath, fileContent, 'utf8');
  fs.writeFileSync(mobilePath, fileContent, 'utf8');

  console.log(`✅ Updated server fallback: ${serverPath}`);
  console.log(`✅ Updated mobile fallback: ${mobilePath}`);
})();
