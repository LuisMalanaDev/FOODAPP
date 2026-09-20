const fs = require('fs');
const path = require('path');

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
    recipesCount: 8,
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
    recipesCount: 7,
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
    recipesCount: 7,
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
    recipesCount: 8,
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
    recipesCount: 7,
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
    recipesCount: 8,
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
    recipesCount: 9,
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
    recipesCount: 8,
  },
];

const SEEDED_RECIPES = [
  // ==========================================
  // PORK (BABOY)
  // ==========================================
  {
    id: 'rec_pork_chop_steak',
    slug: 'pinoy-pork-chop-steak',
    title: 'Pinoy Pork Chop Steak',
    englishTitle: 'Calamansi Soy Glazed Pork Chops',
    description: 'Tender bone-in pork chops pan-seared and simmered in a savory calamansi-soy reduction topped with sweet caramelized white onion rings.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'National / Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Pork Chops',
    ingredients: [
      { id: 'ing_pc_1', name: 'Bone-in pork chops (approx 2cm thick)', amount: 600, unit: 'g', notes: 'Trimmed excess fat', isOptional: false },
      { id: 'ing_pc_2', name: 'Fresh calamansi juice (or lemon)', amount: 60, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_pc_3', name: 'Premium soy sauce', amount: 80, unit: 'ml', notes: 'Dark soy sauce preferred', isOptional: false },
      { id: 'ing_pc_4', name: 'Garlic cloves', amount: 6, unit: 'cloves', notes: 'Crushed finely', isOptional: false },
      { id: 'ing_pc_5', name: 'Large white onions', amount: 2, unit: 'pieces', notes: 'Sliced into thick 1cm rings', isOptional: false },
      { id: 'ing_pc_6', name: 'Ground black pepper', amount: 1, unit: 'tsp', notes: 'Freshly cracked', isOptional: false },
      { id: 'ing_pc_7', name: 'Cooking oil', amount: 30, unit: 'ml', notes: 'For pan-frying', isOptional: false },
      { id: 'ing_pc_8', name: 'Water or pork stock', amount: 100, unit: 'ml', notes: 'To build pan gravy', isOptional: false }
    ],
    steps: [
      { id: 'step_pc_1', stepNumber: 1, instruction: 'Marinate pork chops in soy sauce, calamansi juice, crushed garlic, and black pepper for at least 30 minutes in the refrigerator.', timerMinutes: 30, tips: 'Do not over-marinate with citrus as acids can break down the meat texture prematurely.' },
      { id: 'step_pc_2', stepNumber: 2, instruction: 'Heat cooking oil in a wide heavy skillet over medium-high heat. Remove pork chops from marinade (reserve marinade liquid) and pan-sear each side for 4-5 minutes until golden brown crust forms.', timerMinutes: 10, tips: 'Ensure the pan is smoking hot before placing the chops to lock in natural juices.' },
      { id: 'step_pc_3', stepNumber: 3, instruction: 'Pour the reserved marinade and 100ml water into the skillet. Bring to a gentle boil, cover with lid, and simmer over low heat for 12 minutes until tender.', timerMinutes: 12, tips: 'Simmer gently so the pork remains juicy and absorbs the citrus-soy depth.' },
      { id: 'step_pc_4', stepNumber: 4, instruction: 'Add onion rings on top of the pork chops during the final 3 minutes of cooking. Cook until onions are soft-crisp and translucent.', timerMinutes: 3, tips: 'Leaving the onions slightly crisp provides a refreshing contrast to the rich pan sauce.' }
    ]
  },
  {
    id: 'rec_crispy_pork_chop',
    slug: 'crispy-breaded-pork-chops',
    title: 'Crispy Garlic Pork Chops',
    englishTitle: 'Golden Garlic-Crusted Fried Pork Chops',
    description: 'Thin-cut bone-in pork chops soaked in garlic-peppercorn brine, dredged in spiced cornstarch, and pan-fried to crisp perfection.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Pampanga',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Pork Chops',
    ingredients: [
      { id: 'ing_cpc_1', name: 'Bone-in pork chops', amount: 500, unit: 'g', notes: 'Pounded slightly for tenderness', isOptional: false },
      { id: 'ing_cpc_2', name: 'Fish sauce (patis)', amount: 25, unit: 'ml', notes: 'For savory umami depth', isOptional: false },
      { id: 'ing_cpc_3', name: 'Garlic powder', amount: 2, unit: 'tsp', notes: 'For even coating', isOptional: false },
      { id: 'ing_cpc_4', name: 'Cornstarch', amount: 100, unit: 'g', notes: 'For extra crunchy crust', isOptional: false },
      { id: 'ing_cpc_5', name: 'Cooking oil', amount: 150, unit: 'ml', notes: 'For shallow frying', isOptional: false }
    ],
    steps: [
      { id: 'step_cpc_1', stepNumber: 1, instruction: 'Season pounded pork chops with fish sauce, garlic powder, and black pepper. Rest for 15 minutes.', timerMinutes: 15, tips: 'Pounding with a meat mallet tenderizes the muscle fibers and ensures even cooking.' },
      { id: 'step_cpc_2', stepNumber: 2, instruction: 'Dredge each pork chop generously in cornstarch, shaking off excess powder.', timerMinutes: 5, tips: 'Cornstarch yields a significantly crispier crust than all-purpose flour.' },
      { id: 'step_cpc_3', stepNumber: 3, instruction: 'Fry in hot oil (175°C) for 5-6 minutes per side until deep golden brown and crunchy.', timerMinutes: 12, tips: 'Drain on a wire rack instead of paper towels so the bottom crust does not become soggy.' }
    ]
  },
  {
    id: 'rec_inihaw_liempo',
    slug: 'inihaw-na-liempo',
    title: 'Inihaw na Liempo',
    englishTitle: 'Charcoal-Grilled Sweet Soy Pork Belly',
    description: 'Thick succulent slabs of pork belly marinated in citrus, garlic, soy, and sweet banana ketchup, grilled over red-hot coconut charcoal.',
    prepTimeMinutes: 25,
    cookTimeMinutes: 20,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Southern Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Belly / Liempo',
    ingredients: [
      { id: 'ing_li_1', name: 'Pork belly (liempo)', amount: 800, unit: 'g', notes: 'Cut into 1.5cm thick strips', isOptional: false },
      { id: 'ing_li_2', name: 'Soy sauce', amount: 100, unit: 'ml', notes: 'Traditional dark soy', isOptional: false },
      { id: 'ing_li_3', name: 'Calamansi juice', amount: 50, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_li_4', name: 'Banana ketchup', amount: 60, unit: 'ml', notes: 'Provides color and sweet caramelization', isOptional: false },
      { id: 'ing_li_5', name: 'Brown sugar', amount: 2, unit: 'tbsp', notes: 'For sweet gloss', isOptional: false }
    ],
    steps: [
      { id: 'step_li_1', stepNumber: 1, instruction: 'Whisk soy sauce, calamansi juice, banana ketchup, brown sugar, and garlic. Marinate pork belly for at least 2 hours.', timerMinutes: 120, tips: 'Overnight marinating deepens the sweet-savory flavor through the thick pork belly.' },
      { id: 'step_li_2', stepNumber: 2, instruction: 'Prepare charcoal grill until coals are glowing with a light white ash coating.', timerMinutes: 15, tips: 'Avoid grilling directly over open flames to prevent charring the sweet marinade.' },
      { id: 'step_li_3', stepNumber: 3, instruction: 'Grill pork belly for 6-8 minutes per side, brushing continuously with basting marinade until caramelized and smoky.', timerMinutes: 16, tips: 'Baste only during the last few minutes so the sugars do not burn.' }
    ]
  },
  {
    id: 'rec_lechon_kawali',
    slug: 'crispy-lechon-kawali',
    title: 'Crispy Lechon Kawali',
    englishTitle: 'Deep-Fried Crispy Pork Belly Slab',
    description: 'Pork belly boiled with aromatics until tender, thoroughly chilled to dry the skin, then deep-fried until blistering and shattering crisp.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 60,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'National / Central Luzon',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Belly / Liempo',
    ingredients: [
      { id: 'ing_lk_1', name: 'Whole pork belly slab', amount: 1000, unit: 'g', notes: 'Skin-on, rectangular block', isOptional: false },
      { id: 'ing_lk_2', name: 'Garlic head', amount: 1, unit: 'head', notes: 'Halved crosswise', isOptional: false },
      { id: 'ing_lk_3', name: 'Bay leaves', amount: 4, unit: 'pieces', notes: 'Dried', isOptional: false },
      { id: 'ing_lk_4', name: 'Whole black peppercorns', amount: 1, unit: 'tbsp', notes: 'Whole', isOptional: false },
      { id: 'ing_lk_5', name: 'Sea salt', amount: 2, unit: 'tbsp', notes: 'For seasoning the skin', isOptional: false },
      { id: 'ing_lk_6', name: 'Cooking oil', amount: 1000, unit: 'ml', notes: 'For deep frying', isOptional: false }
    ],
    steps: [
      { id: 'step_lk_1', stepNumber: 1, instruction: 'Simmer pork belly slab in water with garlic, bay leaves, peppercorns, and salt for 45 minutes until fork-tender.', timerMinutes: 45, tips: 'Do not overboil to the point where the skin falls apart.' },
      { id: 'step_lk_2', stepNumber: 2, instruction: 'Remove pork, prick skin with a fork, rub with sea salt, and refrigerate uncovered for 4 hours to dry out moisture.', timerMinutes: 240, tips: 'A bone-dry skin is the absolute culinary secret to ultra-blistered crunchy crackling.' },
      { id: 'step_lk_3', stepNumber: 3, instruction: 'Deep fry in 185°C oil until skin blisters into crispy bubbles (approx 10-12 mins). Chop into bite-size cubes.', timerMinutes: 12, tips: 'Cover pot with a splatter screen as pork skin will pop vigorously.' }
    ]
  },
  {
    id: 'rec_sinigang_pork_ribs',
    slug: 'sinigang-na-pork-ribs',
    title: 'Sinigang na Baboy (Pork Ribs)',
    englishTitle: 'Tamarind Sour Broth with Pork Ribs',
    description: 'Slow-simmered pork spareribs rendered fork-tender in sour tamarind broth with water spinach, radish, and long green finger chilies.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 60,
    servings: 6,
    spiceLevel: 'MILD',
    originRegion: 'Calabarzon / Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Ribs',
    ingredients: [
      { id: 'ing_spr_1', name: 'Pork spareribs cut into pieces', amount: 800, unit: 'g', notes: 'Bone-in cuts', isOptional: false },
      { id: 'ing_spr_2', name: 'Fresh tamarind pulp or natural sampaloc base', amount: 60, unit: 'g', notes: 'Authentic souring agent', isOptional: false },
      { id: 'ing_spr_3', name: 'Ripe red tomatoes', amount: 3, unit: 'pieces', notes: 'Quartered', isOptional: false },
      { id: 'ing_spr_4', name: 'White radish (labanos)', amount: 1, unit: 'piece', notes: 'Sliced diagonally', isOptional: false },
      { id: 'ing_spr_5', name: 'Water spinach (kangkong)', amount: 150, unit: 'g', notes: 'Leaves and tender stems', isOptional: false },
      { id: 'ing_spr_6', name: 'Siling haba (green finger chili)', amount: 2, unit: 'pieces', notes: 'Whole for aroma', isOptional: false }
    ],
    steps: [
      { id: 'step_spr_1', stepNumber: 1, instruction: 'Boil pork ribs in rice wash or water with tomatoes and onions. Skim scum and simmer on low for 50 minutes until ribs are tender.', timerMinutes: 50, tips: 'Simmering low and slow extracts rich gelatin from the rib bones into the broth.' },
      { id: 'step_spr_2', stepNumber: 2, instruction: 'Add radish, eggplant, and tamarind souring agent. Simmer for 6 minutes.', timerMinutes: 6, tips: 'Add souring agent towards the end to keep its bright, refreshing acidity.' },
      { id: 'step_spr_3', stepNumber: 3, instruction: 'Add kangkong greens and green chilies. Turn off heat immediately and cover pot for 2 minutes.', timerMinutes: 2, tips: 'Residual steam cooks tender water spinach to bright emerald green without wilting.' }
    ]
  },
  {
    id: 'rec_pork_giniling_picadillo',
    slug: 'pork-giniling-picadillo',
    title: 'Pork Giniling (Picadillo)',
    englishTitle: 'Savory Stewed Ground Pork with Vegetables',
    description: 'Comforting home-style minced ground pork stewed with diced potatoes, sweet carrots, green peas, and plump raisins in tomato sauce.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'Manila / Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Ground (Giniling)',
    ingredients: [
      { id: 'ing_pg_1', name: 'Lean ground pork (giniling)', amount: 500, unit: 'g', notes: 'Freshly minced', isOptional: false },
      { id: 'ing_pg_2', name: 'Potatoes', amount: 2, unit: 'pieces', notes: 'Diced into small cubes', isOptional: false },
      { id: 'ing_pg_3', name: 'Carrots', amount: 1, unit: 'piece', notes: 'Diced same size as potatoes', isOptional: false },
      { id: 'ing_pg_4', name: 'Tomato sauce', amount: 200, unit: 'ml', notes: 'Pure tomato puree', isOptional: false },
      { id: 'ing_pg_5', name: 'Green peas', amount: 80, unit: 'g', notes: 'Fresh or frozen', isOptional: false },
      { id: 'ing_pg_6', name: 'Raisins', amount: 30, unit: 'g', notes: 'Sweet contrast', isOptional: true },
      { id: 'ing_pg_7', name: 'Hard-boiled quail eggs', amount: 8, unit: 'pieces', notes: 'Peeled', isOptional: true }
    ],
    steps: [
      { id: 'step_pg_1', stepNumber: 1, instruction: 'Sauté garlic and onions in oil until fragrant. Add ground pork and cook until juices run clear and meat lightly browns.', timerMinutes: 8, tips: 'Break up the ground pork with a wooden spoon so it does not clump together.' },
      { id: 'step_pg_2', stepNumber: 2, instruction: 'Pour in tomato sauce and 150ml water. Add diced potatoes and carrots. Cover and simmer for 12 minutes.', timerMinutes: 12, tips: 'Cut potato and carrot cubes evenly for uniform tenderness.' },
      { id: 'step_pg_3', stepNumber: 3, instruction: 'Fold in green peas, raisins, and quail eggs. Season with fish sauce and black pepper. Simmer for 5 more minutes.', timerMinutes: 5, tips: 'Serve hot over warm steamed white rice.' }
    ]
  },
  {
    id: 'rec_crispy_pata',
    slug: 'crispy-pata-knuckle',
    title: 'Crispy Pata',
    englishTitle: 'Crispy Deep-Fried Whole Pork Hock',
    description: 'Whole pork front hock slow-simmered with garlic, peppercorn, and bay leaves until gelatinous, then deep-fried until blistered and crunch-crackling.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 90,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Pampanga / Tagalog',
    difficulty: 'HARD',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Hock / Pata',
    ingredients: [
      { id: 'ing_cp_1', name: 'Whole pork knuckle / hock (front leg)', amount: 1500, unit: 'g', notes: 'Cleaned and scraped', isOptional: false },
      { id: 'ing_cp_2', name: 'Garlic head', amount: 2, unit: 'heads', notes: 'Crushed whole', isOptional: false },
      { id: 'ing_cp_3', name: 'Black peppercorns', amount: 2, unit: 'tbsp', notes: 'Whole', isOptional: false },
      { id: 'ing_cp_4', name: 'Bay leaves', amount: 5, unit: 'pieces', notes: 'Dried', isOptional: false },
      { id: 'ing_cp_5', name: 'Cooking oil', amount: 1500, unit: 'ml', notes: 'For deep-frying', isOptional: false }
    ],
    steps: [
      { id: 'step_cp_1', stepNumber: 1, instruction: 'Boil whole pork hock in seasoned water with garlic, peppercorns, and salt for 1.5 hours until tender but intact.', timerMinutes: 90, tips: 'Test with a skewer; it should penetrate the center with gentle resistance.' },
      { id: 'step_cp_2', stepNumber: 2, instruction: 'Cool and freeze or refrigerate overnight uncovered to dry out skin completely.', timerMinutes: 360, tips: 'Drying the skin thoroughly is mandatory for maximum blistering crunch.' },
      { id: 'step_cp_3', stepNumber: 3, instruction: 'Deep fry in high heat oil (190°C) until golden and blistered on all sides (approx 15-18 mins).', timerMinutes: 18, tips: 'Serve immediately with spiced cane vinegar, soy sauce, and crushed bird eye chilies.' }
    ]
  },
  {
    id: 'rec_sizzling_sisig',
    slug: 'sizzling-pork-sisig',
    title: 'Sizzling Pork Sisig',
    englishTitle: 'Crispy Chopped Pork Jowl on Sizzling Plate',
    description: 'The legendary Kapampangan dish of boiled, charcoal-grilled, and finely chopped pork face seasoned with calamansi, onions, and chili on a cast-iron platter.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 45,
    servings: 4,
    spiceLevel: 'SPICY',
    originRegion: 'Angeles City, Pampanga',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_pork',
    mainIngredient: 'Pork',
    cutOrType: 'Mask / Sisig',
    ingredients: [
      { id: 'ing_ss_1', name: 'Pork jowl / mask (and pork belly)', amount: 800, unit: 'g', notes: 'Cleaned', isOptional: false },
      { id: 'ing_ss_2', name: 'Chicken liver', amount: 150, unit: 'g', notes: 'Grilled and minced', isOptional: false },
      { id: 'ing_ss_3', name: 'Red onions', amount: 2, unit: 'pieces', notes: 'Finely minced', isOptional: false },
      { id: 'ing_ss_4', name: 'Calamansi juice', amount: 40, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_ss_5', name: 'Siling labuyo (red bird eye chilies)', amount: 4, unit: 'pieces', notes: 'Chopped finely', isOptional: false },
      { id: 'ing_ss_6', name: 'Egg', amount: 1, unit: 'piece', notes: 'Raw, cracked on sizzling platter', isOptional: true }
    ],
    steps: [
      { id: 'step_ss_1', stepNumber: 1, instruction: 'Boil pork mask and belly with salt and peppercorns for 40 minutes until tender. Drain and dry.', timerMinutes: 40, tips: 'Stage 1 of authentic Kapampangan Sisig: boil to tenderize.' },
      { id: 'step_ss_2', stepNumber: 2, instruction: 'Grill boiled pork and chicken liver over hot coals until charred and smoky. Finely dice into 0.5cm cubes.', timerMinutes: 15, tips: 'Stage 2: grill for authentic smoky char and crunch.' },
      { id: 'step_ss_3', stepNumber: 3, instruction: 'Sauté with minced onions, calamansi juice, chicken liver paste, and chopped chilies. Transfer onto smoking cast iron platter.', timerMinutes: 5, tips: 'Stage 3: serve sizzling with a freshly cracked egg on top.' }
    ]
  },

  // ==========================================
  // CHICKEN (MANOK)
  // ==========================================
  {
    id: 'rec_pininyahang_manok',
    slug: 'pininyahang-manok-breast',
    title: 'Pininyahang Manok',
    englishTitle: 'Pineapple Braised Chicken Breast',
    description: 'Lean, tender chicken breast cubes simmered in creamy milk broth with sweet pineapple chunks, carrots, and crisp bell peppers.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Luzon',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Breast',
    ingredients: [
      { id: 'ing_pm_1', name: 'Boneless skinless chicken breast', amount: 600, unit: 'g', notes: 'Cut into bite-sized cubes', isOptional: false },
      { id: 'ing_pm_2', name: 'Canned pineapple tidbits in juice', amount: 250, unit: 'g', notes: 'Juice reserved for sauce', isOptional: false },
      { id: 'ing_pm_3', name: 'Evaporated milk or coconut cream', amount: 150, unit: 'ml', notes: 'For rich velvety sauce', isOptional: false },
      { id: 'ing_pm_4', name: 'Carrots', amount: 1, unit: 'piece', notes: 'Sliced diagonally', isOptional: false },
      { id: 'ing_pm_5', name: 'Red and green bell peppers', amount: 2, unit: 'pieces', notes: 'Cut into squares', isOptional: false },
      { id: 'ing_pm_6', name: 'Garlic and red onion', amount: 4, unit: 'cloves', notes: 'Minced', isOptional: false }
    ],
    steps: [
      { id: 'step_pm_1', stepNumber: 1, instruction: 'Marinate chicken breast cubes in reserved pineapple juice with a pinch of salt for 15 minutes.', timerMinutes: 15, tips: 'Pineapple juice naturally tenderizes the lean chicken breast.' },
      { id: 'step_pm_2', stepNumber: 2, instruction: 'Sauté garlic and onions in olive oil until translucent. Add chicken and lightly sear for 5 minutes.', timerMinutes: 5, tips: 'Do not over-sear chicken breast so it remains juicy inside.' },
      { id: 'step_pm_3', stepNumber: 3, instruction: 'Pour in remaining marinade and carrots. Simmer for 10 minutes until carrots soften.', timerMinutes: 10, tips: 'Cover the skillet to let the flavors steam through.' },
      { id: 'step_pm_4', stepNumber: 4, instruction: 'Lower heat, pour evaporated milk, pineapple tidbits, and bell peppers. Simmer gently for 4 minutes until sauce thickens.', timerMinutes: 4, tips: 'Simmer on low heat so the milk does not curdle.' }
    ]
  },
  {
    id: 'rec_chicken_pastil',
    slug: 'mindanao-chicken-pastil',
    title: 'Mindanao Chicken Pastil',
    englishTitle: 'Shredded Savory Chicken Kagikit',
    description: 'Traditional Maguindanaon shredded chicken breast slowly cooked down with garlic, soy sauce, and aromatic black pepper, served atop banana leaf rice.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    servings: 5,
    spiceLevel: 'MILD',
    originRegion: 'Maguindanao, BARMM',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Breast',
    ingredients: [
      { id: 'ing_pas_1', name: 'Chicken breast fillets', amount: 500, unit: 'g', notes: 'Boiled and shredded into fine flakes', isOptional: false },
      { id: 'ing_pas_2', name: 'Red onions', amount: 2, unit: 'pieces', notes: 'Finely minced', isOptional: false },
      { id: 'ing_pas_3', name: 'Garlic cloves', amount: 8, unit: 'cloves', notes: 'Minced', isOptional: false },
      { id: 'ing_pas_4', name: 'Dark soy sauce', amount: 50, unit: 'ml', notes: 'For rich caramel color', isOptional: false },
      { id: 'ing_pas_5', name: 'Vinegar', amount: 20, unit: 'ml', notes: 'Preserves the shredded meat', isOptional: false },
      { id: 'ing_pas_6', name: 'Ground black pepper', amount: 1, unit: 'tsp', notes: 'Freshly ground', isOptional: false }
    ],
    steps: [
      { id: 'step_pas_1', stepNumber: 1, instruction: 'Boil chicken breasts in lightly salted water for 15 minutes. Let cool, then finely shred with two forks.', timerMinutes: 15, tips: 'Shred as thinly as possible so the meat absorbs maximum seasoning.' },
      { id: 'step_pas_2', stepNumber: 2, instruction: 'Heat oil in a pan and sauté onions and garlic until golden and aromatic.', timerMinutes: 5, tips: 'Use generous garlic for authentic Southern Mindanao flavor.' },
      { id: 'step_pas_3', stepNumber: 3, instruction: 'Add shredded chicken, soy sauce, vinegar, and black pepper. Stir-fry over medium-low heat until completely dry and lightly crisp.', timerMinutes: 12, tips: 'Cook until dry (kagikit) so it keeps fresh for several days without refrigeration.' }
    ]
  },
  {
    id: 'rec_pinoy_chicken_wings',
    slug: 'pinoy-sweet-spicy-wings',
    title: 'Pinoy Sweet & Spicy Wings',
    englishTitle: 'Glazed Banana Ketchup & Garlic Wings',
    description: 'Crispy double-fried chicken wings coated in a sticky, sweet glaze made from banana ketchup, sriracha, calamansi, and toasted garlic chips.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    spiceLevel: 'SPICY',
    originRegion: 'National Street Style',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1527477378392-1c62f27341e8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Wings',
    ingredients: [
      { id: 'ing_cw_1', name: 'Chicken wings (flats & drumettes)', amount: 800, unit: 'g', notes: 'Separated and patted dry', isOptional: false },
      { id: 'ing_cw_2', name: 'Cornstarch', amount: 80, unit: 'g', notes: 'For crisp coating', isOptional: false },
      { id: 'ing_cw_3', name: 'Banana ketchup', amount: 80, unit: 'ml', notes: 'Classic sweet glaze base', isOptional: false },
      { id: 'ing_cw_4', name: 'Sriracha or chili flakes', amount: 15, unit: 'ml', notes: 'For fiery balance', isOptional: false },
      { id: 'ing_cw_5', name: 'Honey or brown sugar', amount: 2, unit: 'tbsp', notes: 'For high gloss', isOptional: false },
      { id: 'ing_cw_6', name: 'Calamansi juice', amount: 25, unit: 'ml', notes: 'Bright acidity', isOptional: false }
    ],
    steps: [
      { id: 'step_cw_1', stepNumber: 1, instruction: 'Toss wings in salt, pepper, and cornstarch until thoroughly and evenly coated.', timerMinutes: 5, tips: 'Patting the wings completely dry before dredging produces extreme crunch.' },
      { id: 'step_cw_2', stepNumber: 2, instruction: 'Deep fry wings in 175°C oil for 8-10 minutes until golden. Rest for 5 minutes, then flash fry for 2 minutes at 195°C.', timerMinutes: 12, tips: 'The double-fry technique prevents the skin from becoming soggy when glazed.' },
      { id: 'step_cw_3', stepNumber: 3, instruction: 'Simmer banana ketchup, honey, sriracha, and calamansi in a wok for 2 minutes. Toss crispy wings to coat evenly.', timerMinutes: 3, tips: 'Toss quickly and serve immediately garnished with toasted sesame seeds.' }
    ]
  },
  {
    id: 'rec_chicken_inasal',
    slug: 'bacolod-chicken-inasal',
    title: 'Bacolod Chicken Inasal',
    englishTitle: 'Lemongrass & Annatto Grilled Chicken Thighs',
    description: 'Succulent chicken leg quarters and thighs steeped in calamansi, lemongrass, tuba vinegar, and ginger, basted in golden annatto garlic oil.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 25,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Bacolod, Western Visayas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Thighs & Legs',
    ingredients: [
      { id: 'ing_in_1', name: 'Chicken leg quarters / thighs', amount: 800, unit: 'g', notes: 'Bone-in, skin-on', isOptional: false },
      { id: 'ing_in_2', name: 'Calamansi juice', amount: 60, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_in_3', name: 'Lemongrass stalks (tanglad)', amount: 3, unit: 'stalks', notes: 'Bruised and finely sliced', isOptional: false },
      { id: 'ing_in_4', name: 'Ginger', amount: 30, unit: 'g', notes: 'Grated finely', isOptional: false },
      { id: 'ing_in_5', name: 'Annatto seeds (achuete)', amount: 20, unit: 'g', notes: 'Steeped in oil for golden basting', isOptional: false },
      { id: 'ing_in_6', name: 'Coconut vinegar (sinamak / tuba)', amount: 80, unit: 'ml', notes: 'Natural cane or coconut vinegar', isOptional: false }
    ],
    steps: [
      { id: 'step_in_1', stepNumber: 1, instruction: 'Combine calamansi, coconut vinegar, bruised lemongrass, grated ginger, minced garlic, and brown sugar. Marinate chicken for 3 hours.', timerMinutes: 180, tips: 'Slash chicken meat near the bone so the aromatic marinade penetrates thoroughly.' },
      { id: 'step_in_2', stepNumber: 2, instruction: 'Heat annatto seeds in vegetable oil with garlic until vibrant orange-red. Strain and reserve for basting.', timerMinutes: 10, tips: 'This achuete oil imparts Chicken Inasal its legendary golden color and roasted aroma.' },
      { id: 'step_in_3', stepNumber: 3, instruction: 'Grill chicken over medium-low charcoal coals for 10-12 minutes per side, brushing generously with annatto basting oil.', timerMinutes: 25, tips: 'Cook chicken bone-side down first to avoid burning the delicate skin.' }
    ]
  },
  {
    id: 'rec_chicken_afritada',
    slug: 'classic-chicken-afritada',
    title: 'Chicken Afritada',
    englishTitle: 'Braised Chicken in Rich Tomato Gravy',
    description: 'Chicken pieces braised in sweet-savory tomato sauce with tender potatoes, carrots, green bell peppers, and sweet green peas.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'Luzon / Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Thighs & Legs',
    ingredients: [
      { id: 'ing_af_1', name: 'Chicken thighs and drumsticks', amount: 800, unit: 'g', notes: 'Cut into serving pieces', isOptional: false },
      { id: 'ing_af_2', name: 'Tomato sauce', amount: 250, unit: 'ml', notes: 'Rich tomato puree', isOptional: false },
      { id: 'ing_af_3', name: 'Potatoes', amount: 2, unit: 'pieces', notes: 'Quartered', isOptional: false },
      { id: 'ing_af_4', name: 'Carrots', amount: 1, unit: 'piece', notes: 'Cut into rolling chunks', isOptional: false },
      { id: 'ing_af_5', name: 'Green bell pepper', amount: 1, unit: 'piece', notes: 'Cut into strips', isOptional: false },
      { id: 'ing_af_6', name: 'Green peas', amount: 60, unit: 'g', notes: 'Frozen or fresh', isOptional: false }
    ],
    steps: [
      { id: 'step_af_1', stepNumber: 1, instruction: 'Pan-fry potato and carrot chunks in oil until edges are golden. Remove and set aside.', timerMinutes: 8, tips: 'Pre-frying prevents root vegetables from turning mushy during braising.' },
      { id: 'step_af_2', stepNumber: 2, instruction: 'In the same oil, sear chicken pieces until lightly browned. Sauté garlic and onions.', timerMinutes: 8, tips: 'Browning the chicken skin renders fat and deepens the pan sauce.' },
      { id: 'step_af_3', stepNumber: 3, instruction: 'Add tomato sauce, bay leaf, and 150ml water. Cover and simmer on low for 20 minutes until chicken is tender.', timerMinutes: 20, tips: 'Simmer gently so the chicken absorbs the savory tomato essence.' },
      { id: 'step_af_4', stepNumber: 4, instruction: 'Fold in pre-fried potatoes, carrots, green peas, and bell peppers. Simmer for 5 minutes until vegetables are heated through.', timerMinutes: 5, tips: 'Season with a splash of fish sauce for classic umami finish.' }
    ]
  },
  {
    id: 'rec_chicken_adobo',
    slug: 'classic-chicken-adobo',
    title: 'Adobong Manok',
    englishTitle: 'Classic Garlic Vinegar Chicken Adobo',
    description: 'The unofficial national dish: bone-in chicken braised gently in native cane vinegar, soy sauce, whole garlic cloves, and cracked black pepper.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'National',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Whole & Stew',
    ingredients: [
      { id: 'ing_ad_1', name: 'Whole chicken cut into stew pieces', amount: 1000, unit: 'g', notes: 'Bone-in for rich marrow flavor', isOptional: false },
      { id: 'ing_ad_2', name: 'Native cane vinegar (sukang paombong)', amount: 100, unit: 'ml', notes: 'Pure fermented vinegar', isOptional: false },
      { id: 'ing_ad_3', name: 'Soy sauce', amount: 80, unit: 'ml', notes: 'Dark Filipino soy sauce', isOptional: false },
      { id: 'ing_ad_4', name: 'Whole garlic head', amount: 1, unit: 'head', notes: 'Crushed and peeled', isOptional: false },
      { id: 'ing_ad_5', name: 'Dried bay leaves (dahon ng laurel)', amount: 4, unit: 'pieces', notes: 'Aromatic base', isOptional: false },
      { id: 'ing_ad_6', name: 'Whole black peppercorns', amount: 1, unit: 'tbsp', notes: 'Coarsely cracked', isOptional: false }
    ],
    steps: [
      { id: 'step_ad_1', stepNumber: 1, instruction: 'Place chicken, soy sauce, crushed garlic, bay leaves, and cracked black pepper in a heavy pot. Marinate 20 minutes.', timerMinutes: 20, tips: 'Marinating allows the garlic and soy to permeate the chicken meat.' },
      { id: 'step_ad_2', stepNumber: 2, instruction: 'Pour in the cane vinegar. Bring to an uncovered rolling boil over medium-high heat without stirring for 5 minutes.', timerMinutes: 5, tips: 'The golden rule of authentic Adobo: NEVER stir simmering vinegar so it cooks off its raw harsh bite.' },
      { id: 'step_ad_3', stepNumber: 3, instruction: 'Cover pot and simmer over low heat for 25 minutes until chicken is tender. Uncover and reduce sauce to a glossy glaze.', timerMinutes: 25, tips: 'For extra indulgence, pan-fry chicken pieces in a separate pan for 2 minutes to crisp the skin, then return to sauce.' }
    ]
  },
  {
    id: 'rec_tinolang_manok',
    slug: 'tinolang-manok-papaya',
    title: 'Tinolang Manok',
    englishTitle: 'Ginger Chicken Broth with Green Papaya',
    description: 'Nourishing clear chicken soup infused with freshly crushed ginger, green unripe papaya wedges, and tender chili pepper leaves.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog / Visayas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_chicken',
    mainIngredient: 'Chicken',
    cutOrType: 'Whole & Stew',
    ingredients: [
      { id: 'ing_tm_1', name: 'Chicken cut into stew portions', amount: 800, unit: 'g', notes: 'Native or free-range chicken preferred', isOptional: false },
      { id: 'ing_tm_2', name: 'Fresh ginger root', amount: 50, unit: 'g', notes: 'Peeled and cut into thin matchsticks', isOptional: false },
      { id: 'ing_tm_3', name: 'Green unripe papaya (or chayote / sayote)', amount: 300, unit: 'g', notes: 'Cut into bite-size wedges', isOptional: false },
      { id: 'ing_tm_4', name: 'Dahon ng sili (chili pepper leaves) or malunggay', amount: 100, unit: 'g', notes: 'Freshly stripped leaves', isOptional: false },
      { id: 'ing_tm_5', name: 'Fish sauce (patis)', amount: 30, unit: 'ml', notes: 'Essential seasoning', isOptional: false },
      { id: 'ing_tm_6', name: 'Rice wash (hugas-bigas)', amount: 1200, unit: 'ml', notes: 'Second rinse of rice for thick broth', isOptional: false }
    ],
    steps: [
      { id: 'step_tm_1', stepNumber: 1, instruction: 'Sauté ginger matchsticks, garlic, and onions in oil until aromatic and slightly caramelized.', timerMinutes: 5, tips: 'Sautéing ginger gently draws out its essential oils and warming sweetness.' },
      { id: 'step_tm_2', stepNumber: 2, instruction: 'Add chicken pieces and sear for 6 minutes until juices run clear. Splash with fish sauce.', timerMinutes: 6, tips: 'Browning the chicken with fish sauce forms a deeply savory flavor base.' },
      { id: 'step_tm_3', stepNumber: 3, instruction: 'Pour in rice wash. Bring to a gentle boil, lower heat, cover, and simmer for 25 minutes until chicken is tender.', timerMinutes: 25, tips: 'Rice wash lends a soothing body and velvety mouthfeel compared to plain tap water.' },
      { id: 'step_tm_4', stepNumber: 4, instruction: 'Add green papaya wedges and cook for 6 minutes until tender. Turn off heat and fold in chili leaves.', timerMinutes: 6, tips: 'Chili leaves cook instantly in residual heat and remain vibrant green.' }
    ]
  },

  // ==========================================
  // BEEF (BAKA)
  // ==========================================
  {
    id: 'rec_batangas_bulalo',
    slug: 'batangas-beef-bulalo',
    title: 'Batangas Bulalo',
    englishTitle: 'Beef Shank & Bone Marrow Stew',
    description: 'Slow-simmered beef shank with rich buttery bone marrow, sweet corn on the cob, pechay cabbage, and whole black peppercorns.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 120,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Batangas, Southern Tagalog',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_beef',
    mainIngredient: 'Beef',
    cutOrType: 'Shank (Bulalo)',
    ingredients: [
      { id: 'ing_bb_1', name: 'Beef shank with bone marrow (bulalo cut)', amount: 1200, unit: 'g', notes: 'Center cut bone with marrow intact', isOptional: false },
      { id: 'ing_bb_2', name: 'Sweet corn on the cob', amount: 2, unit: 'ears', notes: 'Cut into 3 rounds each', isOptional: false },
      { id: 'ing_bb_3', name: 'Pechay leaves (bok choy)', amount: 150, unit: 'g', notes: 'Washed and trimmed', isOptional: false },
      { id: 'ing_bb_4', name: 'Green cabbage', amount: 1, unit: 'half head', notes: 'Cut into wedges', isOptional: false },
      { id: 'ing_bb_5', name: 'Whole black peppercorns', amount: 1, unit: 'tbsp', notes: 'Pungent aromatics', isOptional: false },
      { id: 'ing_bb_6', name: 'Patis (fish sauce)', amount: 45, unit: 'ml', notes: 'For seasoning', isOptional: false }
    ],
    steps: [
      { id: 'step_bb_1', stepNumber: 1, instruction: 'Place beef shanks in a large pot, cover with cold water, and bring to a rapid boil for 10 minutes. Discard water and wash shanks.', timerMinutes: 10, tips: 'Parboiling purges impurities, yielding a crystal-clear, clean-tasting broth.' },
      { id: 'step_bb_2', stepNumber: 2, instruction: 'Refill with 2.5 liters of clean water. Add onions and peppercorns. Simmer on low heat for 2 hours until beef is melt-in-your-mouth tender.', timerMinutes: 120, tips: 'Keep heat at a low bare simmer so the bone marrow does not melt away into the soup.' },
      { id: 'step_bb_3', stepNumber: 3, instruction: 'Add sweet corn rounds and simmer for 15 minutes. Season with fish sauce.', timerMinutes: 15, tips: 'Corn infuses natural sweetness into the beef broth.' },
      { id: 'step_bb_4', stepNumber: 4, instruction: 'Turn off heat, add pechay and cabbage wedges, cover for 3 minutes, and serve piping hot.', timerMinutes: 3, tips: 'Serve with small dipping saucers of patis, calamansi, and siling labuyo.' }
    ]
  },
  {
    id: 'rec_beef_caldereta',
    slug: 'beef-caldereta-stew',
    title: 'Beef Caldereta',
    englishTitle: 'Spicy Beef Brisket & Liver Spread Stew',
    description: 'Festive Filipino beef brisket braised in rich tomato sauce enriched with savory liver spread, melted cheese, bell peppers, and Spanish olives.',
    prepTimeMinutes: 25,
    cookTimeMinutes: 75,
    servings: 6,
    spiceLevel: 'MILD',
    originRegion: 'Luzon / Spanish-Filipino Heritage',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_beef',
    mainIngredient: 'Beef',
    cutOrType: 'Brisket & Ribs',
    ingredients: [
      { id: 'ing_bc_1', name: 'Beef brisket or chuck', amount: 800, unit: 'g', notes: 'Cut into 4cm cubes', isOptional: false },
      { id: 'ing_bc_2', name: 'Liver spread (pork or beef pate)', amount: 100, unit: 'g', notes: 'Essential signature thickener', isOptional: false },
      { id: 'ing_bc_3', name: 'Tomato paste and puree', amount: 200, unit: 'ml', notes: 'Concentrated tomato base', isOptional: false },
      { id: 'ing_bc_4', name: 'Grated cheddar cheese', amount: 60, unit: 'g', notes: 'Melted for velvety richness', isOptional: false },
      { id: 'ing_bc_5', name: 'Red & green bell peppers', amount: 2, unit: 'pieces', notes: 'Cut into thick strips', isOptional: false },
      { id: 'ing_bc_6', name: 'Green olives (pitted)', amount: 50, unit: 'g', notes: 'Classic celebratory garnish', isOptional: true }
    ],
    steps: [
      { id: 'step_bc_1', stepNumber: 1, instruction: 'Sear beef brisket cubes in hot oil until deeply browned. Remove and set aside.', timerMinutes: 10, tips: 'High-heat searing caramelizes meat sugars and creates rich fond.' },
      { id: 'step_bc_2', stepNumber: 2, instruction: 'Sauté onions and garlic. Return beef, add tomato sauce, bay leaves, and beef broth. Simmer covered for 60 minutes until beef is fork-tender.', timerMinutes: 60, tips: 'Simmer low and slow so brisket becomes succulent.' },
      { id: 'step_bc_3', stepNumber: 3, instruction: 'Stir in liver spread, grated cheese, and chili flakes. Simmer for 10 minutes until sauce turns creamy and thick.', timerMinutes: 10, tips: 'Liver spread and cheese give Caldereta its irreplaceable savory creaminess.' },
      { id: 'step_bc_4', stepNumber: 4, instruction: 'Add bell peppers and olives. Cook for 5 minutes and serve hot.', timerMinutes: 5, tips: 'Bell peppers should retain a slight crisp bite.' }
    ]
  },
  {
    id: 'rec_bistek_tagalog',
    slug: 'bistek-tagalog-sirloin',
    title: 'Bistek Tagalog',
    englishTitle: 'Filipino Beef Steak with Onion Rings',
    description: 'Thinly sliced tender beef sirloin marinated in citrusy calamansi and dark soy sauce, quickly pan-fried and smothered in sweet onion rings.',
    prepTimeMinutes: 25,
    cookTimeMinutes: 20,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog Region',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_beef',
    mainIngredient: 'Beef',
    cutOrType: 'Sirloin / Flank',
    ingredients: [
      { id: 'ing_bt_1', name: 'Beef sirloin or top round', amount: 600, unit: 'g', notes: 'Sliced very thinly across the grain', isOptional: false },
      { id: 'ing_bt_2', name: 'Calamansi juice', amount: 60, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_bt_3', name: 'Soy sauce', amount: 80, unit: 'ml', notes: 'Premium dark soy', isOptional: false },
      { id: 'ing_bt_4', name: 'White onions', amount: 3, unit: 'pieces', notes: 'Cut into 1cm thick rings', isOptional: false },
      { id: 'ing_bt_5', name: 'Garlic cloves', amount: 6, unit: 'cloves', notes: 'Minced', isOptional: false },
      { id: 'ing_bt_6', name: 'Ground black pepper', amount: 1, unit: 'tsp', notes: 'Coarse', isOptional: false }
    ],
    steps: [
      { id: 'step_bt_1', stepNumber: 1, instruction: 'Marinate thinly sliced beef in calamansi juice, soy sauce, garlic, and black pepper for 30 minutes.', timerMinutes: 30, tips: 'Slicing beef thinly across the grain guarantees tenderness in minutes.' },
      { id: 'step_bt_2', stepNumber: 2, instruction: 'Heat oil in a skillet. Pan-fry beef slices in batches for 2 minutes per side. Transfer to serving plate.', timerMinutes: 6, tips: 'Quick flash-frying prevents thinly sliced sirloin from turning tough.' },
      { id: 'step_bt_3', stepNumber: 3, instruction: 'Pour remaining marinade and 60ml water into skillet. Simmer for 3 minutes, then toss in onion rings for 2 minutes until tender-crisp.', timerMinutes: 5, tips: 'Pour the hot onion gravy directly over the beef slices right before serving.' }
    ]
  },
  {
    id: 'rec_kare_kare_baka',
    slug: 'kare-kareng-baka-oxtail',
    title: 'Kare-Kareng Baka',
    englishTitle: 'Oxtail & Beef Tripe Peanut Stew',
    description: 'Luxurious stew of tender oxtail and beef honeycomb tripe simmered in a roasted peanut and toasted rice sauce, served with sautéed shrimp paste.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 120,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Pampanga / Southern Luzon',
    difficulty: 'HARD',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_beef',
    mainIngredient: 'Beef',
    cutOrType: 'Oxtail & Tripe',
    ingredients: [
      { id: 'ing_kk_1', name: 'Oxtail and beef honeycomb tripe', amount: 1000, unit: 'g', notes: 'Cleaned and cut into serving rounds', isOptional: false },
      { id: 'ing_kk_2', name: 'Natural creamy peanut butter', amount: 180, unit: 'g', notes: 'Ground roasted peanuts', isOptional: false },
      { id: 'ing_kk_3', name: 'Toasted ground rice powder', amount: 50, unit: 'g', notes: 'For nutty velvety thickness', isOptional: false },
      { id: 'ing_kk_4', name: 'Annatto water (achuete)', amount: 60, unit: 'ml', notes: 'For signature deep sunset orange hue', isOptional: false },
      { id: 'ing_kk_5', name: 'Banana blossoms (puso ng saging)', amount: 1, unit: 'piece', notes: 'Sliced into quarters', isOptional: false },
      { id: 'ing_kk_6', name: 'Eggplants and string beans', amount: 200, unit: 'g', notes: 'Cut into lengths', isOptional: false },
      { id: 'ing_kk_7', name: 'Ginisang bagoong alamang (shrimp paste)', amount: 100, unit: 'g', notes: 'Essential salty counterpoint', isOptional: false }
    ],
    steps: [
      { id: 'step_kk_1', stepNumber: 1, instruction: 'Simmer oxtail and tripe in water with onions for 2 hours until gelatinous and fall-off-the-bone tender. Reserve beef broth.', timerMinutes: 120, tips: 'Oxtail provides the gelatin that gives the peanut sauce its silky body.' },
      { id: 'step_kk_2', stepNumber: 2, instruction: 'In a wide pot, sauté garlic and onions in annatto oil. Stir in peanut butter and 600ml reserved beef broth until smooth.', timerMinutes: 8, tips: 'Whisk continuously to create a lump-free velvety sauce.' },
      { id: 'step_kk_3', stepNumber: 3, instruction: 'Add toasted rice powder dissolved in water to thicken sauce. Add cooked oxtail and simmer for 10 minutes.', timerMinutes: 10, tips: 'Toasting dry rice in a skillet before grinding gives that nostalgic nutty aroma.' },
      { id: 'step_kk_4', stepNumber: 4, instruction: 'Steam eggplant, string beans, and banana blossoms separately and arrange over the stew. Serve with bagoong.', timerMinutes: 8, tips: 'Steaming vegetables separately keeps them bright and prevents them from discolouring the orange sauce.' }
    ]
  },

  // ==========================================
  // SEAFOOD & FISH (ISDA ATBP.)
  // ==========================================
  {
    id: 'rec_inihaw_bangus',
    slug: 'inihaw-na-bangus',
    title: 'Inihaw na Bangus',
    englishTitle: 'Stuffed Charcoal-Grilled Milkfish',
    description: 'Whole boneless Dagupan milkfish stuffed with a savory salsa of tomatoes, onions, ginger, and calamansi, wrapped in foil and grilled over hot coals.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Dagupan, Pangasinan',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Milkfish (Bangus)',
    ingredients: [
      { id: 'ing_ib_1', name: 'Boneless milkfish (bangus)', amount: 700, unit: 'g', notes: 'Butterfly-cut, scales intact', isOptional: false },
      { id: 'ing_ib_2', name: 'Ripe red tomatoes', amount: 3, unit: 'pieces', notes: 'Diced finely', isOptional: false },
      { id: 'ing_ib_3', name: 'Red onions', amount: 2, unit: 'pieces', notes: 'Diced', isOptional: false },
      { id: 'ing_ib_4', name: 'Fresh ginger', amount: 20, unit: 'g', notes: 'Grated', isOptional: false },
      { id: 'ing_ib_5', name: 'Calamansi juice', amount: 30, unit: 'ml', notes: 'Freshly squeezed', isOptional: false },
      { id: 'ing_ib_6', name: 'Banana leaf or heavy aluminum foil', amount: 1, unit: 'sheet', notes: 'For wrapping', isOptional: false }
    ],
    steps: [
      { id: 'step_ib_1', stepNumber: 1, instruction: 'Toss diced tomatoes, onions, ginger, and calamansi juice with salt and pepper.', timerMinutes: 5, tips: 'This fresh stuffing steams inside the fish while it grills, keeping the meat moist.' },
      { id: 'step_ib_2', stepNumber: 2, instruction: 'Stuff the cavity of the butterflied milkfish with the tomato-onion mixture. Wrap securely in banana leaf or foil.', timerMinutes: 5, tips: 'Keeping the fish scales intact protects the delicate flesh from burning on the grill.' },
      { id: 'step_ib_3', stepNumber: 3, instruction: 'Grill over hot coals for 10-12 minutes per side until fish flakes easily and stuffing is fragrant.', timerMinutes: 24, tips: 'Serve with a spicy soy sauce, calamansi, and chili dip.' }
    ]
  },
  {
    id: 'rec_sweet_sour_tilapia',
    slug: 'sweet-and-sour-tilapia',
    title: 'Escabeche / Sweet & Sour Tilapia',
    englishTitle: 'Crispy Tilapia with Sweet Ginger Glaze',
    description: 'Crisp whole fresh tilapia fried until golden, smothered in a tangy-sweet ginger reduction with bell peppers and julienned carrots.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Luzon / Visayas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Tilapia',
    ingredients: [
      { id: 'ing_st_1', name: 'Fresh whole tilapia', amount: 700, unit: 'g', notes: 'Scaled, gutted, scored diagonally', isOptional: false },
      { id: 'ing_st_2', name: 'Cane vinegar', amount: 80, unit: 'ml', notes: 'For sweet-sour balance', isOptional: false },
      { id: 'ing_st_3', name: 'Brown sugar', amount: 50, unit: 'g', notes: 'For sweet glaze', isOptional: false },
      { id: 'ing_st_4', name: 'Fresh ginger', amount: 30, unit: 'g', notes: 'Cut into fine julienne strips', isOptional: false },
      { id: 'ing_st_5', name: 'Red and green bell peppers', amount: 2, unit: 'pieces', notes: 'Sliced into strips', isOptional: false },
      { id: 'ing_st_6', name: 'Cornstarch slurry', amount: 15, unit: 'g', notes: 'Dissolved in 30ml water to thicken', isOptional: false }
    ],
    steps: [
      { id: 'step_st_1', stepNumber: 1, instruction: 'Rub scored tilapia with salt and deep fry in hot oil (180°C) until thoroughly golden and crunchy. Drain on wire rack.', timerMinutes: 12, tips: 'Frying until crunchy ensures the fish stays crisp even when sauced.' },
      { id: 'step_st_2', stepNumber: 2, instruction: 'In a saucepan, sauté ginger julienne, onions, and garlic until fragrant. Pour in vinegar, water, and brown sugar.', timerMinutes: 5, tips: 'Ginger is the star aromatic that neutralizes fishiness and adds warmth.' },
      { id: 'step_st_3', stepNumber: 3, instruction: 'Stir in cornstarch slurry to thicken glaze. Add bell peppers and carrots. Pour hot glaze over crispy tilapia.', timerMinutes: 3, tips: 'Pour sauce over fish immediately before serving to preserve the crunch.' }
    ]
  },
  {
    id: 'rec_halabos_hipon',
    slug: 'halabos-na-hipon',
    title: 'Halabos na Hipon',
    englishTitle: 'Garlic Butter Steamed Prawns',
    description: 'Fresh plump prawns flash-steamed in lemon-lime soda, smothered in golden melted garlic butter, and finished with fresh calamansi.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Coastal Tagalog / Visayas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Shrimp (Hipon)',
    ingredients: [
      { id: 'ing_hh_1', name: 'Fresh large prawns or shrimp', amount: 600, unit: 'g', notes: 'Whiskers trimmed, deveined', isOptional: false },
      { id: 'ing_hh_2', name: 'Lemon-lime soda (Sprite or 7Up)', amount: 120, unit: 'ml', notes: 'Steaming liquid and sweet glaze', isOptional: false },
      { id: 'ing_hh_3', name: 'Butter', amount: 50, unit: 'g', notes: 'Salted pure butter', isOptional: false },
      { id: 'ing_hh_4', name: 'Garlic cloves', amount: 8, unit: 'cloves', notes: 'Minced finely', isOptional: false },
      { id: 'ing_hh_5', name: 'Calamansi juice', amount: 20, unit: 'ml', notes: 'For citrus punch', isOptional: false }
    ],
    steps: [
      { id: 'step_hh_1', stepNumber: 1, instruction: 'Place cleaned prawns and lemon-lime soda in a wide skillet over high heat. Cook covered for 4 minutes until prawns turn bright orange.', timerMinutes: 4, tips: 'Do not overcook prawns; remove as soon as they form a gentle C-shape.' },
      { id: 'step_hh_2', stepNumber: 2, instruction: 'Melt butter in skillet, add minced garlic, and toss with the prawns until coated in aromatic garlic butter.', timerMinutes: 3, tips: 'The natural shrimp juices combine with butter and soda into an irresistible dipping sauce.' },
      { id: 'step_hh_3', stepNumber: 3, instruction: 'Squeeze fresh calamansi juice over top and serve hot with garlic fried rice.', timerMinutes: 1, tips: 'Dip prawns in the pan butter sauce or spiced vinegar.' }
    ]
  },
  {
    id: 'rec_inihaw_pusit',
    slug: 'inihaw-na-pusit',
    title: 'Inihaw na Pusit',
    englishTitle: 'Stuffed Charcoal-Grilled Whole Squid',
    description: 'Whole tender ocean squid stuffed with diced tomatoes, onions, and cilantro, brushed with sweet soy marinade, and char-grilled quickly over high heat.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 8,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Coastal Luzon / Visayas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Squid (Pusit)',
    ingredients: [
      { id: 'ing_ip_1', name: 'Whole fresh squid (large)', amount: 700, unit: 'g', notes: 'Cleaned, ink sac and quill removed', isOptional: false },
      { id: 'ing_ip_2', name: 'Tomatoes', amount: 2, unit: 'pieces', notes: 'Diced', isOptional: false },
      { id: 'ing_ip_3', name: 'Red onions', amount: 1, unit: 'piece', notes: 'Diced', isOptional: false },
      { id: 'ing_ip_4', name: 'Soy sauce and calamansi', amount: 40, unit: 'ml', notes: 'For basting', isOptional: false }
    ],
    steps: [
      { id: 'step_ip_1', stepNumber: 1, instruction: 'Stuff squid body with diced tomatoes and onions. Secure opening with a wooden toothpick.', timerMinutes: 5, tips: 'Do not overstuff as the squid shrinks significantly while grilling.' },
      { id: 'step_ip_2', stepNumber: 2, instruction: 'Grill over hot charcoal for 3-4 minutes per side, brushing with soy-calamansi glaze.', timerMinutes: 8, tips: 'Grill quickly! Overcooked squid turns rubbery; 7-8 minutes total is all it takes.' }
    ]
  },
  {
    id: 'rec_sinigang_salmon_miso',
    slug: 'sinigang-na-salmon-sa-miso',
    title: 'Sinigang na Ulo ng Salmon sa Miso',
    englishTitle: 'Salmon Head Tamarind Soup with Fermented Miso',
    description: 'Silky rich Norwegian salmon head and belly simmered in sour tamarind and savory yellow miso broth with mustard greens and tomatoes.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    spiceLevel: 'MILD',
    originRegion: 'Pampanga / Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Salmon & Crab',
    ingredients: [
      { id: 'ing_ssm_1', name: 'Salmon head and belly cuts', amount: 700, unit: 'g', notes: 'Cleaned and washed with calamansi', isOptional: false },
      { id: 'ing_ssm_2', name: 'Yellow soybean paste (miso)', amount: 60, unit: 'g', notes: 'Sautéed with ginger', isOptional: false },
      { id: 'ing_ssm_3', name: 'Tamarind souring base', amount: 45, unit: 'g', notes: 'Fresh or natural extract', isOptional: false },
      { id: 'ing_ssm_4', name: 'Mustard greens (mustasa)', amount: 150, unit: 'g', notes: 'Leaves trimmed', isOptional: false },
      { id: 'ing_ssm_5', name: 'Ginger and tomatoes', amount: 30, unit: 'g', notes: 'Sliced', isOptional: false }
    ],
    steps: [
      { id: 'step_ssm_1', stepNumber: 1, instruction: 'Sauté ginger, garlic, and onions in oil. Add miso paste and cook for 3 minutes to unlock nutty richness.', timerMinutes: 4, tips: 'Cooking the miso paste first removes its raw edge and enriches the broth.' },
      { id: 'step_ssm_2', stepNumber: 2, instruction: 'Pour in rice wash or water and bring to a boil. Gently add salmon head and belly pieces. Simmer for 10 minutes.', timerMinutes: 10, tips: 'Handle salmon gently so the delicate fish flesh stays intact.' },
      { id: 'step_ssm_3', stepNumber: 3, instruction: 'Add tamarind, green finger chili, and mustard greens. Simmer for 2 minutes and serve steaming hot.', timerMinutes: 2, tips: 'Mustasa leaves provide a peppery, bitter bite that balances the rich salmon fat.' }
    ]
  },

  // ==========================================
  // VEGETABLES (GULAY)
  // ==========================================
  {
    id: 'rec_ginisang_ampalaya',
    slug: 'ginisang-ampalaya-with-egg',
    title: 'Ginisang Ampalaya with Egg',
    englishTitle: 'Sautéed Bitter Melon with Scrambled Eggs',
    description: 'Thinly sliced bitter gourd sautéed with aromatic garlic, ripe tomatoes, and soft scrambled eggs without harsh bitterness.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 10,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'National / Ilocos',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_vegetables',
    mainIngredient: 'Vegetables',
    cutOrType: 'Bitter Melon',
    ingredients: [
      { id: 'ing_ga_1', name: 'Fresh green bitter melon (ampalaya)', amount: 2, unit: 'pieces', notes: 'Seeds scraped, thinly sliced', isOptional: false },
      { id: 'ing_ga_2', name: 'Eggs', amount: 3, unit: 'pieces', notes: 'Beaten lightly', isOptional: false },
      { id: 'ing_ga_3', name: 'Ripe tomatoes', amount: 2, unit: 'pieces', notes: 'Diced', isOptional: false },
      { id: 'ing_ga_4', name: 'Garlic and red onion', amount: 4, unit: 'cloves', notes: 'Minced', isOptional: false },
      { id: 'ing_ga_5', name: 'Rock salt', amount: 1, unit: 'tbsp', notes: 'For drawing out excess bitter sap', isOptional: false }
    ],
    steps: [
      { id: 'step_ga_1', stepNumber: 1, instruction: 'Toss sliced bitter melon with rock salt and rest for 10 minutes. Gently squeeze and rinse with cold water.', timerMinutes: 10, tips: 'Salting and gentle rinsing tames the harsh bitterness while retaining refreshing crunch.' },
      { id: 'step_ga_2', stepNumber: 2, instruction: 'Sauté garlic, onions, and tomatoes in oil until tomatoes are softened and juicy.', timerMinutes: 4, tips: 'Tomatoes provide sweet natural acidity that balances the melon.' },
      { id: 'step_ga_3', stepNumber: 3, instruction: 'Add bitter melon and sauté for 3-4 minutes. Pour beaten eggs over the pan and let set briefly before folding gently.', timerMinutes: 4, tips: 'Do not over-stir so the scrambled eggs remain fluffy and soft.' }
    ]
  },
  {
    id: 'rec_bicolano_laing',
    slug: 'authentic-bicolano-laing',
    title: 'Authentic Bicolano Laing',
    englishTitle: 'Taro Leaves Simmered in Rich Coconut Milk',
    description: 'Sun-dried taro leaves slow-braised in thick coconut cream with pork belly bits, shrimp paste, and fiery bird eye chilies.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 50,
    servings: 5,
    spiceLevel: 'SPICY',
    originRegion: 'Bicol Region',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_vegetables',
    mainIngredient: 'Vegetables',
    cutOrType: 'Taro Leaves',
    ingredients: [
      { id: 'ing_bl_1', name: 'Dried taro leaves (dahon ng gabi)', amount: 100, unit: 'g', notes: 'Completely dried in the sun', isOptional: false },
      { id: 'ing_bl_2', name: 'Pure coconut milk (kakang gata)', amount: 400, unit: 'ml', notes: 'First extract', isOptional: false },
      { id: 'ing_bl_3', name: 'Thin coconut milk (gata)', amount: 400, unit: 'ml', notes: 'Second extract', isOptional: false },
      { id: 'ing_bl_4', name: 'Pork belly bits', amount: 150, unit: 'g', notes: 'Cut into small lardons', isOptional: false },
      { id: 'ing_bl_5', name: 'Siling labuyo (red bird eye chilies)', amount: 6, unit: 'pieces', notes: 'Chopped', isOptional: false },
      { id: 'ing_bl_6', name: 'Bagoong alamang (shrimp paste)', amount: 2, unit: 'tbsp', notes: 'For savory depth', isOptional: false }
    ],
    steps: [
      { id: 'step_bl_1', stepNumber: 1, instruction: 'Render pork belly bits in a pot until lightly crisp. Sauté garlic, onions, ginger, and shrimp paste.', timerMinutes: 8, tips: 'Ginger is essential in Bicolano coconut dishes to cut the richness of coconut cream.' },
      { id: 'step_bl_2', stepNumber: 2, instruction: 'Pour in thin coconut milk. Bring to a boil, then lay dried taro leaves on top. DO NOT STIR.', timerMinutes: 20, tips: 'The crucial anti-itch rule: Never stir taro leaves until they are fully submerged and cooked through.' },
      { id: 'step_bl_3', stepNumber: 3, instruction: 'Once leaves absorb liquid, pour thick coconut cream and chilies. Simmer on low until coconut oil separates (approx 20 mins).', timerMinutes: 20, tips: 'Simmer until oil renders out (nagmamantika) for authentic creamy decadence.' }
    ]
  },
  {
    id: 'rec_pinakbet_tagalog',
    slug: 'pinakbet-tagalog-gulay',
    title: 'Pinakbet Tagalog',
    englishTitle: 'Stewed Squash, Okra & Eggplant in Bagoong',
    description: 'Hearty traditional medley of sweet kabocha squash, string beans, tender eggplant, and crisp okra braised with pork and savory bagoong.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog / Northern Luzon',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_vegetables',
    mainIngredient: 'Vegetables',
    cutOrType: 'Squash & Beans',
    ingredients: [
      { id: 'ing_pt_1', name: 'Kabocha squash (kalabasa)', amount: 300, unit: 'g', notes: 'Peeled and cubed', isOptional: false },
      { id: 'ing_pt_2', name: 'Yardlong string beans (sitaw)', amount: 150, unit: 'g', notes: 'Snapped into 5cm pieces', isOptional: false },
      { id: 'ing_pt_3', name: 'Eggplant (talong)', amount: 2, unit: 'pieces', notes: 'Cut into rounds', isOptional: false },
      { id: 'ing_pt_4', name: 'Fresh okra', amount: 6, unit: 'pieces', notes: 'Tops trimmed', isOptional: false },
      { id: 'ing_pt_5', name: 'Pork belly bits', amount: 150, unit: 'g', notes: 'Pre-boiled and browned', isOptional: false },
      { id: 'ing_pt_6', name: 'Shrimp paste (bagoong alamang)', amount: 2, unit: 'tbsp', notes: 'Authentic seasoning', isOptional: false }
    ],
    steps: [
      { id: 'step_pt_1', stepNumber: 1, instruction: 'Sauté garlic, onions, and tomatoes with bagoong. Add browned pork belly.', timerMinutes: 5, tips: 'Cooking the shrimp paste with tomatoes creates the aromatic base.' },
      { id: 'step_pt_2', stepNumber: 2, instruction: 'Add squash cubes and 150ml water. Cover and simmer for 8 minutes until squash begins to soften.', timerMinutes: 8, tips: 'Squash takes longer to cook than other vegetables, so add it first.' },
      { id: 'step_pt_3', stepNumber: 3, instruction: 'Add string beans, eggplant, and okra. Cover pot and cook for 6 minutes. Shake pot instead of stirring vigorously.', timerMinutes: 6, tips: 'Shaking the pot instead of stirring with a spoon keeps the tender eggplant and okra intact.' }
    ]
  },
  {
    id: 'rec_ginisang_monggo',
    slug: 'ginisang-monggo-tinapa',
    title: 'Ginisang Monggo with Tinapa',
    englishTitle: 'Savory Mung Bean Stew with Smoked Fish',
    description: 'Creamy slow-boiled green mung beans sautéed with smoked tinapa flakes, fresh spinach, and topped with golden crispy pork chicharon.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 40,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'National / Friday Tradition',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_vegetables',
    mainIngredient: 'Vegetables',
    cutOrType: 'Legumes & Monggo',
    ingredients: [
      { id: 'ing_gm_1', name: 'Green mung beans (monggo)', amount: 200, unit: 'g', notes: 'Rinsed', isOptional: false },
      { id: 'ing_gm_2', name: 'Smoked fish (tinapa)', amount: 150, unit: 'g', notes: 'Flaked, bones removed', isOptional: false },
      { id: 'ing_gm_3', name: 'Fresh spinach or malunggay leaves', amount: 100, unit: 'g', notes: 'Washed', isOptional: false },
      { id: 'ing_gm_4', name: 'Crushed chicharon (pork rinds)', amount: 50, unit: 'g', notes: 'For crunchy topping', isOptional: true },
      { id: 'ing_gm_5', name: 'Ripe tomatoes', amount: 2, unit: 'pieces', notes: 'Diced', isOptional: false }
    ],
    steps: [
      { id: 'step_gm_1', stepNumber: 1, instruction: 'Boil green mung beans in 1 liter of water for 30 minutes until soft and creamy.', timerMinutes: 30, tips: 'Soaking mung beans for 1 hour before boiling cuts cooking time in half.' },
      { id: 'step_gm_2', stepNumber: 2, instruction: 'In a separate skillet, sauté garlic, onions, and tomatoes. Add flaked tinapa and cook for 3 minutes.', timerMinutes: 5, tips: 'Flaked smoked fish provides deep, smoky umami that elevates simple beans.' },
      { id: 'step_gm_3', stepNumber: 3, instruction: 'Combine sautéed mixture into the boiled mung beans. Simmer for 5 minutes, fold in spinach, and top with chicharon.', timerMinutes: 5, tips: 'Add chicharon just before serving so it retains its delightful crunch.' }
    ]
  },

  // ==========================================
  // EGGS & BREAKFAST (ITLOG AT SILOG)
  // ==========================================
  {
    id: 'rec_tortang_talong',
    slug: 'crispy-tortang-talong',
    title: 'Tortang Talong',
    englishTitle: 'Smoky Roasted Eggplant Omelette',
    description: 'Whole Asian eggplant charred over an open flame until smoky, peeled flat, dipped in seasoned beaten eggs, and fried to golden perfection.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    spiceLevel: 'NONE',
    originRegion: 'National',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Omelettes & Tortas',
    ingredients: [
      { id: 'ing_tt_1', name: 'Long purple Asian eggplants', amount: 2, unit: 'pieces', notes: 'Stem intact', isOptional: false },
      { id: 'ing_tt_2', name: 'Fresh large eggs', amount: 2, unit: 'pieces', notes: 'Beaten with pinch of salt', isOptional: false },
      { id: 'ing_tt_3', name: 'Garlic powder or fresh minced garlic', amount: 1, unit: 'tsp', notes: 'For aroma', isOptional: false },
      { id: 'ing_tt_4', name: 'Cooking oil', amount: 45, unit: 'ml', notes: 'For pan frying', isOptional: false }
    ],
    steps: [
      { id: 'step_tt_1', stepNumber: 1, instruction: 'Roast eggplants directly over gas burner flame until skin is completely blackened and blistered.', timerMinutes: 8, tips: 'Charring directly on flame imparts the signature smoky aroma that defines Tortang Talong.' },
      { id: 'step_tt_2', stepNumber: 2, instruction: 'Let cool in a covered bowl, then gently peel off burnt skin, leaving the stem attached. Flatten meat with a fork.', timerMinutes: 5, tips: 'Steam in covered bowl makes peeling the skin effortless.' },
      { id: 'step_tt_3', stepNumber: 3, instruction: 'Dip flattened eggplant into seasoned beaten egg, slide into hot skillet with oil, and pour remaining egg over top. Fry 3 mins per side.', timerMinutes: 6, tips: 'Serve with sweet banana ketchup or spiced cane vinegar.' }
    ]
  },
  {
    id: 'rec_tortang_giniling',
    slug: 'tortang-giniling-omelette',
    title: 'Tortang Giniling',
    englishTitle: 'Savory Ground Meat & Potato Omelette',
    description: 'Hearty pan-fried egg omelette studded with seasoned minced pork, finely diced potatoes, carrots, and sweet green peas.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Omelettes & Tortas',
    ingredients: [
      { id: 'ing_tg_1', name: 'Lean ground pork or beef', amount: 250, unit: 'g', notes: 'Pre-cooked picadillo filling', isOptional: false },
      { id: 'ing_tg_2', name: 'Fresh large eggs', amount: 4, unit: 'pieces', notes: 'Beaten thoroughly', isOptional: false },
      { id: 'ing_tg_3', name: 'Small potato', amount: 1, unit: 'piece', notes: 'Minced very finely', isOptional: false },
      { id: 'ing_tg_4', name: 'Small onion & garlic', amount: 2, unit: 'cloves', notes: 'Minced', isOptional: false }
    ],
    steps: [
      { id: 'step_tg_1', stepNumber: 1, instruction: 'Sauté minced potatoes and ground meat until fully cooked and lightly browned. Allow to cool slightly.', timerMinutes: 8, tips: 'Letting the filling cool slightly prevents the raw beaten eggs from curdling before hitting the pan.' },
      { id: 'step_tg_2', stepNumber: 2, instruction: 'Mix the cooked meat filling into beaten seasoned eggs.', timerMinutes: 2, tips: 'Ensure eggs coat every piece of minced meat for a cohesive omelette.' },
      { id: 'step_tg_3', stepNumber: 3, instruction: 'Pour mixture into hot oiled skillet. Cook over medium-low heat for 4 minutes until bottom is golden, flip carefully and cook 3 minutes.', timerMinutes: 7, tips: 'Use a flat plate to invert and flip the omelette safely without breaking.' }
    ]
  },
  {
    id: 'rec_tapsilog_special',
    slug: 'classic-tapsilog-breakfast',
    title: 'Tapsilog Special',
    englishTitle: 'Garlic Rice, Fried Egg & Sweet-Savory Beef Tapa',
    description: 'The champion of Filipino breakfasts: cured garlicky beef tapa served with crispy garlic fried rice (sinangag) and a sunny-side-up runny egg.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 2,
    spiceLevel: 'NONE',
    originRegion: 'National Silog Culture',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Silog Meals',
    ingredients: [
      { id: 'ing_ts_1', name: 'Fresh farm eggs', amount: 2, unit: 'pieces', notes: 'Fried sunny side up with crispy lacy edges', isOptional: false },
      { id: 'ing_ts_2', name: 'Beef tapa strips', amount: 300, unit: 'g', notes: 'Cured garlic-soy beef sirloin', isOptional: false },
      { id: 'ing_ts_3', name: 'Cold leftover cooked white rice', amount: 400, unit: 'g', notes: 'Grains separated', isOptional: false },
      { id: 'ing_ts_4', name: 'Garlic cloves', amount: 10, unit: 'cloves', notes: 'Minced for golden garlic chips', isOptional: false },
      { id: 'ing_ts_5', name: 'Atchara (pickled green papaya)', amount: 60, unit: 'g', notes: 'Sweet-sour garnish', isOptional: true }
    ],
    steps: [
      { id: 'step_ts_1', stepNumber: 1, instruction: 'Sauté garlic in oil until deep golden and crunchy. Add cold rice and toss continuously over high heat for 6 minutes (Sinangag).', timerMinutes: 6, tips: 'Day-old cold rice has less moisture, yielding separate, aromatic garlicky grains.' },
      { id: 'step_ts_2', stepNumber: 2, instruction: 'Pan-fry beef tapa in a splash of water and oil until tender, caramelized, and slightly chewy.', timerMinutes: 6, tips: 'Simmering in a tablespoon of water first ensures tender tapa before browning in oil.' },
      { id: 'step_ts_3', stepNumber: 3, instruction: 'Fry eggs sunny side up in hot oil with crispy edges and rich runny yolks. Assemble plate with sinangag and atchara.', timerMinutes: 3, tips: 'Spoon hot oil over egg whites to cook the top without flipping.' }
    ]
  },
  {
    id: 'rec_tocilog_sweet_pork',
    slug: 'tocilog-sweet-cured-pork',
    title: 'Tocilog',
    englishTitle: 'Sweet Cured Pork with Garlic Rice & Egg',
    description: 'Caramelized sweet cured pork tocino served with golden sinangag garlic rice, a sunny-side-up egg, and spiced vinegar.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    spiceLevel: 'NONE',
    originRegion: 'Pampanga',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Silog Meals',
    ingredients: [
      { id: 'ing_tc_1', name: 'Pork tocino (cured pork)', amount: 300, unit: 'g', notes: 'Thinly sliced pork shoulder/belly', isOptional: false },
      { id: 'ing_tc_2', name: 'Fresh eggs', amount: 2, unit: 'pieces', notes: 'Sunny side up', isOptional: false },
      { id: 'ing_tc_3', name: 'Garlic fried rice (sinangag)', amount: 400, unit: 'g', notes: 'Freshly cooked', isOptional: false }
    ],
    steps: [
      { id: 'step_tc_1', stepNumber: 1, instruction: 'Place pork tocino in a pan with 80ml water. Simmer on medium until water evaporates and pork renders fat.', timerMinutes: 10, tips: 'Simmering first cooks the meat through so the sweet cure does not scorch.' },
      { id: 'step_tc_2', stepNumber: 2, instruction: 'Fry in its own rendered fat until nicely caramelized and deep mahogany red.', timerMinutes: 5, tips: 'Keep heat medium-low to achieve sticky caramelized edges.' },
      { id: 'step_tc_3', stepNumber: 3, instruction: 'Serve hot alongside sunny-side-up eggs and a mountain of fragrant garlic rice.', timerMinutes: 2, tips: 'Dip tocino in spiced palm vinegar to cut through the sweetness.' }
    ]
  },
  {
    id: 'rec_kwek_kwek',
    slug: 'street-kwek-kwek',
    title: 'Kwek-Kwek (Tokneneng)',
    englishTitle: 'Crispy Battered Fried Quail Eggs',
    description: 'Iconic Manila street food: hard-boiled quail eggs dredged in vibrant orange annatto batter and deep-fried until ultra-crisp, served with sweet-sour spiced vinegar.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 4,
    spiceLevel: 'MILD',
    originRegion: 'Manila Street Food',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Street Egg Snacks',
    ingredients: [
      { id: 'ing_kw_1', name: 'Hard-boiled quail eggs', amount: 18, unit: 'pieces', notes: 'Peeled', isOptional: false },
      { id: 'ing_kw_2', name: 'All-purpose flour', amount: 120, unit: 'g', notes: 'Batter base', isOptional: false },
      { id: 'ing_kw_3', name: 'Cornstarch', amount: 30, unit: 'g', notes: 'For crunch', isOptional: false },
      { id: 'ing_kw_4', name: 'Annatto powder (atsuete)', amount: 1, unit: 'tbsp', notes: 'Dissolved in warm water for bright orange color', isOptional: false },
      { id: 'ing_kw_5', name: 'Spiced cane vinegar with onions & cucumber', amount: 100, unit: 'ml', notes: 'Essential street dip', isOptional: false }
    ],
    steps: [
      { id: 'step_kw_1', stepNumber: 1, instruction: 'Whisk flour, cornstarch, annatto water, salt, and pepper into a smooth, thick pancake-like batter.', timerMinutes: 5, tips: 'The batter should be thick enough to coat the eggs without dripping off completely.' },
      { id: 'step_kw_2', stepNumber: 2, instruction: 'Roll peeled quail eggs in dry cornstarch, then dip into the orange batter to coat completely.', timerMinutes: 3, tips: 'Pre-dusting eggs in cornstarch prevents the wet batter from sliding off.' },
      { id: 'step_kw_3', stepNumber: 3, instruction: 'Deep fry in 180°C oil for 2-3 minutes until the batter is crisp and puffed. Drain and serve with spiced vinegar.', timerMinutes: 3, tips: 'Eat immediately while the orange shell is piping hot and shattering crisp.' }
    ]
  },

  // ==========================================
  // DESSERTS, CAKES & BAKING (PANGHIMAGAS AT BAKING)
  // ==========================================
  {
    id: 'rec_pan_de_sal',
    slug: 'traditional-pan-de-sal',
    title: 'Traditional Pan de Sal',
    englishTitle: 'Filipino Morning Bread Rolls',
    description: 'The definitive Filipino breakfast bread: pillowy, soft, slightly sweet yeast rolls rolled in fine toasted breadcrumbs and baked fresh.',
    prepTimeMinutes: 40,
    cookTimeMinutes: 15,
    servings: 12,
    spiceLevel: 'NONE',
    originRegion: 'National Bakery Staple',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Breads & Bakeshop',
    ingredients: [
      { id: 'ing_pds_1', name: 'Bread flour', amount: 500, unit: 'g', notes: 'High protein flour for chew', isOptional: false },
      { id: 'ing_pds_2', name: 'Active dry yeast', amount: 7, unit: 'g', notes: '1 packet', isOptional: false },
      { id: 'ing_pds_3', name: 'Warm milk or water (38°C)', amount: 250, unit: 'ml', notes: 'For yeast blooming', isOptional: false },
      { id: 'ing_pds_4', name: 'Granulated white sugar', amount: 80, unit: 'g', notes: 'Provides classic subtle sweetness', isOptional: false },
      { id: 'ing_pds_5', name: 'Butter', amount: 50, unit: 'g', notes: 'Softened room temperature', isOptional: false },
      { id: 'ing_pds_6', name: 'Fine toasted breadcrumbs', amount: 60, unit: 'g', notes: 'For dredging the exterior', isOptional: false }
    ],
    steps: [
      { id: 'step_pds_1', stepNumber: 1, instruction: 'Bloom yeast in warm milk with 1 tsp sugar for 8 minutes until frothy. Mix with flour, sugar, salt, and softened butter.', timerMinutes: 8, tips: 'Ensure milk is warm to the wrist (38°C); too hot will kill the yeast.' },
      { id: 'step_pds_2', stepNumber: 2, instruction: 'Knead dough for 10-12 minutes until smooth and elastic. Cover and let rise in a warm spot for 1 hour until doubled in size.', timerMinutes: 60, tips: 'Perform the windowpane test: stretch a piece of dough thinly without tearing.' },
      { id: 'step_pds_3', stepNumber: 3, instruction: 'Roll dough into logs, cut into 12 equal portions, dredge in breadcrumbs, and proof on baking sheet for 25 minutes.', timerMinutes: 25, tips: 'Breadcrumb coating is the historic hallmark of authentic Pan de Sal.' },
      { id: 'step_pds_4', stepNumber: 4, instruction: 'Bake at 190°C (375°F) for 12-15 minutes until golden brown tops form. Serve warm with butter or cheese.', timerMinutes: 15, tips: 'Best enjoyed fresh out of the oven dipped in hot black coffee.' }
    ]
  },
  {
    id: 'rec_cheesy_ensaymada',
    slug: 'cheesy-butter-ensaymada',
    title: 'Cheesy Ensaymada',
    englishTitle: 'Brioche Coils with Butter Cream & Queso de Bola',
    description: 'Enriched, melt-in-your-mouth sweet brioche coils slathered generously with whipped golden buttercream and mountain of grated aged Edam cheese.',
    prepTimeMinutes: 45,
    cookTimeMinutes: 18,
    servings: 8,
    spiceLevel: 'NONE',
    originRegion: 'Malolos, Bulacan / Spanish Heritage',
    difficulty: 'HARD',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Breads & Bakeshop',
    ingredients: [
      { id: 'ing_en_1', name: 'All-purpose flour', amount: 450, unit: 'g', notes: 'Sifted', isOptional: false },
      { id: 'ing_en_2', name: 'Egg yolks', amount: 5, unit: 'yolks', notes: 'Gives rich yellow crumb', isOptional: false },
      { id: 'ing_en_3', name: 'Unsalted butter', amount: 150, unit: 'g', notes: 'Divided between dough & frosting', isOptional: false },
      { id: 'ing_en_4', name: 'Aged Edam cheese (Queso de Bola)', amount: 120, unit: 'g', notes: 'Finely grated', isOptional: false },
      { id: 'ing_en_5', name: 'Powdered sugar', amount: 80, unit: 'g', notes: 'For whipped buttercream topping', isOptional: false }
    ],
    steps: [
      { id: 'step_en_1', stepNumber: 1, instruction: 'Knead enriched dough with egg yolks, butter, milk, and yeast until smooth. Rest for 1 hour to rise.', timerMinutes: 60, tips: 'Egg yolks and rich butter give Ensaymada its tender, cotton-like crumb.' },
      { id: 'step_en_2', stepNumber: 2, instruction: 'Divide dough into 8 balls. Roll each ball into a paper-thin rectangle, brush with softened butter, and roll tightly into a snail coil.', timerMinutes: 20, tips: 'Coiling thin buttered dough creates delicate, flaky pastry layers.' },
      { id: 'step_en_3', stepNumber: 3, instruction: 'Proof coils in ensaymada tins for 30 minutes, then bake at 175°C for 16-18 minutes until golden.', timerMinutes: 18, tips: 'Do not overbake to keep the bread exceptionally soft.' },
      { id: 'step_en_4', stepNumber: 4, instruction: 'Cool completely. Cream butter and sugar until pale, spread over each pastry, and bury under grated Queso de Bola.', timerMinutes: 10, tips: 'The salty tang of Queso de Bola perfectly contrasts the sweet rich buttercream.' }
    ]
  },
  {
    id: 'rec_bakery_spanish_bread',
    slug: 'bakery-spanish-bread',
    title: 'Bakery Spanish Bread',
    englishTitle: 'Soft Bread Rolls with Sweet Buttery Filling',
    description: 'Neighborhood bakeshop favorite: fluffy rolled yeast bread filled with a warm, gooey center of melted butter, sugar, and toasted breadcrumbs.',
    prepTimeMinutes: 35,
    cookTimeMinutes: 15,
    servings: 10,
    spiceLevel: 'NONE',
    originRegion: 'National Panaderia',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Breads & Bakeshop',
    ingredients: [
      { id: 'ing_sb_1', name: 'Bread dough (flour, yeast, milk, sugar)', amount: 500, unit: 'g', notes: 'Soft yeast dough', isOptional: false },
      { id: 'ing_sb_2', name: 'Butter', amount: 80, unit: 'g', notes: 'Melted for filling', isOptional: false },
      { id: 'ing_sb_3', name: 'Brown sugar', amount: 100, unit: 'g', notes: 'Caramel filling base', isOptional: false },
      { id: 'ing_sb_4', name: 'Breadcrumbs', amount: 60, unit: 'g', notes: 'Toasted and ground', isOptional: false }
    ],
    steps: [
      { id: 'step_sb_1', stepNumber: 1, instruction: 'Prepare filling: mix melted butter, brown sugar, and toasted breadcrumbs into a spreadable paste.', timerMinutes: 5, tips: 'The breadcrumbs absorb butter and create that signature gooey bakery filling.' },
      { id: 'step_sb_2', stepNumber: 2, instruction: 'Flatten proofed dough into triangles, spread 1 tbsp filling, and roll up from wide base to tip like a crescent.', timerMinutes: 15, tips: 'Pinch edges slightly so the sweet filling stays inside during baking.' },
      { id: 'step_sb_3', stepNumber: 3, instruction: 'Dredge exterior in breadcrumbs and bake at 180°C for 14-16 minutes until golden.', timerMinutes: 15, tips: 'Best eaten warm when the sugary butter center is molten and fragrant.' }
    ]
  },
  {
    id: 'rec_moist_ube_cake',
    slug: 'moist-ube-halaya-cake',
    title: 'Moist Ube Halaya Cake',
    englishTitle: 'Purple Yam Sponge Cake with Whipped Ube Cream',
    description: 'Chiffon sponge cake infused with natural purple yam (ube halaya), layered with silky ube cream and tender young coconut (macapuno) ribbons.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 35,
    servings: 10,
    spiceLevel: 'NONE',
    originRegion: 'National Filipino Celebration',
    difficulty: 'HARD',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Cakes & Pies',
    ingredients: [
      { id: 'ing_uc_1', name: 'Cake flour', amount: 200, unit: 'g', notes: 'Sifted', isOptional: false },
      { id: 'ing_uc_2', name: 'Ube halaya (purple yam jam)', amount: 150, unit: 'g', notes: 'Cooked purple yam', isOptional: false },
      { id: 'ing_uc_3', name: 'Egg whites', amount: 5, unit: 'whites', notes: 'Whipping meringue for airy rise', isOptional: false },
      { id: 'ing_uc_4', name: 'Heavy whipping cream', amount: 400, unit: 'ml', notes: 'For frosting', isOptional: false },
      { id: 'ing_uc_5', name: 'Macapuno strings (coconut sport)', amount: 100, unit: 'g', notes: 'For layer filling', isOptional: true }
    ],
    steps: [
      { id: 'step_uc_1', stepNumber: 1, instruction: 'Whisk egg yolks, oil, milk, ube halaya, and ube extract. Fold into sifted cake flour.', timerMinutes: 10, tips: 'Using real ube halaya provides natural earthy depth alongside the vibrant color.' },
      { id: 'step_uc_2', stepNumber: 2, instruction: 'Beat egg whites with cream of tartar and sugar until stiff glossy peaks form. Gently fold meringue into batter in 3 additions.', timerMinutes: 10, tips: 'Fold with a rubber spatula in gentle figure-eight motions to keep air bubbles intact.' },
      { id: 'step_uc_3', stepNumber: 3, instruction: 'Bake in two 8-inch round pans at 165°C for 30-35 minutes until springy to the touch. Cool completely on a rack.', timerMinutes: 35, tips: 'Invert pans onto cooling racks to prevent the delicate chiffon sponge from collapsing.' },
      { id: 'step_uc_4', stepNumber: 4, instruction: 'Whip cream with powdered sugar and ube halaya. Layer sponge cakes with whipped cream and macapuno strings.', timerMinutes: 15, tips: 'Chill cake for at least 2 hours before slicing for clean, show-stopping layers.' }
    ]
  },
  {
    id: 'rec_classic_egg_pie',
    slug: 'classic-pinoy-egg-pie',
    title: 'Classic Pinoy Egg Pie',
    englishTitle: 'Custard Pie with Toasted Golden Top',
    description: 'Flaky buttery pie crust filled with silky, rich vanilla egg custard, featuring the iconic toasted dark golden-brown top crust.',
    prepTimeMinutes: 25,
    cookTimeMinutes: 45,
    servings: 8,
    spiceLevel: 'NONE',
    originRegion: 'National Panaderia Favorite',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Cakes & Pies',
    ingredients: [
      { id: 'ing_ep_1', name: 'Flaky 9-inch pie crust', amount: 1, unit: 'crust', notes: 'Par-baked', isOptional: false },
      { id: 'ing_ep_2', name: 'Egg yolks', amount: 4, unit: 'yolks', notes: 'For rich custard base', isOptional: false },
      { id: 'ing_ep_3', name: 'Egg whites', amount: 3, unit: 'whites', notes: 'Beaten to soft peaks for toasted top', isOptional: false },
      { id: 'ing_ep_4', name: 'Evaporated milk', amount: 350, unit: 'ml', notes: 'Heated to scald', isOptional: false },
      { id: 'ing_ep_5', name: 'Sweetened condensed milk', amount: 200, unit: 'ml', notes: 'For sweetness and body', isOptional: false },
      { id: 'ing_ep_6', name: 'Pure vanilla extract', amount: 2, unit: 'tsp', notes: 'For fragrant aroma', isOptional: false }
    ],
    steps: [
      { id: 'step_ep_1', stepNumber: 1, instruction: 'Scald evaporated milk with vanilla. Whisk egg yolks and condensed milk together in a bowl, then temper with warm milk.', timerMinutes: 10, tips: 'Temper slowly so the yolks do not scramble in the hot milk.' },
      { id: 'step_ep_2', stepNumber: 2, instruction: 'Beat egg whites with 1 tbsp sugar until soft peaks form. Fold gently into the warm custard liquid.', timerMinutes: 5, tips: 'The whipped egg whites naturally float to the surface, creating that signature dark toasted top.' },
      { id: 'step_ep_3', stepNumber: 3, instruction: 'Pour into prepared pie crust. Bake at 180°C for 15 minutes, then reduce to 160°C for 30 minutes until custard is just set with a slight jiggle.', timerMinutes: 45, tips: 'A slight wobble in the center means silky smooth custard once cooled.' }
    ]
  },
  {
    id: 'rec_mango_graham_float',
    slug: 'mango-graham-refrigerator-cake',
    title: 'Mango Graham Float',
    englishTitle: 'Layered Mango & Graham Refrigerator Cake',
    description: 'The beloved Filipino holiday dessert: alternating layers of crisp honey graham crackers, sweetened chilled cream, and ripe golden Carabao mangoes.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 0,
    servings: 8,
    spiceLevel: 'NONE',
    originRegion: 'National Holiday Favorite',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Cakes & Pies',
    ingredients: [
      { id: 'ing_mgf_1', name: 'Ripe sweet Carabao mangoes', amount: 4, unit: 'pieces', notes: 'Thinly sliced into sheets', isOptional: false },
      { id: 'ing_mgf_2', name: 'Honey graham crackers', amount: 200, unit: 'g', notes: 'Whole crackers and crumbs', isOptional: false },
      { id: 'ing_mgf_3', name: 'All-purpose cream', amount: 500, unit: 'ml', notes: 'Chilled overnight', isOptional: false },
      { id: 'ing_mgf_4', name: 'Sweetened condensed milk', amount: 200, unit: 'ml', notes: 'Adjust sweetness to taste', isOptional: false }
    ],
    steps: [
      { id: 'step_mgf_1', stepNumber: 1, instruction: 'Whip chilled all-purpose cream and condensed milk with an electric mixer until doubled in volume and fluffy.', timerMinutes: 8, tips: 'Chilling the cream overnight allows it to whip into thick, cloud-like peaks.' },
      { id: 'step_mgf_2', stepNumber: 2, instruction: 'Line the bottom of a rectangular glass dish with whole graham crackers. Spread a layer of cream, then top with sliced mangoes.', timerMinutes: 8, tips: 'Repeat layers 3 times, finishing with sliced mango florets and crushed graham crumbs.' },
      { id: 'step_mgf_3', stepNumber: 3, instruction: 'Refrigerate for at least 6 hours (or freeze for 3 hours) before slicing into neat cake squares.', timerMinutes: 360, tips: 'Chilling softens the crackers into a melt-in-your-mouth cake-like texture.' }
    ]
  },
  {
    id: 'rec_leche_flan',
    slug: 'creamy-leche-flan',
    title: 'Creamy Leche Flan',
    englishTitle: 'Silky Caramel Custard',
    description: 'Ultra-creamy, velvety egg custard baked in an oval llanera mold with a golden amber caramel sauce.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 45,
    servings: 8,
    spiceLevel: 'NONE',
    originRegion: 'National Festive Tradition',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Kakanin & Custard',
    ingredients: [
      { id: 'ing_lf_1', name: 'Egg yolks', amount: 10, unit: 'yolks', notes: 'Whisked gently without aerating', isOptional: false },
      { id: 'ing_lf_2', name: 'Sweetened condensed milk', amount: 300, unit: 'ml', notes: 'Full can', isOptional: false },
      { id: 'ing_lf_3', name: 'Evaporated milk', amount: 370, unit: 'ml', notes: 'Full can', isOptional: false },
      { id: 'ing_lf_4', name: 'Granulated white sugar', amount: 100, unit: 'g', notes: 'Melted into amber caramel', isOptional: false }
    ],
    steps: [
      { id: 'step_lf_1', stepNumber: 1, instruction: 'Melt sugar directly in llanera molds over low heat until liquid amber caramel forms. Swirl to coat bottom and cool.', timerMinutes: 8, tips: 'Do not stir sugar while melting; swirl the pan gently to avoid crystallization.' },
      { id: 'step_lf_2', stepNumber: 2, instruction: 'Whisk yolks, condensed milk, and evaporated milk gently in one direction. Strain through a fine-mesh sieve twice.', timerMinutes: 5, tips: 'Straining twice removes chalaza and air bubbles, guaranteeing glass-smooth texture without holes.' },
      { id: 'step_lf_3', stepNumber: 3, instruction: 'Pour custard into llaneras, cover tightly with foil, and steam over low heat for 40 minutes (or bake in water bath).', timerMinutes: 40, tips: 'Keep water at a gentle simmer; boiling violently creates unsightly bubbles inside the custard.' }
    ]
  },
  {
    id: 'rec_tradisyunal_bibingka',
    slug: 'tradisyunal-na-bibingka',
    title: 'Tradisyunal na Bibingka',
    englishTitle: 'Charcoal-Baked Coconut Rice Cake',
    description: 'Fluffy milled rice cake cooked in banana leaves with charcoal heat on top and bottom, garnished with salted duck egg slices, butter, and grated fresh coconut.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Poblacion / Simbang Gabi Tradition',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Kakanin & Custard',
    ingredients: [
      { id: 'ing_bib_1', name: 'Rice flour (galapong)', amount: 250, unit: 'g', notes: 'Fine white rice flour', isOptional: false },
      { id: 'ing_bib_2', name: 'Coconut milk', amount: 250, unit: 'ml', notes: 'Fresh coconut milk', isOptional: false },
      { id: 'ing_bib_3', name: 'Eggs', amount: 3, unit: 'pieces', notes: 'Beaten', isOptional: false },
      { id: 'ing_bib_4', name: 'Salted duck egg', amount: 1, unit: 'piece', notes: 'Sliced into crescents', isOptional: false },
      { id: 'ing_bib_5', name: 'Banana leaves', amount: 2, unit: 'sheets', notes: 'Singed over flame to soften', isOptional: false },
      { id: 'ing_bib_6', name: 'Freshly grated coconut meat (niyog)', amount: 80, unit: 'g', notes: 'For topping', isOptional: false }
    ],
    steps: [
      { id: 'step_bib_1', stepNumber: 1, instruction: 'Whisk rice flour, sugar, baking powder, salt, coconut milk, and beaten eggs into a smooth batter.', timerMinutes: 5, tips: 'Whisk until completely smooth and free of dry flour pockets.' },
      { id: 'step_bib_2', stepNumber: 2, instruction: 'Line cake pans with singed fragrant banana leaves. Pour batter halfway up the mold.', timerMinutes: 5, tips: 'Singing banana leaves over open flame releases essential oils and prevents tearing.' },
      { id: 'step_bib_3', stepNumber: 3, instruction: 'Bake at 190°C for 15 minutes. Arrange salted egg slices and grated cheese on top, then broil for 5 minutes until charred.', timerMinutes: 20, tips: 'The slight smoky char on the cheese and salted egg replicates traditional charcoal baking.' },
      { id: 'step_bib_4', stepNumber: 4, instruction: 'Brush generously with melted butter, sprinkle with sugar, and serve with freshly grated coconut.', timerMinutes: 2, tips: 'Serve hot wrapped in the fragrant banana leaf.' }
    ]
  },
  {
    id: 'rec_cassava_cake',
    slug: 'cassava-cake-espesyal',
    title: 'Cassava Cake Espesyal',
    englishTitle: 'Baked Yuca Cake with Caramel Custard Topping',
    description: 'Chewy, decadent grated cassava cake enriched with coconut milk and condensed milk, topped with a thick caramelized golden custard sauce.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 50,
    servings: 10,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog / Southern Luzon',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Kakanin & Custard',
    ingredients: [
      { id: 'ing_cas_1', name: 'Grated fresh or frozen cassava', amount: 750, unit: 'g', notes: 'Drained', isOptional: false },
      { id: 'ing_cas_2', name: 'Coconut milk', amount: 400, unit: 'ml', notes: 'Full can', isOptional: false },
      { id: 'ing_cas_3', name: 'Sweetened condensed milk', amount: 300, unit: 'ml', notes: 'Divided for batter and topping', isOptional: false },
      { id: 'ing_cas_4', name: 'Evaporated milk', amount: 200, unit: 'ml', notes: 'Rich milk', isOptional: false },
      { id: 'ing_cas_5', name: 'Egg yolks', amount: 2, unit: 'yolks', notes: 'For custard topping', isOptional: false },
      { id: 'ing_cas_6', name: 'Grated cheddar cheese', amount: 60, unit: 'g', notes: 'Savory sweet topping', isOptional: true }
    ],
    steps: [
      { id: 'step_cas_1', stepNumber: 1, instruction: 'Combine grated cassava, coconut milk, evaporated milk, condensed milk, and melted butter. Pour into greased baking dish.', timerMinutes: 5, tips: 'Squeeze excess bitter water from cassava before mixing.' },
      { id: 'step_cas_2', stepNumber: 2, instruction: 'Bake at 175°C (350°F) for 40 minutes until cake is firm and top is lightly set.', timerMinutes: 40, tips: 'The base must be fully cooked before adding the delicate custard topping.' },
      { id: 'step_cas_3', stepNumber: 3, instruction: 'Whisk remaining condensed milk, coconut milk, egg yolks, and cheese. Pour over the cake and bake 15 minutes until golden caramel.', timerMinutes: 15, tips: 'Broil for the last 2 minutes for a gorgeous speckled caramel top.' }
    ]
  },

  // ==========================================
  // NOODLES, SOUPS & PANCAKES (PANCIT, SABAW AT HOTCAKE)
  // ==========================================
  {
    id: 'rec_pinoy_street_hotcake',
    slug: 'pinoy-street-hotcake',
    title: 'Pinoy Street Hotcake',
    englishTitle: 'Retro Fluffy Street Pancake with Margarine & Sugar',
    description: 'The nostalgic yellow street-corner hotcake of the Philippines: thick, pillowy, freshly griddled, and slathered while piping hot with golden margarine and granulated sugar.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'National Street Corner Classic',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Pancakes & Crepes',
    ingredients: [
      { id: 'ing_pnh_1', name: 'All-purpose flour', amount: 250, unit: 'g', notes: 'Sifted', isOptional: false },
      { id: 'ing_pnh_2', name: 'Baking powder', amount: 1, unit: 'tbsp', notes: 'For fluffy puff', isOptional: false },
      { id: 'ing_pnh_3', name: 'Granulated sugar', amount: 60, unit: 'g', notes: 'For batter and topping', isOptional: false },
      { id: 'ing_pnh_4', name: 'Fresh egg', amount: 1, unit: 'piece', notes: 'Beaten', isOptional: false },
      { id: 'ing_pnh_5', name: 'Milk or water', amount: 250, unit: 'ml', notes: 'Liquid base', isOptional: false },
      { id: 'ing_pnh_6', name: 'Yellow food coloring or turmeric pinch', amount: 2, unit: 'drops', notes: 'For iconic nostalgic yellow street hue', isOptional: false },
      { id: 'ing_pnh_7', name: 'Star Margarine (classic Pinoy margarine)', amount: 60, unit: 'g', notes: 'For slathering while steaming hot', isOptional: false }
    ],
    steps: [
      { id: 'step_pnh_1', stepNumber: 1, instruction: 'Whisk flour, baking powder, sugar, and salt in a bowl. In another bowl, combine egg, milk, vanilla, and 2 drops yellow food coloring.', timerMinutes: 5, tips: 'The iconic golden-yellow hue is the visual trademark of Philippine street food hotcakes.' },
      { id: 'step_pnh_2', stepNumber: 2, instruction: 'Pour liquid into dry ingredients and stir gently until just combined. Let batter rest for 5 minutes.', timerMinutes: 5, tips: 'Do not overmix; small lumps are fine and ensure a light, fluffy crumb.' },
      { id: 'step_pnh_3', stepNumber: 3, instruction: 'Heat a flat griddle over medium-low heat with a dab of margarine. Ladle 60ml batter and cook until bubbles form on top (approx 2 mins). Flip and cook 1 min.', timerMinutes: 6, tips: 'Cook on medium-low so the thick hotcake cooks through without burning the exterior.' },
      { id: 'step_pnh_4', stepNumber: 4, instruction: 'Remove immediately to plate, slather generously with Star Margarine, and sprinkle with granulated white sugar. Eat hot!', timerMinutes: 2, tips: 'The magic happens when the hotcake heat melts the margarine and sugar together into sweet, buttery perfection.' }
    ]
  },
  {
    id: 'rec_lumpiang_sariwa',
    slug: 'lumpiang-sariwa-crepe',
    title: 'Lumpiang Sariwa with Egg Crepe',
    englishTitle: 'Fresh Spring Roll with Homemade Egg Crepe Wrapper',
    description: 'Delicate homemade egg-flour crepe wrapper enclosing hearts of palm, julienned jicama, carrots, and lettuce, draped in sweet garlic peanut sauce.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 20,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Silay, Negros Occidental / Luzon',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Pancakes & Crepes',
    ingredients: [
      { id: 'ing_ls_1', name: 'Crepe wrapper batter (eggs, cornstarch, water, flour)', amount: 300, unit: 'ml', notes: 'Thin crepe batter', isOptional: false },
      { id: 'ing_ls_2', name: 'Jicama (singkamas) and carrots', amount: 300, unit: 'g', notes: 'Cut into fine julienne matchsticks', isOptional: false },
      { id: 'ing_ls_3', name: 'Firm tofu', amount: 150, unit: 'g', notes: 'Fried and diced', isOptional: false },
      { id: 'ing_ls_4', name: 'Sweet brown garlic sauce', amount: 250, unit: 'ml', notes: 'Soy, sugar, broth, cornstarch', isOptional: false },
      { id: 'ing_ls_5', name: 'Crushed roasted peanuts and minced garlic', amount: 50, unit: 'g', notes: 'For garnish', isOptional: false }
    ],
    steps: [
      { id: 'step_ls_1', stepNumber: 1, instruction: 'Swirl 50ml crepe batter in a lightly oiled nonstick pan to form a paper-thin translucent crepe. Cook 1 minute without flipping.', timerMinutes: 8, tips: 'Homemade egg crepe wrapper is soft and pliable, far superior to store-bought wrappers.' },
      { id: 'step_ls_2', stepNumber: 2, instruction: 'Sauté jicama, carrots, green beans, and fried tofu in chicken stock until tender-crisp. Drain excess liquid thoroughly.', timerMinutes: 10, tips: 'Drain the filling well so the crepe wrapper does not tear.' },
      { id: 'step_ls_3', stepNumber: 3, instruction: 'Lay lettuce leaf on crepe wrapper, add filling, and roll snugly. Ladle sweet garlic sauce and garnish with crushed peanuts.', timerMinutes: 5, tips: 'Fresh minced raw garlic in the sauce provides an authentic zesty kick.' }
    ]
  },
  {
    id: 'rec_pancit_palabok',
    slug: 'pancit-palabok-special',
    title: 'Pancit Palabok',
    englishTitle: 'Rice Noodles with Golden Shrimp Gravy',
    description: 'Thick cornstarch-rice noodles bathed in a luscious orange shrimp and annatto sauce, crowned with crushed chicharon, flaked smoked tinapa, and hard-boiled eggs.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 25,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'Malabon / National Festive Staple',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Pancit',
    ingredients: [
      { id: 'ing_pal_1', name: 'Bihon or luglug noodles', amount: 400, unit: 'g', notes: 'Cooked and drained', isOptional: false },
      { id: 'ing_pal_2', name: 'Fresh shrimp heads & shells broth', amount: 500, unit: 'ml', notes: 'Rich seafood stock base', isOptional: false },
      { id: 'ing_pal_3', name: 'Annatto water', amount: 50, unit: 'ml', notes: 'Natural golden orange color', isOptional: false },
      { id: 'ing_pal_4', name: 'Crushed chicharon (crispy pork rinds)', amount: 80, unit: 'g', notes: 'Crunchy topping', isOptional: false },
      { id: 'ing_pal_5', name: 'Flaked smoked fish (tinapa)', amount: 50, unit: 'g', notes: 'Savory topping', isOptional: false },
      { id: 'ing_pal_6', name: 'Hard-boiled eggs and spring onions', amount: 2, unit: 'pieces', notes: 'Sliced', isOptional: false },
      { id: 'ing_pal_7', name: 'Fresh calamansi', amount: 6, unit: 'pieces', notes: 'For squeezing before eating', isOptional: false }
    ],
    steps: [
      { id: 'step_pal_1', stepNumber: 1, instruction: 'Simmer shrimp heads in water, crush to extract deep orange juices, and strain for rich seafood stock.', timerMinutes: 15, tips: 'Fresh shrimp head stock gives Palabok its distinct authentic seafood umami.' },
      { id: 'step_pal_2', stepNumber: 2, instruction: 'Thicken shrimp stock with cornstarch and annatto oil over medium heat until a glossy, rich orange sauce forms.', timerMinutes: 8, tips: 'Whisk continuously so the cornstarch thickens without lumps.' },
      { id: 'step_pal_3', stepNumber: 3, instruction: 'Assemble: plate hot noodles, ladle generous golden shrimp sauce, and crown with chicharon, tinapa, eggs, and calamansi.', timerMinutes: 5, tips: 'Squeeze plenty of fresh calamansi juice directly over noodles to balance the rich sauce.' }
    ]
  },
  {
    id: 'rec_pancit_bihon_canton',
    slug: 'pancit-bihon-canton-guisado',
    title: 'Pancit Bihon at Canton Guisado',
    englishTitle: 'Combination Stir-Fried Rice & Egg Noodles',
    description: 'The ultimate party pancit: combination rice vermicelli and chewy wheat flour noodles stir-fried with shredded chicken, crisp cabbage, carrots, and snow peas.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 20,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'National Birthday & Fiesta Celebration',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Pancit',
    ingredients: [
      { id: 'ing_pbc_1', name: 'Bihon (rice vermicelli noodles)', amount: 250, unit: 'g', notes: 'Dry noodles', isOptional: false },
      { id: 'ing_pbc_2', name: 'Canton (flour egg noodles)', amount: 250, unit: 'g', notes: 'Dry egg noodles', isOptional: false },
      { id: 'ing_pbc_3', name: 'Shredded chicken breast', amount: 200, unit: 'g', notes: 'Cooked', isOptional: false },
      { id: 'ing_pbc_4', name: 'Shredded cabbage and carrots', amount: 250, unit: 'g', notes: 'Julienned', isOptional: false },
      { id: 'ing_pbc_5', name: 'Chicken stock', amount: 600, unit: 'ml', notes: 'For soaking and cooking noodles in wok', isOptional: false },
      { id: 'ing_pbc_6', name: 'Soy sauce and oyster sauce', amount: 60, unit: 'ml', notes: 'Savory stir fry glaze', isOptional: false }
    ],
    steps: [
      { id: 'step_pbc_1', stepNumber: 1, instruction: 'Sauté garlic, onions, chicken, and vegetables in a wide wok. Season with soy and oyster sauce, then remove vegetables.', timerMinutes: 6, tips: 'Removing vegetables before cooking noodles prevents them from getting soggy.' },
      { id: 'step_pbc_2', stepNumber: 2, instruction: 'Pour hot chicken stock into the wok. Submerge dry bihon and canton noodles, tossing until liquid is absorbed and noodles are al dente.', timerMinutes: 8, tips: 'Letting noodles cook directly in seasoned broth infuses every strand with deep flavor.' },
      { id: 'step_pbc_3', stepNumber: 3, instruction: 'Toss cooked vegetables back into the noodles. Serve with calamansi wedges.', timerMinutes: 3, tips: 'A symbol of long life and prosperity, never cut the noodles while cooking.' }
    ]
  },
  {
    id: 'rec_batangas_lomi',
    slug: 'batangas-lomi-espesyal',
    title: 'Batangas Lomi',
    englishTitle: 'Thick Egg Noodle Soup with Meat Toppings',
    description: 'Thick fresh miki egg noodles in a rich, velvety cassava-thickened egg drop soup, overflowing with crispy pork liver, chicharon, and meatballs.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'Lipa City, Batangas',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Pancit',
    ingredients: [
      { id: 'ing_lom_1', name: 'Fresh thick miki egg noodles', amount: 500, unit: 'g', notes: 'Rinsed', isOptional: false },
      { id: 'ing_lom_2', name: 'Pork broth', amount: 1000, unit: 'ml', notes: 'Rich stock', isOptional: false },
      { id: 'ing_lom_3', name: 'Cassava starch or cornstarch slurry', amount: 50, unit: 'g', notes: 'Creates thick signature broth', isOptional: false },
      { id: 'ing_lom_4', name: 'Beaten eggs', amount: 2, unit: 'pieces', notes: 'For silky egg ribbons', isOptional: false },
      { id: 'ing_lom_5', name: 'Crushed chicharon, kikiam, liver slices', amount: 200, unit: 'g', notes: 'Abundant meat toppings', isOptional: false }
    ],
    steps: [
      { id: 'step_lom_1', stepNumber: 1, instruction: 'Boil rich pork broth in a pot. Add thick miki noodles and simmer for 5 minutes.', timerMinutes: 5, tips: 'Rinse fresh miki noodles in warm water first to remove excess brine.' },
      { id: 'step_lom_2', stepNumber: 2, instruction: 'Stir in starch slurry to create thick, glossy gravy. Slowly drizzle beaten eggs while stirring to create fine ribbons.', timerMinutes: 5, tips: 'Traditional Batangas Lomi broth should be thick enough to suspend the toppings.' },
      { id: 'step_lom_3', stepNumber: 3, instruction: 'Ladle into large bowls and pile high with chicharon, sliced liver, and kikiam. Serve with raw chopped onions, calamansi, and soy sauce.', timerMinutes: 3, tips: 'Diners customize their soup at the table with spicy calamansi-soy dip.' }
    ]
  },
  {
    id: 'rec_creamy_chicken_sopas',
    slug: 'creamy-chicken-sopas',
    title: 'Creamy Chicken Sopas',
    englishTitle: 'Filipino Chicken Macaroni Soup',
    description: 'Comforting rainy day staple: elbow macaroni simmered with shredded chicken, hotdogs, and shredded cabbage in rich evaporated milk broth.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'National Rainy-Day Classic',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Soups & Porridge',
    ingredients: [
      { id: 'ing_sop_1', name: 'Elbow macaroni', amount: 250, unit: 'g', notes: 'Dry pasta', isOptional: false },
      { id: 'ing_sop_2', name: 'Boiled shredded chicken breast', amount: 300, unit: 'g', notes: 'With chicken stock', isOptional: false },
      { id: 'ing_sop_3', name: 'Red hotdogs', amount: 2, unit: 'pieces', notes: 'Sliced into coins', isOptional: false },
      { id: 'ing_sop_4', name: 'Evaporated milk', amount: 250, unit: 'ml', notes: 'Signature creamy broth base', isOptional: false },
      { id: 'ing_sop_5', name: 'Shredded cabbage and diced carrots', amount: 150, unit: 'g', notes: 'Fresh greens', isOptional: false }
    ],
    steps: [
      { id: 'step_sop_1', stepNumber: 1, instruction: 'Sauté garlic, onions, carrots, and hotdogs in butter. Add shredded chicken and 1.2 liters chicken stock.', timerMinutes: 8, tips: 'Red hotdog coins are a beloved classic in authentic Filipino comfort sopas.' },
      { id: 'step_sop_2', stepNumber: 2, instruction: 'Add elbow macaroni. Simmer for 10 minutes until macaroni is tender.', timerMinutes: 10, tips: 'Macaroni will absorb broth as it cooks, so keep extra stock handy.' },
      { id: 'step_sop_3', stepNumber: 3, instruction: 'Pour in evaporated milk and shredded cabbage. Simmer for 3 minutes on low heat and season with fish sauce.', timerMinutes: 3, tips: 'Add evaporated milk right at the end to keep the broth creamy and velvety.' }
    ]
  },
  {
    id: 'rec_arroz_caldo',
    slug: 'arroz-caldo-congee',
    title: 'Arroz Caldo',
    englishTitle: 'Chicken Ginger Rice Porridge',
    description: 'Hearty, comforting rice porridge infused with generous fresh ginger and fragrant garlic, garnished with toasted garlic chips and hard-boiled egg.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    servings: 5,
    spiceLevel: 'NONE',
    originRegion: 'National Comfort Food',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Soups & Porridge',
    ingredients: [
      { id: 'ing_ac_1', name: 'Glutinous sweet rice (malagkit)', amount: 200, unit: 'g', notes: 'Combined with jasmine rice', isOptional: false },
      { id: 'ing_ac_2', name: 'Chicken bone-in pieces', amount: 500, unit: 'g', notes: 'Wings or drumsticks', isOptional: false },
      { id: 'ing_ac_3', name: 'Fresh ginger root', amount: 60, unit: 'g', notes: 'Finely julienned', isOptional: false },
      { id: 'ing_ac_4', name: 'Toasted garlic chips', amount: 40, unit: 'g', notes: 'Golden brown topping', isOptional: false },
      { id: 'ing_ac_5', name: 'Safflower / Kasubha', amount: 1, unit: 'pinch', notes: 'Natural yellow color', isOptional: true },
      { id: 'ing_ac_6', name: 'Hard-boiled egg and calamansi', amount: 2, unit: 'pieces', notes: 'Quartered', isOptional: false }
    ],
    steps: [
      { id: 'step_ac_1', stepNumber: 1, instruction: 'Sauté lots of ginger matchsticks, garlic, and onions in oil until fragrant. Add chicken and brown lightly.', timerMinutes: 6, tips: 'Heavy ginger is the soul of healing Arroz Caldo.' },
      { id: 'step_ac_2', stepNumber: 2, instruction: 'Add rice and stir for 2 minutes to toast grains. Pour in 1.2 liters chicken stock and kasubha.', timerMinutes: 5, tips: 'Mixing regular rice with glutinous malagkit yields the perfect velvety thickness.' },
      { id: 'step_ac_3', stepNumber: 3, instruction: 'Simmer on low for 25 minutes, stirring occasionally until rice blooms into a thick porridge.', timerMinutes: 25, tips: 'Stir frequently towards the end so the porridge does not stick to the bottom of the pot.' },
      { id: 'step_ac_4', stepNumber: 4, instruction: 'Ladle into bowls and crown with golden toasted garlic chips, scallions, boiled egg, and fresh calamansi.', timerMinutes: 2, tips: 'Squeeze calamansi and sprinkle fish sauce right into the steaming bowl.' }
    ]
  },
  {
    id: 'rec_champorado_tuyo',
    slug: 'champorado-with-crispy-tuyo',
    title: 'Champorado with Crispy Tuyo',
    englishTitle: 'Chocolate Rice Porridge with Salted Dried Fish',
    description: 'Thick, comforting sweet chocolate rice porridge cooked with rich native tablea cacao, drizzled with evaporated milk and paired with crispy salty tuyo.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'National Rainy-Day Tradition',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_noodles',
    mainIngredient: 'Noodles & Pancakes',
    cutOrType: 'Soups & Porridge',
    ingredients: [
      { id: 'ing_ch_1', name: 'Glutinous sweet rice (malagkit)', amount: 200, unit: 'g', notes: 'Rinsed', isOptional: false },
      { id: 'ing_ch_2', name: 'Pure tablea cacao (or dark cocoa powder)', amount: 80, unit: 'g', notes: 'Native pure chocolate tablets', isOptional: false },
      { id: 'ing_ch_3', name: 'Brown sugar', amount: 80, unit: 'g', notes: 'To taste', isOptional: false },
      { id: 'ing_ch_4', name: 'Evaporated milk or condensed milk', amount: 150, unit: 'ml', notes: 'For sweet creamy swirl', isOptional: false },
      { id: 'ing_ch_5', name: 'Crispy fried tuyo (salted dried fish)', amount: 4, unit: 'pieces', notes: 'The iconic salty contrast', isOptional: false }
    ],
    steps: [
      { id: 'step_ch_1', stepNumber: 1, instruction: 'Boil glutinous rice in 800ml water for 15 minutes until grains expand and soften.', timerMinutes: 15, tips: 'Stir occasionally to prevent rice from catching at the bottom.' },
      { id: 'step_ch_2', stepNumber: 2, instruction: 'Dissolve tablea cacao tablets in 150ml warm water, then pour into the porridge with brown sugar.', timerMinutes: 8, tips: 'Real tablea cacao provides bittersweet roasted notes incomparable to artificial powder.' },
      { id: 'step_ch_3', stepNumber: 3, instruction: 'Ladle into bowls, swirl with cold evaporated milk, and serve alongside fried crispy tuyo.', timerMinutes: 2, tips: 'The contrast of rich sweet chocolate and crunchy salty fish is culinary genius.' }
    ]
  },
  {
    id: 'rec_ensaladang_talong',
    slug: 'ensaladang-talong-salad',
    title: 'Ensaladang Talong',
    englishTitle: 'Smoky Grilled Eggplant & Tomato Salad',
    description: 'Whole flame-charred eggplant peeled and tossed with juicy diced ripe tomatoes, crisp red onions, and savory fermented bagoong or calamansi vinaigrette.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Ilocos / National',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_vegetables',
    mainIngredient: 'Vegetables',
    cutOrType: 'Eggplant',
    ingredients: [
      { id: 'ing_et_1', name: 'Large Asian purple eggplants', amount: 3, unit: 'pieces', notes: 'Flame grilled', isOptional: false },
      { id: 'ing_et_2', name: 'Ripe red tomatoes', amount: 3, unit: 'pieces', notes: 'Diced', isOptional: false },
      { id: 'ing_et_3', name: 'Red onion', amount: 1, unit: 'piece', notes: 'Diced', isOptional: false },
      { id: 'ing_et_4', name: 'Bagoong isda or alamang (or cane vinegar)', amount: 30, unit: 'ml', notes: 'To taste', isOptional: false }
    ],
    steps: [
      { id: 'step_et_1', stepNumber: 1, instruction: 'Roast eggplants over flame until skin is completely charred and flesh is tender.', timerMinutes: 8, tips: 'The charred skin imparts a deeply smoky aroma.' },
      { id: 'step_et_2', stepNumber: 2, instruction: 'Peel off charred skin under running water, coarsely chop flesh, and toss with tomatoes and onions.', timerMinutes: 5, tips: 'Serve chilled or at room temperature alongside grilled pork or fish.' }
    ]
  },
  {
    id: 'rec_ensaladang_itlog_maalat',
    slug: 'ensaladang-itlog-na-maalat',
    title: 'Ensaladang Itlog na Maalat',
    englishTitle: 'Salted Duck Egg & Tomato Salad',
    description: 'Rich, creamy crimson salted duck eggs diced and tossed with sweet ripe vine tomatoes, spring onions, and freshly cracked black pepper.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    servings: 4,
    spiceLevel: 'NONE',
    originRegion: 'Tagalog / Laguna',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Eggs & Ensalada',
    ingredients: [
      { id: 'ing_ima_1', name: 'Salted duck eggs (itlog na maalat)', amount: 3, unit: 'pieces', notes: 'Peeled and diced into cubes', isOptional: false },
      { id: 'ing_ima_2', name: 'Ripe red tomatoes', amount: 4, unit: 'pieces', notes: 'Diced', isOptional: false },
      { id: 'ing_ima_3', name: 'Red onion or scallions', amount: 1, unit: 'piece', notes: 'Finely sliced', isOptional: false }
    ],
    steps: [
      { id: 'step_ima_1', stepNumber: 1, instruction: 'Gently cube salted duck eggs and tomatoes. Toss lightly with onions in a ceramic bowl.', timerMinutes: 5, tips: 'Toss gently so the rich, oily orange yolks remain in tender cubes.' },
      { id: 'step_ima_2', stepNumber: 2, instruction: 'Serve as an authentic side dish to grilled meats, tinapa, or steamed rice.', timerMinutes: 2, tips: 'The savory brine of the egg cuts through fatty barbecue dishes.' }
    ]
  },
  {
    id: 'rec_bangsilog',
    slug: 'crispy-bangsilog-breakfast',
    title: 'Bangsilog Special',
    englishTitle: 'Crispy Milkfish with Garlic Rice & Egg',
    description: 'Crispy golden fried marinated milkfish (daing na bangus) served with a mountain of sinangag garlic rice, sunny-side-up egg, and spiced vinegar.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 2,
    spiceLevel: 'NONE',
    originRegion: 'National Silog Favorite',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_eggs',
    mainIngredient: 'Eggs',
    cutOrType: 'Silog Meals',
    ingredients: [
      { id: 'ing_bs_1', name: 'Boneless marinated milkfish (daing)', amount: 1, unit: 'piece', notes: 'Garlic and vinegar marinated', isOptional: false },
      { id: 'ing_bs_2', name: 'Fresh eggs', amount: 2, unit: 'pieces', notes: 'Fried sunny side up', isOptional: false },
      { id: 'ing_bs_3', name: 'Garlic fried rice (sinangag)', amount: 400, unit: 'g', notes: 'Warm', isOptional: false }
    ],
    steps: [
      { id: 'step_bs_1', stepNumber: 1, instruction: 'Pan-fry marinated milkfish in hot oil for 4-5 minutes per side until crunchy and golden.', timerMinutes: 10, tips: 'Fry skin-side down first until blistered and crisp.' },
      { id: 'step_bs_2', stepNumber: 2, instruction: 'Plate alongside fried sunny-side-up eggs and a mountain of fragrant garlic rice.', timerMinutes: 3, tips: 'Serve with spicy garlic vinegar for dipping.' }
    ]
  },
  {
    id: 'rec_buko_pie',
    slug: 'laguna-special-buko-pie',
    title: 'Buko Pie (Laguna Style)',
    englishTitle: 'Young Coconut Custard Pie',
    description: 'Iconic Laguna pie featuring a double flaky pastry crust filled generously with tender young coconut meat (buko) suspended in rich condensed milk custard.',
    prepTimeMinutes: 30,
    cookTimeMinutes: 45,
    servings: 8,
    spiceLevel: 'NONE',
    originRegion: 'Los Baños, Laguna',
    difficulty: 'MEDIUM',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_baking',
    mainIngredient: 'Baking & Desserts',
    cutOrType: 'Cakes & Pies',
    ingredients: [
      { id: 'ing_bp_1', name: 'Fresh young coconut meat (buko strips)', amount: 500, unit: 'g', notes: 'Tender coconut meat', isOptional: false },
      { id: 'ing_bp_2', name: 'Double 9-inch flaky pie crust', amount: 2, unit: 'crusts', notes: 'Top and bottom crusts', isOptional: false },
      { id: 'ing_bp_3', name: 'Sweetened condensed milk', amount: 200, unit: 'ml', notes: 'Rich sweet custard', isOptional: false },
      { id: 'ing_bp_4', name: 'Cornstarch slurry', amount: 50, unit: 'g', notes: 'Thickener for custard', isOptional: false }
    ],
    steps: [
      { id: 'step_bp_1', stepNumber: 1, instruction: 'Cook young coconut meat with coconut water, condensed milk, and cornstarch until thick and translucent.', timerMinutes: 10, tips: 'Use young, tender coconut meat rather than mature hard coconut.' },
      { id: 'step_bp_2', stepNumber: 2, instruction: 'Ladle hot filling into bottom pie crust, drape top crust, crimp edges, and cut vent slits. Brush with egg wash.', timerMinutes: 8, tips: 'Venting the top crust allows steam to escape so the bottom crust bakes crisp.' },
      { id: 'step_bp_3', stepNumber: 3, instruction: 'Bake at 190°C (375°F) for 40-45 minutes until golden brown. Cool completely before slicing.', timerMinutes: 45, tips: 'Allowing the pie to cool sets the coconut custard cleanly.' }
    ]
  },
  {
    id: 'rec_bangus_sisig',
    slug: 'crispy-bangus-sisig',
    title: 'Bangus Sisig',
    englishTitle: 'Crispy Sizzling Flaked Milkfish',
    description: 'Flaked crispy fried boneless milkfish tossed with minced red onions, ginger, calamansi, and green chilies served on a smoking hot plate.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    servings: 4,
    spiceLevel: 'MILD',
    originRegion: 'Pangasinan / Central Luzon',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_seafood',
    mainIngredient: 'Seafood',
    cutOrType: 'Milkfish (Bangus)',
    ingredients: [
      { id: 'ing_bsg_1', name: 'Boneless milkfish fillet', amount: 500, unit: 'g', notes: 'Deep-fried until crispy, flaked', isOptional: false },
      { id: 'ing_bsg_2', name: 'Red onions', amount: 2, unit: 'pieces', notes: 'Finely minced', isOptional: false },
      { id: 'ing_bsg_3', name: 'Fresh ginger and green chilies', amount: 30, unit: 'g', notes: 'Minced', isOptional: false },
      { id: 'ing_bsg_4', name: 'Calamansi juice & soy sauce', amount: 40, unit: 'ml', notes: 'For seasoning', isOptional: false }
    ],
    steps: [
      { id: 'step_bsg_1', stepNumber: 1, instruction: 'Deep fry boneless bangus until skin and meat are deeply golden and crispy. Shred into flakes.', timerMinutes: 10, tips: 'Frying very crispy ensures the fish retains crunch when tossed.' },
      { id: 'step_bsg_2', stepNumber: 2, instruction: 'Toss flaked bangus with minced onions, ginger, calamansi, and chilies. Transfer to sizzling platter.', timerMinutes: 4, tips: 'A lighter, seafood alternative to traditional pork sisig with phenomenal flavor.' }
    ]
  },
  {
    id: 'rec_nilagang_baka',
    slug: 'nilagang-baka-shank',
    title: 'Nilagang Baka',
    englishTitle: 'Beef Shank, Cabbage & Saba Banana Broth',
    description: 'Simmered beef shank and brisket in a fragrant peppercorn broth loaded with sweet saba bananas, crisp green cabbage, and sweet corn.',
    prepTimeMinutes: 15,
    cookTimeMinutes: 90,
    servings: 6,
    spiceLevel: 'NONE',
    originRegion: 'National Comfort Food',
    difficulty: 'EASY',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    isExternal: false,
    categoryId: 'cat_beef',
    mainIngredient: 'Beef',
    cutOrType: 'Shank (Bulalo)',
    ingredients: [
      { id: 'ing_nb_1', name: 'Beef shank or brisket', amount: 900, unit: 'g', notes: 'Cut into chunks', isOptional: false },
      { id: 'ing_nb_2', name: 'Ripe saba bananas (plantains)', amount: 3, unit: 'pieces', notes: 'Peeled and halved diagonally', isOptional: false },
      { id: 'ing_nb_3', name: 'Green cabbage', amount: 1, unit: 'head', notes: 'Quartered', isOptional: false },
      { id: 'ing_nb_4', name: 'Whole black peppercorns', amount: 1, unit: 'tbsp', notes: 'Cracked', isOptional: false }
    ],
    steps: [
      { id: 'step_nb_1', stepNumber: 1, instruction: 'Simmer beef shank with onions and peppercorns for 80 minutes until fork-tender.', timerMinutes: 80, tips: 'Keep at a gentle simmer for clean, sweet broth.' },
      { id: 'step_nb_2', stepNumber: 2, instruction: 'Add halved saba bananas and cook for 8 minutes until bananas add natural sweetness.', timerMinutes: 8, tips: 'Saba bananas are the authentic Filipino secret to rich, naturally sweet beef broth.' },
      { id: 'step_nb_3', stepNumber: 3, instruction: 'Add cabbage wedges, cover pot, remove from heat, and let steam for 3 minutes.', timerMinutes: 3, tips: 'Serve with steamed rice and patis-calamansi dip.' }
    ]
  }
];

// Update recipes count on categories
SEEDED_CATEGORIES.forEach(cat => {
  cat.recipesCount = SEEDED_RECIPES.filter(r => r.categoryId === cat.id).length;
});

console.log('Total Seeded Recipes:', SEEDED_RECIPES.length);
console.log('Categories & counts:');
SEEDED_CATEGORIES.forEach(c => console.log(`- ${c.name} (${c.id}): ${c.recipesCount} recipes`));

// Generate the TypeScript file content
const fileContent = `import { Category, Recipe } from '@kusinadex/types';

export const SEEDED_CATEGORIES: Category[] = ${JSON.stringify(SEEDED_CATEGORIES, null, 2)};

export const SEEDED_RECIPES: Recipe[] = ${JSON.stringify(SEEDED_RECIPES, null, 2)};
`;

// Write to backend fallbackData.ts
const serverFallbackPath = path.join(__dirname, '../apps/server/src/services/fallbackData.ts');
fs.writeFileSync(serverFallbackPath, fileContent, 'utf8');
console.log('Wrote to server fallbackData.ts:', serverFallbackPath);

// Write to mobile fallbackData.ts
const mobileFallbackPath = path.join(__dirname, '../apps/mobile/src/services/fallbackData.ts');
fs.writeFileSync(mobileFallbackPath, fileContent, 'utf8');
console.log('Wrote to mobile fallbackData.ts:', mobileFallbackPath);
