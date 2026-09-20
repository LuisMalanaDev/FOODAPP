const https = require('https');

// Helper to fetch an HTML page
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 8000,
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return resolve(fetchPage(res.headers.location));
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', reject)
      .on('timeout', () => reject(new Error('Request timed out')));
  });
}

function parseDuration(pt) {
  if (!pt || typeof pt !== 'string') return 25;
  let mins = 0;
  const hours = pt.match(/(\d+)H/);
  const minutes = pt.match(/(\d+)M/);
  if (hours) mins += parseInt(hours[1], 10) * 60;
  if (minutes) mins += parseInt(minutes[1], 10);
  return mins || 25;
}

function parseIngredient(raw, index) {
  if (!raw) return { id: `ing_${index}`, name: 'Ingredient', amount: 1, unit: 'portion', notes: '', isOptional: false };
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/^([\d\/\.\s]+)?\s*([a-zA-Z]+)?\s+(.+)$/);
  if (match) {
    let amountStr = (match[1] || '1').trim();
    let unit = (match[2] || 'piece').toLowerCase();
    let name = match[3].trim();
    let amount = 1;
    if (amountStr.includes('/')) {
      const parts = amountStr.split(' ');
      if (parts.length === 2) {
        const frac = parts[1].split('/');
        amount = parseFloat(parts[0]) + parseFloat(frac[0]) / parseFloat(frac[1]);
      } else {
        const frac = parts[0].split('/');
        amount = parseFloat(frac[0]) / parseFloat(frac[1]);
      }
    } else {
      amount = parseFloat(amountStr) || 1;
    }
    return {
      id: `ing_${index}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      amount: Math.round(amount * 10) / 10,
      unit,
      notes: '',
      isOptional: false,
    };
  }
  return {
    id: `ing_${index}_${Math.random().toString(36).substr(2, 5)}`,
    name: cleaned,
    amount: 1,
    unit: 'portion',
    notes: '',
    isOptional: false,
  };
}

/**
 * Ultra-accurate classification engine that inspects title, ingredients, and description.
 * Ensures dishes are placed in their authentic culinary discipline.
 */
function classifyRecipe(title, description = '', rawCategories = [], ingredients = []) {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const ingText = (Array.isArray(ingredients) ? ingredients.join(' ') : String(ingredients)).toLowerCase();
  const fullText = `${titleLower} ${descLower} ${rawCategories.join(' ').toLowerCase()} ${ingText}`;

  // -------------------------------------------------------------
  // 1. NOODLES, SOUPS & PANCAKES (Pancit, Sopas, Arroz Caldo, Hotcake)
  // -------------------------------------------------------------
  const isPancit = titleLower.includes('pancit') || titleLower.includes('bihon') || titleLower.includes('canton') ||
    titleLower.includes('palabok') || titleLower.includes('lomi') || titleLower.includes('sotanghon') ||
    titleLower.includes('mami') || titleLower.includes('udon') || titleLower.includes('ramen') || titleLower.includes('malabon');
  const isPancake = titleLower.includes('hotcake') || titleLower.includes('pancake') || titleLower.includes('crepe') || titleLower.includes('waffle');
  const isPorridge = titleLower.includes('sopas') || titleLower.includes('arroz caldo') || titleLower.includes('lugaw') ||
    titleLower.includes('champorado') || titleLower.includes('congee') || titleLower.includes('goto');

  if (isPancit || isPancake || isPorridge) {
    let cut = 'Pancit';
    if (titleLower.includes('ramen') || titleLower.includes('mami') || titleLower.includes('batchoy')) cut = 'Ramen & Mami';
    else if (isPancake) cut = 'Pancakes & Crepes';
    else if (isPorridge) cut = 'Soups & Porridge';
    else cut = 'Pancit';

    return { categoryId: 'cat_noodles', mainIngredient: 'Noodles & Pancakes', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 2. DESSERTS, CAKES & BAKING (Kakanin, Breads, Cakes, Pies)
  // -------------------------------------------------------------
  const isBakingOrDessert = titleLower.includes('cake') || titleLower.includes('pie') || titleLower.includes('bread') ||
    titleLower.includes('pandesal') || titleLower.includes('ensaymada') || titleLower.includes('bibingka') || titleLower.includes('leche flan') ||
    titleLower.includes('biko') || titleLower.includes('cassava') || titleLower.includes('kakanin') || titleLower.includes('sapin-sapin') ||
    titleLower.includes('sapin sapin') || titleLower.includes('kutsinta') || titleLower.includes('puto') || titleLower.includes('turon') ||
    titleLower.includes('maruya') || titleLower.includes('maja blanca') || titleLower.includes('polvoron') || titleLower.includes('halaya') ||
    titleLower.includes('pastry') || titleLower.includes('cookie') || titleLower.includes('muffin') || titleLower.includes('float') ||
    titleLower.includes('custard') || titleLower.includes('pichi-pichi') || titleLower.includes('espasol') || titleLower.includes('halo-halo') ||
    titleLower.includes('buko pandan') || titleLower.includes('ginataang bilo') || titleLower.includes('pastillas');

  if (isBakingOrDessert) {
    let cut = 'Kakanin & Custard';
    if (titleLower.includes('bread') || titleLower.includes('pandesal') || titleLower.includes('ensaymada') || titleLower.includes('roll') || titleLower.includes('bun') || titleLower.includes('toast')) {
      cut = 'Breads & Bakeshop';
    } else if (titleLower.includes('cake') || titleLower.includes('pie') || titleLower.includes('float') || titleLower.includes('tart') || titleLower.includes('muffin')) {
      cut = 'Cakes & Pies';
    } else {
      cut = 'Kakanin & Custard';
    }

    return { categoryId: 'cat_baking', mainIngredient: 'Baking & Desserts', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 3. EGGS & BREAKFAST (Silogs, Tortas, Kwek-kwek)
  // -------------------------------------------------------------
  const isSilog = titleLower.includes('silog') || titleLower.includes('tapsilog') || titleLower.includes('tocilog') ||
    titleLower.includes('bangsilog') || titleLower.includes('longsilog') || titleLower.includes('chicksilog') || titleLower.includes('cornsilog');
  const isTorta = titleLower.includes('torta') || titleLower.includes('omelet') || titleLower.includes('omelette') || titleLower.includes('sarciadong itlog');
  const isStreetEgg = titleLower.includes('kwek') || titleLower.includes('tokneneng');
  const isEggEnsalada = titleLower.includes('salted egg') || titleLower.includes('itlog na maalat');

  if (isSilog || isTorta || isStreetEgg || isEggEnsalada) {
    let cut = 'Silog Meals';
    if (isSilog) cut = 'Silog Meals';
    else if (isTorta) cut = 'Omelettes & Tortas';
    else if (isStreetEgg) cut = 'Street Egg Snacks';
    else if (isEggEnsalada) cut = 'Eggs & Ensalada';

    return { categoryId: 'cat_eggs', mainIngredient: 'Eggs', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 4. VEGETABLES & GREENS (Explicit Vegetable Dishes by Title)
  // -------------------------------------------------------------
  const isVegetableTitle =
    titleLower.includes('pinakbet') || titleLower.includes('pakbet') ||
    titleLower.includes('chop suey') || titleLower.includes('chopsuey') ||
    titleLower.includes('dinengdeng') || titleLower.includes('diningding') ||
    titleLower.includes('bulanglang') || titleLower.includes('laswa') ||
    titleLower.includes('monggo') || titleLower.includes('munggo') || titleLower.includes('mung bean') ||
    titleLower.includes('laing') ||
    titleLower.includes('ampalaya') || titleLower.includes('bitter melon') ||
    titleLower.includes('sitaw') || titleLower.includes('kalabasa') ||
    titleLower.includes('sayote') || titleLower.includes('kangkong') ||
    titleLower.includes('pechay') || titleLower.includes('repolyo') ||
    titleLower.includes('upo') || titleLower.includes('patola') ||
    titleLower.includes('sigarilyas') || titleLower.includes('ensaladang talong');

  if (isVegetableTitle && !titleLower.startsWith('pork chop') && !titleLower.startsWith('crispy pata') && !titleLower.startsWith('bagnet')) {
    let cut = 'Squash & Beans';
    if (titleLower.includes('ampalaya') || titleLower.includes('bitter melon')) {
      cut = 'Bitter Melon';
    } else if (titleLower.includes('taro') || titleLower.includes('gabi') || titleLower.includes('laing')) {
      cut = 'Taro Leaves';
    } else if (titleLower.includes('talong') || titleLower.includes('eggplant')) {
      cut = 'Eggplant';
    } else if (titleLower.includes('monggo') || titleLower.includes('mung')) {
      cut = 'Legumes & Monggo';
    } else {
      cut = 'Squash & Beans';
    }
    return { categoryId: 'cat_vegetables', mainIngredient: 'Vegetables', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 5. SEAFOOD & FISH (Explicit Seafood Dishes by Title)
  // -------------------------------------------------------------
  const isSeafoodTitle =
    titleLower.includes('fish') || titleLower.includes('isda') || titleLower.includes('bangus') ||
    titleLower.includes('tilapia') || titleLower.includes('salmon') || titleLower.includes('shrimp') ||
    titleLower.includes('hipon') || titleLower.includes('squid') || titleLower.includes('pusit') ||
    titleLower.includes('crab') || titleLower.includes('alimango') || titleLower.includes('alimasag') ||
    titleLower.includes('tuna') || titleLower.includes('sardines') || titleLower.includes('sardinas') ||
    titleLower.includes('galunggong') || titleLower.includes('mackerel') || titleLower.includes('mahi-mahi') ||
    titleLower.includes('mussel') || titleLower.includes('tahong') || titleLower.includes('clam') ||
    titleLower.includes('halaan') || titleLower.includes('paksiw na isda') || titleLower.includes('escabeche') ||
    titleLower.includes('sarciado') || titleLower.includes('kinilaw') || titleLower.includes('daing') ||
    titleLower.includes('hito') || titleLower.includes('catfish') || titleLower.includes('tanigue') ||
    titleLower.includes('lapu-lapu') || titleLower.includes('prawn') || titleLower.includes('calamares');

  if (isSeafoodTitle) {
    let cut = 'Milkfish (Bangus)';
    if (titleLower.includes('bangus') || titleLower.includes('milkfish') || titleLower.includes('daing')) {
      cut = 'Milkfish (Bangus)';
    } else if (titleLower.includes('tilapia')) {
      cut = 'Tilapia';
    } else if (titleLower.includes('shrimp') || titleLower.includes('hipon') || titleLower.includes('prawn') || titleLower.includes('gambas')) {
      cut = 'Shrimp (Hipon)';
    } else if (titleLower.includes('squid') || titleLower.includes('pusit') || titleLower.includes('calamares')) {
      cut = 'Squid (Pusit)';
    } else {
      cut = 'Salmon & Crab';
    }
    return { categoryId: 'cat_seafood', mainIngredient: 'Seafood', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 6. PORK (Baboy) - Title-level recognition (BAGNET, SISIG, CRISPY PATA, LIEMPO, MENUDO, HUMBA, ETC)
  // -------------------------------------------------------------
  const isPorkTitle =
    titleLower.includes('bagnet') || titleLower.includes('pork') || titleLower.includes('baboy') ||
    titleLower.includes('liempo') || titleLower.includes('lechon') || titleLower.includes('sisig') ||
    titleLower.includes('menudo') || titleLower.includes('humba') || titleLower.includes('pata') ||
    titleLower.includes('tocino') || titleLower.includes('longganisa') || titleLower.includes('chicharon') ||
    titleLower.includes('embutido') || titleLower.includes('dinuguan') || titleLower.includes('bicol express') ||
    titleLower.includes('spareribs') || titleLower.includes('costillas') || titleLower.includes('igado') ||
    titleLower.includes('bopis') || titleLower.includes('hamonado') || titleLower.includes('estofado') ||
    titleLower.includes('binagoongan') || titleLower.includes('tokwa\'t baboy') || titleLower.includes('tokwat baboy');

  if (isPorkTitle) {
    let cut = 'Belly / Liempo';
    if (titleLower.includes('chop') || titleLower.includes('porkchop') || fullText.includes('pork chop')) {
      cut = 'Pork Chops';
    } else if (titleLower.includes('rib') || titleLower.includes('costillas') || titleLower.includes('spareribs')) {
      cut = 'Ribs';
    } else if (titleLower.includes('giniling') || titleLower.includes('ground') || titleLower.includes('picadillo') || titleLower.includes('meatball') || titleLower.includes('embutido')) {
      cut = 'Ground (Giniling)';
    } else if (titleLower.includes('pata') || titleLower.includes('hock') || titleLower.includes('crispy pata')) {
      cut = 'Hock / Pata';
    } else if (titleLower.includes('sisig') || titleLower.includes('mask') || titleLower.includes('tenga') || titleLower.includes('ears') || titleLower.includes('bopis') || titleLower.includes('igado') || titleLower.includes('dinuguan')) {
      cut = 'Offal & Sisig';
    } else if (titleLower.includes('bbq') || titleLower.includes('barbecue') || titleLower.includes('barbeque') || titleLower.includes('inihaw')) {
      cut = 'Barbecue & Inihaw';
    } else if (titleLower.includes('menudo') || titleLower.includes('afritada') || titleLower.includes('pochero') || titleLower.includes('stew') || titleLower.includes('estofado') || titleLower.includes('kaldereta') || titleLower.includes('kasim')) {
      cut = 'Shoulder / Stew';
    } else {
      cut = 'Belly / Liempo';
    }
    return { categoryId: 'cat_pork', mainIngredient: 'Pork', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 7. CHICKEN (Manok) - Title-level recognition
  // -------------------------------------------------------------
  const isChickenTitle =
    titleLower.includes('chicken') || titleLower.includes('manok') || titleLower.includes('inasal') ||
    titleLower.includes('tinola') || titleLower.includes('afritada') || titleLower.includes('pastil') ||
    titleLower.includes('pininyahan') || titleLower.includes('binakol') || titleLower.includes('halang-halang');

  if (isChickenTitle) {
    let cut = 'Whole & Stew';
    if (titleLower.includes('wing') || titleLower.includes('wings') || titleLower.includes('lollipop')) {
      cut = 'Wings';
    } else if (titleLower.includes('breast') || titleLower.includes('fillet') || titleLower.includes('pastel') || titleLower.includes('salpicao') || titleLower.includes('nugget') || titleLower.includes('finger')) {
      cut = 'Breast';
    } else if (titleLower.includes('thigh') || titleLower.includes('leg') || titleLower.includes('drumstick') || titleLower.includes('inasal') || titleLower.includes('fried chicken') || titleLower.includes('bbq') || titleLower.includes('barbecue')) {
      cut = 'Thighs & Legs';
    } else {
      cut = 'Whole & Stew';
    }
    return { categoryId: 'cat_chicken', mainIngredient: 'Chicken', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 8. BEEF (Baka) - Title-level recognition
  // -------------------------------------------------------------
  const isBeefTitle =
    titleLower.includes('beef') || titleLower.includes('baka') || titleLower.includes('bulalo') ||
    titleLower.includes('bistek') || titleLower.includes('caldereta') || titleLower.includes('kaldereta') ||
    titleLower.includes('tapa') || titleLower.includes('morcon') || titleLower.includes('papaitan') ||
    titleLower.includes('kare-kare') || titleLower.includes('kare kare') || titleLower.includes('steak') ||
    titleLower.includes('pares') || titleLower.includes('kansi') || titleLower.includes('salpicao') ||
    titleLower.includes('callos') || titleLower.includes('corned beef');

  if (isBeefTitle) {
    let cut = 'Brisket & Ribs';
    if (titleLower.includes('shank') || titleLower.includes('bulalo') || titleLower.includes('kansi') || titleLower.includes('nilaga') || fullText.includes('beef shank')) {
      cut = 'Shank (Bulalo)';
    } else if (titleLower.includes('sirloin') || titleLower.includes('steak') || titleLower.includes('bistek') || titleLower.includes('flank') || titleLower.includes('tapa') || titleLower.includes('salpicao') || titleLower.includes('stir fry') || titleLower.includes('stir-fry')) {
      cut = 'Sirloin / Flank';
    } else if (titleLower.includes('oxtail') || titleLower.includes('tripe') || titleLower.includes('kare-kare') || titleLower.includes('kare kare') || titleLower.includes('papaitan') || titleLower.includes('callos')) {
      cut = 'Oxtail & Tripe';
    } else {
      cut = 'Brisket & Ribs';
    }
    return { categoryId: 'cat_beef', mainIngredient: 'Beef', cutOrType: cut };
  }

  // -------------------------------------------------------------
  // 9. INGREDIENT FALLBACKS
  // -------------------------------------------------------------
  if (ingText.includes('shrimp') || ingText.includes('hipon') || ingText.includes('tilapia') || ingText.includes('bangus') || ingText.includes('fish fillet')) {
    return { categoryId: 'cat_seafood', mainIngredient: 'Seafood', cutOrType: 'Milkfish (Bangus)' };
  }
  if (ingText.includes('pork belly') || ingText.includes('pork shoulder') || ingText.includes('ground pork') || ingText.includes('pork chop')) {
    let cut = 'Belly / Liempo';
    if (ingText.includes('pork chop')) cut = 'Pork Chops';
    else if (ingText.includes('ground pork')) cut = 'Ground (Giniling)';
    else if (ingText.includes('pork rib')) cut = 'Ribs';
    return { categoryId: 'cat_pork', mainIngredient: 'Pork', cutOrType: cut };
  }
  if (ingText.includes('chicken breast') || ingText.includes('chicken thigh') || ingText.includes('chicken wings') || ingText.includes('chicken')) {
    let cut = 'Whole & Stew';
    if (ingText.includes('chicken wings')) cut = 'Wings';
    else if (ingText.includes('chicken breast')) cut = 'Breast';
    else if (ingText.includes('chicken thigh')) cut = 'Thighs & Legs';
    return { categoryId: 'cat_chicken', mainIngredient: 'Chicken', cutOrType: cut };
  }
  if (ingText.includes('beef') || ingText.includes('beef shank') || ingText.includes('oxtail')) {
    return { categoryId: 'cat_beef', mainIngredient: 'Beef', cutOrType: 'Brisket & Ribs' };
  }

  // Final fallback is always vegetables
  let cut = 'Squash & Beans';
  if (titleLower.includes('ampalaya')) cut = 'Bitter Melon';
  else if (titleLower.includes('talong')) cut = 'Eggplant';
  else if (titleLower.includes('monggo')) cut = 'Legumes & Monggo';
  return { categoryId: 'cat_vegetables', mainIngredient: 'Vegetables', cutOrType: cut };
}

module.exports = {
  fetchPage,
  parseDuration,
  parseIngredient,
  classifyRecipe,
};
