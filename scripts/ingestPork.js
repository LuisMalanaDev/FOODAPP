const fs = require('fs');
const path = require('path');
const { fetchPage, parseDuration, parseIngredient, classifyRecipe } = require('./panlasangHelpers');

// Load current recipes from fallbackData.ts
const serverPath = path.join(__dirname, '../apps/server/src/services/fallbackData.ts');
const mobilePath = path.join(__dirname, '../apps/mobile/src/services/fallbackData.ts');

const raw = fs.readFileSync(serverPath, 'utf8');
const catMatch = raw.match(/export const SEEDED_CATEGORIES: Category\[\] = (\[[\s\S]*?\]);\s*export const SEEDED_RECIPES/);
const recMatch = raw.match(/export const SEEDED_RECIPES: Recipe\[\] = (\[[\s\S]*?\]);\s*$/);

const CURRENT_CATEGORIES = JSON.parse(catMatch[1]);
const CURRENT_RECIPES = JSON.parse(recMatch[1]);

console.log(`Initial total recipes: ${CURRENT_RECIPES.length}`);
console.log(`Initial Pork count: ${CURRENT_RECIPES.filter(r => r.categoryId === 'cat_pork').length}`);

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
const porkTerms = [
  'pork', 'baboy', 'liempo', 'lechon', 'adobo', 'sinigang', 'dinuguan', 'bagnet',
  'humba', 'menudo', 'sisig', 'pata', 'chicharon', 'igado', 'bopis', 'embutido',
  'binagoongan', 'hamonado', 'pork-chops', 'ribs', 'belly', 'estofado', 'tokwa-baboy',
  'tokwat-baboy', 'pork-giniling', 'spareribs', 'pork-pochero', 'pork-steak'
];

// Prioritize genuine Pork dishes
const targetPorkUrls = allUrls.filter(u => {
  const lower = u.toLowerCase();
  if (nonRecipes.some(k => lower.includes(k))) return false;
  if (!lower.includes('recipe') && !lower.includes('-how-to-cook')) return false;
  if (existingSources.has(u)) return false;
  // Discard clear chicken / beef / seafood if "pork" or "baboy" is not in URL
  if ((lower.includes('chicken') || lower.includes('manok') || lower.includes('beef') || lower.includes('baka') || lower.includes('bangus') || lower.includes('tilapia') || lower.includes('pusit')) && !lower.includes('pork') && !lower.includes('baboy')) {
    return false;
  }
  return porkTerms.some(t => lower.includes(t));
});

console.log(`Found ${targetPorkUrls.length} candidate Pork URLs.`);

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
async function ingestUrls(urls, targetLimit = 50, concurrency = 10) {
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

        // Strictly verify that it is Pork
        if (classification.categoryId !== 'cat_pork') {
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
              tips: 'Simmer gently to render the pork fat and allow the savory sauce to penetrate deeply.',
            };
          }).filter(s => s.instruction.length > 0);
        }

        if (steps.length === 0) continue;

        const recipeObj = {
          id: `rec_pp_${slug.replace(/[^a-zA-Z0-9]/g, '_')}`,
          slug: `pp-${slug}`,
          title,
          englishTitle: title,
          description: schema.description ? schema.description.slice(0, 250).trim() : `Authentic Filipino pork dish ${title} prepared with traditional methods.`,
          prepTimeMinutes: prepMins,
          cookTimeMinutes: cookMins,
          servings,
          spiceLevel: title.toLowerCase().includes('bicol') || title.toLowerCase().includes('spicy') ? 'SPICY' : 'NONE',
          originRegion: 'National / Traditional',
          difficulty: cookMins > 45 ? 'MEDIUM' : 'EASY',
          imageUrl,
          featured: false,
          isExternal: true,
          sourceUrl: url,
          categoryId: 'cat_pork',
          mainIngredient: 'Pork',
          cutOrType: classification.cutOrType,
          ingredients,
          steps,
        };

        existingTitles.add(title.toLowerCase());
        existingSlugs.add(`pp-${slug}`);
        results.push(recipeObj);
        console.log(`[${results.length}] Ingested Pork: ${title} (${classification.cutOrType})`);
      } catch (e) {}
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

(async () => {
  console.log('🐖 Starting Pork recipe ingestion...');
  const newPork = await ingestUrls(targetPorkUrls, 45, 10);
  console.log(`✅ Ingested ${newPork.length} new authentic Pork recipes!`);

  const allCombined = [...CURRENT_RECIPES, ...newPork];
  console.log(`\n🎉 Grand Total Recipes: ${allCombined.length}`);

  const updatedCategories = CURRENT_CATEGORIES.map(cat => {
    const count = allCombined.filter(r => r.categoryId === cat.id).length;
    return {
      ...cat,
      recipesCount: count,
    };
  });

  console.log('\nUpdated Category Breakdown:');
  updatedCategories.forEach(c => console.log(` - ${c.name}: ${c.recipesCount} recipes`));

  const fileContent = `import { Category, Recipe } from '@kusinadex/types';

export const SEEDED_CATEGORIES: Category[] = ${JSON.stringify(updatedCategories, null, 2)};

export const SEEDED_RECIPES: Recipe[] = ${JSON.stringify(allCombined, null, 2)};
`;

  fs.writeFileSync(serverPath, fileContent, 'utf8');
  fs.writeFileSync(mobilePath, fileContent, 'utf8');

  console.log(`\n✅ Successfully updated server fallbackData: ${serverPath}`);
  console.log(`✅ Successfully updated mobile fallbackData: ${mobilePath}`);
})();
