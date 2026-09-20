const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../apps/server/src/services/fallbackData.ts');
const mobilePath = path.join(__dirname, '../apps/mobile/src/services/fallbackData.ts');

const raw = fs.readFileSync(serverPath, 'utf8');
const catMatch = raw.match(/export const SEEDED_CATEGORIES: Category\[\] = (\[[\s\S]*?\]);\s*export const SEEDED_RECIPES/);
const recMatch = raw.match(/export const SEEDED_RECIPES: Recipe\[\] = (\[[\s\S]*?\]);\s*$/);

const categories = JSON.parse(catMatch[1]);
const currentRecipes = JSON.parse(recMatch[1]);

console.log(`Current recipe count: ${currentRecipes.length}`);

const ramenRecipes = [
  {
    id: 'rec_ramen_tonkotsu',
    slug: 'classic-chashu-tonkotsu-ramen',
    title: 'Classic Chashu Pork Tonkotsu Ramen',
    englishTitle: 'Rich Pork Bone Broth Ramen with Melt-in-Mouth Chashu',
    description: 'Velvety, collagen-rich pork bone broth paired with tender rolled pork belly chashu slices, soft-boiled marinated ajitsuke tamago egg, wood ear mushrooms, and springy ramen noodles.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 120,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Asian Fusion / Japanese-Pinoy Favorite',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Pork',
    cutOrType: 'Ramen & Mami',
    ingredients: [
      { id: 'ing_rm_1', name: 'Fresh ramen noodles', amount: 400, unit: 'g', notes: 'Al dente cooked', isOptional: false },
      { id: 'ing_rm_2', name: 'Pork neck / marrow bones', amount: 800, unit: 'g', notes: 'Blanched and cleaned', isOptional: false },
      { id: 'ing_rm_3', name: 'Pork belly (liempo)', amount: 500, unit: 'g', notes: 'Rolled and tied for chashu', isOptional: false },
      { id: 'ing_rm_4', name: 'Garlic heads (halved)', amount: 2, unit: 'heads', notes: 'Unpeeled', isOptional: false },
      { id: 'ing_rm_5', name: 'Fresh ginger slices', amount: 4, unit: 'slices', notes: 'Thick cut', isOptional: false },
      { id: 'ing_rm_6', name: 'Green scallions', amount: 4, unit: 'stalks', notes: 'Finely sliced', isOptional: false },
      { id: 'ing_rm_7', name: 'Soy sauce (shoyu)', amount: 60, unit: 'ml', notes: 'For tare and braising', isOptional: false },
      { id: 'ing_rm_8', name: 'Mirin or brown sugar', amount: 45, unit: 'ml', notes: 'Sweet rice seasoning', isOptional: false },
      { id: 'ing_rm_9', name: 'Sesame oil', amount: 15, unit: 'ml', notes: 'Pure toasted', isOptional: false },
      { id: 'ing_rm_10', name: 'Ajitsuke soft-boiled eggs', amount: 4, unit: 'pieces', notes: 'Halved lengthwise', isOptional: false },
      { id: 'ing_rm_11', name: 'Nori seaweed sheets', amount: 4, unit: 'pieces', notes: 'Crispy garnish', isOptional: false },
      { id: 'ing_rm_12', name: 'Wood ear mushrooms (kikurage)', amount: 50, unit: 'g', notes: 'Thinly shredded', isOptional: false },
    ],
    steps: [
      {
        id: 'step_rm_1',
        stepNumber: 1,
        instruction: 'Blanch pork marrow bones in rolling boiling water for 10 minutes to draw out impurities. Drain and rinse thoroughly under running cold water.',
        timerMinutes: 10,
        tips: 'Thorough blanching guarantees a silky, white broth without bitterness.',
      },
      {
        id: 'step_rm_2',
        stepNumber: 2,
        instruction: 'In a large stockpot, simmer the cleaned bones with garlic halves, ginger, and scallion whites in 2.5L water on a rolling boil for 2 hours until the broth turns rich, milky white, and opaque.',
        timerMinutes: 120,
        tips: 'Keep at a steady boil rather than a gentle simmer so marrow fats emulsify into the soup.',
      },
      {
        id: 'step_rm_3',
        stepNumber: 3,
        instruction: 'In a saucepan, braise the rolled pork belly with soy sauce, water, mirin, and crushed garlic for 45 minutes until fork-tender. Cool slightly, remove twine, and slice into thin chashu rounds.',
        timerMinutes: 45,
        tips: 'Chill the cooked pork belly for 15 minutes in the freezer to make slicing paper-thin rounds easy.',
      },
      {
        id: 'step_rm_4',
        stepNumber: 4,
        instruction: 'Boil fresh ramen noodles in salted water for 2-3 minutes until springy and al dente. Shake off excess water thoroughly.',
        timerMinutes: 3,
        tips: 'Never rinse ramen noodles with cold water after boiling; retain their starch for broth cling.',
      },
      {
        id: 'step_rm_5',
        stepNumber: 5,
        instruction: 'Assemble bowls: spoon 2 tablespoons of braising tare and sesame oil into bowls, ladle boiling tonkotsu broth, fold in noodles, and arrange chashu rounds, ramen egg, kikurage, nori, and scallions.',
        timerMinutes: null,
        tips: 'Serve steaming hot immediately for optimal texture.',
      },
    ],
  },
  {
    id: 'rec_ramen_tantanmen',
    slug: 'spicy-tantanmen-ramen',
    title: 'Spicy Tantanmen Pork Ramen',
    englishTitle: 'Sesame Chili Noodle Soup with Savory Minced Pork',
    description: 'A deeply satisfying, creamy ramen featuring a roasted sesame-chili broth topped with spicy sweet-savory minced pork (niku-miso), blanched baby bok choy, and fragrant chili oil.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 3,
    spiceLevel: 'SPICY',
    originRegion: 'Asian Fusion',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Pork',
    cutOrType: 'Ramen & Mami',
    ingredients: [
      { id: 'ing_tan_1', name: 'Fresh ramen noodles', amount: 350, unit: 'g', notes: 'Fresh yellow noodles', isOptional: false },
      { id: 'ing_tan_2', name: 'Ground pork (giniling)', amount: 300, unit: 'g', notes: 'Lean with touch of fat', isOptional: false },
      { id: 'ing_tan_3', name: 'Roasted white sesame paste / tahini', amount: 45, unit: 'g', notes: 'For rich nutty broth', isOptional: false },
      { id: 'ing_tan_4', name: 'Chili oil with garlic (rayu)', amount: 30, unit: 'ml', notes: 'Adjust to heat preference', isOptional: false },
      { id: 'ing_tan_5', name: 'Soy sauce', amount: 30, unit: 'ml', notes: 'Dark soy sauce', isOptional: false },
      { id: 'ing_tan_6', name: 'Rich chicken or pork stock', amount: 800, unit: 'ml', notes: 'Piping hot', isOptional: false },
      { id: 'ing_tan_7', name: 'Minced garlic cloves', amount: 4, unit: 'cloves', notes: 'Finely minced', isOptional: false },
      { id: 'ing_tan_8', name: 'Minced fresh ginger', amount: 15, unit: 'g', notes: 'Finely grated', isOptional: false },
      { id: 'ing_tan_9', name: 'Hoisin or sweet soybean paste', amount: 20, unit: 'ml', notes: 'Adds savory sweetness', isOptional: false },
      { id: 'ing_tan_10', name: 'Baby bok choy', amount: 3, unit: 'heads', notes: 'Halved lengthwise', isOptional: false },
      { id: 'ing_tan_11', name: 'Spring onions', amount: 3, unit: 'stalks', notes: 'Chopped for garnish', isOptional: false },
    ],
    steps: [
      {
        id: 'step_tan_1',
        stepNumber: 1,
        instruction: 'Heat 1 tbsp oil in a wok over medium heat. Sauté garlic and ginger for 1 minute, then add ground pork with hoisin sauce, soy sauce, and 1 tsp chili oil. Cook until browned and caramelized (8 mins).',
        timerMinutes: 8,
        tips: 'Let the minced pork get nicely browned and sticky for maximum flavor punch.',
      },
      {
        id: 'step_tan_2',
        stepNumber: 2,
        instruction: 'In a soup pot, bring stock to a gentle simmer. In each serving bowl, whisk 1.5 tbsp sesame paste, 1 tbsp soy sauce, and 1 tbsp chili oil. Pour 250ml hot stock into each bowl and whisk until emulsified.',
        timerMinutes: 5,
        tips: 'Whisking the sesame paste directly into hot broth creates a luxuriously creamy emulsion.',
      },
      {
        id: 'step_tan_3',
        stepNumber: 3,
        instruction: 'Blanch halved baby bok choy in boiling water for 60 seconds; drain immediately so stems stay crisp and bright green.',
        timerMinutes: 1,
        tips: 'Do not overcook greens; crisp texture contrasts wonderfully with chewy noodles.',
      },
      {
        id: 'step_tan_4',
        stepNumber: 4,
        instruction: 'Boil fresh ramen noodles for 2 minutes; shake dry and gently lay into the bowls of creamy sesame broth.',
        timerMinutes: 2,
        tips: 'Shake off cooking water vigorously to keep the rich sesame broth undiluted.',
      },
      {
        id: 'step_tan_5',
        stepNumber: 5,
        instruction: 'Top each bowl with generous mounds of savory minced pork, blanched bok choy, chopped spring onions, and an extra swirl of chili oil.',
        timerMinutes: null,
        tips: 'Mix well before eating to coat every noodle in sesame-chili goodness.',
      },
    ],
  },
  {
    id: 'rec_ramen_shoyu',
    slug: 'tokyo-style-shoyu-ramen',
    title: 'Tokyo Style Shoyu Chicken Ramen',
    englishTitle: 'Classic Clear Soy Broth Ramen with Tender Chicken',
    description: 'A clear, aromatic chicken and dashi broth seasoned with artisanal soy sauce tare, topped with sliced chicken chashu, tender bamboo shoots, narutomaki fish cake, and a seasoned soft egg.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Asian Fusion',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Chicken',
    cutOrType: 'Ramen & Mami',
    ingredients: [
      { id: 'ing_shy_1', name: 'Fresh ramen noodles', amount: 400, unit: 'g', notes: 'Straight yellow noodles', isOptional: false },
      { id: 'ing_shy_2', name: 'Chicken breast or thigh fillets', amount: 400, unit: 'g', notes: 'Boneless and skinless', isOptional: false },
      { id: 'ing_shy_3', name: 'Clear chicken stock', amount: 1200, unit: 'ml', notes: 'Simmered with ginger and onions', isOptional: false },
      { id: 'ing_shy_4', name: 'Japanese soy sauce (shoyu)', amount: 75, unit: 'ml', notes: 'For artisanal tare', isOptional: false },
      { id: 'ing_shy_5', name: 'Mirin or rice wine', amount: 30, unit: 'ml', notes: 'Adds shine and subtle sweetness', isOptional: false },
      { id: 'ing_shy_6', name: 'Garlic cloves (crushed)', amount: 4, unit: 'cloves', notes: 'Lightly bruised', isOptional: false },
      { id: 'ing_shy_7', name: 'Fresh ginger slices', amount: 3, unit: 'slices', notes: 'Peeled', isOptional: false },
      { id: 'ing_shy_8', name: 'Ajitsuke soft-boiled eggs', amount: 4, unit: 'pieces', notes: 'Halved', isOptional: false },
      { id: 'ing_shy_9', name: 'Menma (seasoned bamboo shoots)', amount: 50, unit: 'g', notes: 'Traditional ramen topping', isOptional: false },
      { id: 'ing_shy_10', name: 'Narutomaki fish cake', amount: 8, unit: 'pieces', notes: 'Sliced into swirl discs', isOptional: false },
      { id: 'ing_shy_11', name: 'Nori seaweed sheets', amount: 4, unit: 'pieces', notes: 'Square cut', isOptional: false },
      { id: 'ing_shy_12', name: 'Scallions', amount: 3, unit: 'stalks', notes: 'Finely shredded curls', isOptional: false },
    ],
    steps: [
      {
        id: 'step_shy_1',
        stepNumber: 1,
        instruction: 'In a small saucepan, simmer soy sauce, mirin, crushed garlic, and ginger over low heat for 10 minutes to create concentrated shoyu tare. Strain and set aside.',
        timerMinutes: 10,
        tips: 'The tare is the flavor soul of Tokyo ramen; do not allow it to boil vigorously.',
      },
      {
        id: 'step_shy_2',
        stepNumber: 2,
        instruction: 'Sear chicken fillets in a skillet with 1 tbsp oil until golden on both sides. Add 2 tablespoons of tare, cover, and braise for 10 minutes until juicy. Slice into chashu ribbons.',
        timerMinutes: 12,
        tips: 'Rest the chicken for 5 minutes before slicing so juices stay inside.',
      },
      {
        id: 'step_shy_3',
        stepNumber: 3,
        instruction: 'Bring clear chicken stock to a steaming simmer in a separate pot.',
        timerMinutes: 5,
        tips: 'Keep the stock crystal-clear by skimming any froth from the surface.',
      },
      {
        id: 'step_shy_4',
        stepNumber: 4,
        instruction: 'Boil fresh ramen noodles for 2-3 minutes until al dente; drain vigorously.',
        timerMinutes: 3,
        tips: 'Cook noodles in plenty of boiling water to keep them from sticking.',
      },
      {
        id: 'step_shy_5',
        stepNumber: 5,
        instruction: 'Add 2 tbsp tare to each bowl and fill with 300ml hot chicken broth. Place noodles in, then decorate with chicken chashu, ramen egg half, bamboo shoots, narutomaki swirls, nori, and scallions.',
        timerMinutes: null,
        tips: 'Slurp noodles while steaming hot for full aromatic appreciation.',
      },
    ],
  },
  {
    id: 'rec_ramen_beef_pares',
    slug: 'pinoy-beef-pares-ramen',
    title: 'Pinoy Fusion Beef Pares Ramen',
    englishTitle: 'Sweet-Savory Braised Beef Brisket & Star Anise Ramen',
    description: 'The ultimate Filipino-Japanese comfort mashup! Tender braised beef brisket and tendon in aromatic star anise broth, served over springy ramen noodles with crispy toasted garlic, boiled egg, and fresh scallions.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 75,
    servings: 4,
    spiceLevel: 'MILD',
    originRegion: 'Manila Fusion',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Beef',
    cutOrType: 'Ramen & Mami',
    ingredients: [
      { id: 'ing_par_1', name: 'Fresh ramen noodles', amount: 400, unit: 'g', notes: 'Springy wheat noodles', isOptional: false },
      { id: 'ing_par_2', name: 'Beef brisket or chuck', amount: 600, unit: 'g', notes: 'Cut into bite-sized cubes', isOptional: false },
      { id: 'ing_par_3', name: 'Star anise pods', amount: 3, unit: 'pieces', notes: 'Whole pods', isOptional: false },
      { id: 'ing_par_4', name: 'Soy sauce', amount: 60, unit: 'ml', notes: 'Premium dark soy sauce', isOptional: false },
      { id: 'ing_par_5', name: 'Brown sugar', amount: 30, unit: 'g', notes: 'For signature pares glaze', isOptional: false },
      { id: 'ing_par_6', name: 'Beef stock or bone broth', amount: 1500, unit: 'ml', notes: 'Rich beef broth', isOptional: false },
      { id: 'ing_par_7', name: 'Garlic head (minced)', amount: 1, unit: 'head', notes: 'Fried golden for topping', isOptional: false },
      { id: 'ing_par_8', name: 'Yellow onion (chopped)', amount: 1, unit: 'piece', notes: 'Medium size', isOptional: false },
      { id: 'ing_par_9', name: 'Fresh ginger (minced)', amount: 15, unit: 'g', notes: 'Minced finely', isOptional: false },
      { id: 'ing_par_10', name: 'Soft-boiled eggs', amount: 4, unit: 'pieces', notes: 'Halved', isOptional: false },
      { id: 'ing_par_11', name: 'Crispy chili garlic crisp', amount: 20, unit: 'g', notes: 'For spicy kick', isOptional: false },
      { id: 'ing_par_12', name: 'Fresh scallions', amount: 4, unit: 'stalks', notes: 'Chopped', isOptional: false },
    ],
    steps: [
      {
        id: 'step_par_1',
        stepNumber: 1,
        instruction: 'Heat 2 tbsp oil in a pot. Fry minced garlic over medium-low heat until fragrant, golden brown, and crunchy (4 mins). Remove garlic with a slotted spoon and set aside for topping.',
        timerMinutes: 4,
        tips: 'Do not burn garlic; remove immediately when pale gold as residual heat continues browning.',
      },
      {
        id: 'step_par_2',
        stepNumber: 2,
        instruction: 'In the remaining fragrant garlic oil, sauté onions and ginger until soft. Add cubed beef brisket and sear until browned on all edges (6 mins).',
        timerMinutes: 6,
        tips: 'Searing beef builds deep caramelized fond on the bottom of the pot.',
      },
      {
        id: 'step_par_3',
        stepNumber: 3,
        instruction: 'Add soy sauce, brown sugar, whole star anise pods, and 1.5L beef stock. Bring to a rolling boil, then reduce heat to low, cover, and simmer for 60 minutes until brisket is fork-tender and aromatic.',
        timerMinutes: 60,
        tips: 'Star anise gives that irresistible, nostalgic Manila Pares aroma.',
      },
      {
        id: 'step_par_4',
        stepNumber: 4,
        instruction: 'Boil fresh ramen noodles in salted water for 2-3 minutes; drain thoroughly and divide into large soup bowls.',
        timerMinutes: 3,
        tips: 'Cook noodles slightly firmer than usual as hot broth continues cooking them.',
      },
      {
        id: 'step_par_5',
        stepNumber: 5,
        instruction: 'Ladle generous tender beef chunks and piping hot star anise broth over noodles. Crown with crunchy toasted garlic, egg halves, chili garlic crisp, and fresh scallions.',
        timerMinutes: null,
        tips: 'The combination of sweet-savory beef, crunchy garlic, and chewy ramen noodles is heaven in a bowl.',
      },
    ],
  },
  {
    id: 'rec_ramen_miso_corn',
    slug: 'creamy-miso-butter-corn-ramen',
    title: 'Creamy Garlic Miso Butter Corn Ramen',
    englishTitle: 'Sapporo Style White Miso Ramen with Sweet Corn & Butter',
    description: 'Warm, comforting ramen with a rich white and red miso broth, topped with sweet golden buttered corn kernels, sautéed bean sprouts, garlic chips, and springy noodles.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 3,
    spiceLevel: 'NONE',
    originRegion: 'Asian Fusion',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Vegetables',
    cutOrType: 'Ramen & Mami',
    ingredients: [
      { id: 'ing_mso_1', name: 'Fresh ramen noodles', amount: 350, unit: 'g', notes: 'Wavy ramen noodles', isOptional: false },
      { id: 'ing_mso_2', name: 'White & red miso paste', amount: 60, unit: 'g', notes: 'Blended for balanced savory depth', isOptional: false },
      { id: 'ing_mso_3', name: 'Sweet corn kernels', amount: 150, unit: 'g', notes: 'Fresh or canned sweet corn', isOptional: false },
      { id: 'ing_mso_4', name: 'Salted butter', amount: 45, unit: 'g', notes: 'Divided into pats', isOptional: false },
      { id: 'ing_mso_5', name: 'Chicken or vegetable stock', amount: 900, unit: 'ml', notes: 'Rich stock', isOptional: false },
      { id: 'ing_mso_6', name: 'Fresh bean sprouts (togue)', amount: 100, unit: 'g', notes: 'Rinsed and dried', isOptional: false },
      { id: 'ing_mso_7', name: 'Garlic cloves (thinly sliced)', amount: 6, unit: 'cloves', notes: 'For crispy garlic chips', isOptional: false },
      { id: 'ing_mso_8', name: 'Pure sesame oil', amount: 15, unit: 'ml', notes: 'Fragrant', isOptional: false },
      { id: 'ing_mso_9', name: 'Green scallions', amount: 3, unit: 'stalks', notes: 'Finely sliced', isOptional: false },
      { id: 'ing_mso_10', name: 'Toasted white sesame seeds', amount: 10, unit: 'g', notes: 'For garnish', isOptional: false },
    ],
    steps: [
      {
        id: 'step_mso_1',
        stepNumber: 1,
        instruction: 'Melt 15g butter with sesame oil in a skillet. Sauté sliced garlic over medium heat until pale golden and crisp (3 mins); remove garlic chips and reserve garlic butter.',
        timerMinutes: 3,
        tips: 'Garlic butter adds profound savory aroma to both the vegetables and broth.',
      },
      {
        id: 'step_mso_2',
        stepNumber: 2,
        instruction: 'In the same pan with garlic butter, toss sweet corn kernels and bean sprouts for 2 minutes until lightly blistered and sweet; set aside.',
        timerMinutes: 2,
        tips: 'Keep bean sprouts crunchy; do not let them wilt completely.',
      },
      {
        id: 'step_mso_3',
        stepNumber: 3,
        instruction: 'Bring stock to a gentle simmer in a pot. Reduce heat to low. Ladle out 1 cup of warm broth into a bowl, dissolve miso paste completely, then stir back into the pot.',
        timerMinutes: 5,
        tips: 'Never boil miso vigorously after dissolving to protect delicate probiotic notes and aromas.',
      },
      {
        id: 'step_mso_4',
        stepNumber: 4,
        instruction: 'Boil fresh ramen noodles for 2 minutes in salted water; drain well and portion into heated bowls.',
        timerMinutes: 2,
        tips: 'Wavy noodles hold miso broth exceptionally well.',
      },
      {
        id: 'step_mso_5',
        stepNumber: 5,
        instruction: 'Ladle creamy miso broth over noodles. Top with generous sweet buttered corn, crunchy bean sprouts, garlic chips, scallions, sesame seeds, and a fresh pat of butter that slowly melts into the broth.',
        timerMinutes: null,
        tips: 'As the butter melts into the miso, the broth turns into liquid gold.',
      },
    ],
  },
];

// Combine recipes avoiding duplicate IDs
const existingIds = new Set(currentRecipes.map(r => r.id));
const newRamenToAdd = ramenRecipes.filter(r => !existingIds.has(r.id));

const allCombined = [...currentRecipes, ...newRamenToAdd];
console.log(`Added ${newRamenToAdd.length} Ramen recipes!`);
console.log(`New total catalog recipes: ${allCombined.length}`);

// Update category subcategories and recipe counts
const updatedCategories = categories.map(cat => {
  const count = allCombined.filter(r => r.categoryId === cat.id).length;
  if (cat.id === 'cat_noodles') {
    return {
      ...cat,
      subCategories: ['Pancit', 'Ramen & Mami', 'Soups & Porridge', 'Pancakes & Crepes'],
      recipesCount: count,
    };
  }
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

console.log(`\n✅ Saved updated catalog with Ramen to server: ${serverPath}`);
console.log(`✅ Saved updated catalog with Ramen to mobile: ${mobilePath}`);
