const fs = require('fs');
const path = require('path');
const { fetchPage, parseDuration, parseIngredient, classifyRecipe } = require('./panlasangHelpers');

// Load current 287 recipes from fallbackData.ts
const serverPath = path.join(__dirname, '../apps/server/src/services/fallbackData.ts');
const mobilePath = path.join(__dirname, '../apps/mobile/src/services/fallbackData.ts');

const raw = fs.readFileSync(serverPath, 'utf8');
const catMatch = raw.match(/export const SEEDED_CATEGORIES: Category\[\] = (\[[\s\S]*?\]);\s*export const SEEDED_RECIPES/);
const recMatch = raw.match(/export const SEEDED_RECIPES: Recipe\[\] = (\[[\s\S]*?\]);\s*$/);

const CURRENT_CATEGORIES = JSON.parse(catMatch[1]);
const CURRENT_RECIPES = JSON.parse(recMatch[1]);

console.log(`Current catalog total recipes: ${CURRENT_RECIPES.length}`);
console.log(`Current Beef: ${CURRENT_RECIPES.filter(r => r.categoryId === 'cat_beef').length}`);
console.log(`Current Chicken: ${CURRENT_RECIPES.filter(r => r.categoryId === 'cat_chicken').length}`);

// Read all sitemaps
const s1 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/851/content.md', 'utf8');
const s2 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/909/content.md', 'utf8');
const s3 = fs.readFileSync('C:/Users/liamm/.gemini/antigravity/brain/70c3112a-49fb-41d2-a6da-3146ee4247d7/.system_generated/steps/913/content.md', 'utf8');

const allUrls = [
  ...s1.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g),
  ...s2.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g),
  ...s3.matchAll(/<loc>(https:\/\/panlasangpinoy\.com\/[^<]+)<\/loc>/g)
].map(m => m[1]);

const existingSlugs = new Set(CURRENT_RECIPES.map(r => r.slug));
const existingTitles = new Set(CURRENT_RECIPES.map(r => r.title.toLowerCase().trim()));
const existingSources = new Set(CURRENT_RECIPES.map(r => r.sourceUrl));

const nonRecipes = ['school', 'diet', 'hospital', 'what-is', 'how-the', 'benefits', 'substitute', 'difference', 'reasons-why', 'food-list', 'top-', 'guide-', 'review', 'vs-', 'panlasang-pinoy-recipes'];

const beefTerms = ['beef', 'baka', 'bulalo', 'bistek', 'caldereta', 'kaldereta', 'tapa', 'pares', 'mechado', 'morcon', 'oxtail', 'papaitan', 'nilagang-baka', 'kansi', 'salpicao', 'callos'];
const chickenTerms = ['chicken', 'manok', 'inasal', 'tinola', 'afritada', 'pastil', 'pininyahan', 'binakol', 'pastel', 'curry'];

// Filter candidate URLs prioritizing genuine beef and chicken posts
const targetBeefUrls = allUrls.filter(u => {
  const lower = u.toLowerCase();
  if (nonRecipes.some(k => lower.includes(k))) return false;
  if (!lower.includes('recipe') && !lower.includes('-how-to-cook')) return false;
  if (existingSources.has(u)) return false;
  return beefTerms.some(t => lower.includes(t));
});

const targetChickenUrls = allUrls.filter(u => {
  const lower = u.toLowerCase();
  if (nonRecipes.some(k => lower.includes(k))) return false;
  if (!lower.includes('recipe') && !lower.includes('-how-to-cook')) return false;
  if (existingSources.has(u)) return false;
  return chickenTerms.some(t => lower.includes(t));
});

console.log(`Found ${targetBeefUrls.length} candidate Beef URLs.`);
console.log(`Found ${targetChickenUrls.length} candidate Chicken URLs.`);

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

// Concurrent ingestion pool
async function ingestUrls(urls, allowedCategories = ['cat_beef', 'cat_chicken'], targetLimit = 60, concurrency = 10) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < urls.length && results.length < targetLimit) {
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

        if (existingTitles.has(title.toLowerCase()) || existingSlugs.has(`pp-${slug}`)) {
          continue;
        }

        const rawIngredients = schema.recipeIngredient || [];
        const classification = classifyRecipe(title, schema.description || '', schema.recipeCategory || [], rawIngredients);

        // Only keep if classified as beef or chicken
        if (!allowedCategories.includes(classification.categoryId)) {
          continue;
        }

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
              tips: 'Maintain steady simmer to keep the meat tender and flavors fully absorbed.',
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
        existingSlugs.add(`pp-${slug}`);
        results.push(recipeObj);
        console.log(`[${results.length}] Ingested: ${title} -> ${classification.categoryId} (${classification.cutOrType})`);
      } catch (e) {}
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

(async () => {
  console.log('🥩 Ingesting new Beef recipes...');
  const newBeef = await ingestUrls(targetBeefUrls, ['cat_beef'], 40, 10);
  console.log(`✅ Finished Beef: Ingested ${newBeef.length} new Beef recipes.`);

  console.log('🍗 Ingesting new Chicken recipes...');
  const newChicken = await ingestUrls(targetChickenUrls, ['cat_chicken'], 50, 10);
  console.log(`✅ Finished Chicken: Ingested ${newChicken.length} new Chicken recipes.`);

  const allCombined = [...CURRENT_RECIPES, ...newBeef, ...newChicken];
  console.log(`\n🎉 Grand Total Recipes: ${allCombined.length}`);

  const updatedCategories = CURRENT_CATEGORIES.map(cat => {
    const count = allCombined.filter(r => r.categoryId === cat.id).length;
    return {
      ...cat,
      recipesCount: count,
    };
  });

  console.log('Updated Category Breakdown:');
  updatedCategories.forEach(c => console.log(` - ${c.name}: ${c.recipesCount} recipes`));

  const fileContent = `import { Category, Recipe } from '@kusinadex/types';

export const SEEDED_CATEGORIES: Category[] = ${JSON.stringify(updatedCategories, null, 2)};

export const SEEDED_RECIPES: Recipe[] = ${JSON.stringify(allCombined, null, 2)};
`;

  fs.writeFileSync(serverPath, fileContent, 'utf8');
  fs.writeFileSync(mobilePath, fileContent, 'utf8');

  console.log(`\n✅ Saved updated data to server: ${serverPath}`);
  console.log(`✅ Saved updated data to mobile: ${mobilePath}`);
})();
