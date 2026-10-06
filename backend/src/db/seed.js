import { query, isPgActive, mockDbStore } from '../config/db.js';

export const categoriesSeed = [
  {
    id: 1,
    name: 'Traditional Pickles (పచ్చళ్ళు)',
    slug: 'pickles',
    description: 'Authentic Andhra & Telangana homemade pickles made with cold-pressed sesame oil, stone-ground spices, and sun-cured love. No artificial preservatives.',
    icon: 'Jar',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    display_order: 1
  },
  {
    id: 2,
    name: 'Stone-Ground Powders & Podis (పోడులు)',
    slug: 'spices-powders',
    description: 'Slow-roasted lentils, curry leaves, and heritage spices stone-ground to retain natural aroma and essential digestive oils.',
    icon: 'Flame',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    display_order: 2
  },
  {
    id: 3,
    name: 'Cold-Pressed Oils (గానుగ నూనె)',
    slug: 'cold-pressed-oils',
    description: 'Traditional wood-pressed (Marachekku / Gaana) oils extracted at room temperature to preserve natural vitamins, rich taste, and unrefined nutrients.',
    icon: 'Droplet',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    display_order: 3
  },
  {
    id: 4,
    name: 'Pure Desi Ghee & Forest Honey',
    slug: 'ghee-honey',
    description: 'Vedic A2 Gir cow bilona churned golden ghee and raw, unfiltered wild forest honey harvested from eastern ghats.',
    icon: 'Sparkles',
    image_url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
    display_order: 4
  },
  {
    id: 5,
    name: 'Traditional Snacks & Vadiyalu (పిండి వంటలు)',
    slug: 'snacks',
    description: 'Handcrafted crunchy snacks prepared in fresh cold-pressed groundnut oil. No palm oil, zero trans-fat.',
    icon: 'Cookie',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    display_order: 5
  },
  {
    id: 6,
    name: 'Authentic Andhra Sweets (మిఠాయి)',
    slug: 'sweets',
    description: 'Mouthwatering traditional sweets like Bellam Sunnundalu and Pootharekulu made with pure ghee and chemical-free organic jaggery.',
    icon: 'Gift',
    image_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    display_order: 6
  },
  {
    id: 7,
    name: 'Organic Millets & Heritage Grains (సిరిధాన్యాలు)',
    slug: 'millets-grains',
    description: 'Unpolished, gluten-free traditional millets and native heritage rice rich in dietary fibre, iron, and minerals.',
    icon: 'Wheat',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    display_order: 7
  },
  {
    id: 8,
    name: 'Curated Gift Hampers & Combos',
    slug: 'hampers',
    description: 'Festive and wellness gift boxes containing authentic ManaDeshi bestsellers, handpicked and packed in eco-friendly hampers.',
    icon: 'Package',
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    display_order: 8
  }
];

export const productsSeed = [
  // 1. Kothimera Karam
  {
    id: 1,
    category_id: 1,
    name: 'Kothimera Karam (కొత్తిమీర కారం)',
    slug: 'kothimera-karam',
    tagline: 'Signature fresh farm coriander and spicy red chilli paste',
    short_description: 'An iconic Andhra delicacy made from hand-sorted fresh coriander leaves, fiery red chillies, garlic pods, and cold-pressed sesame oil.',
    description: 'ManaDeshi Dukaan’s signature Kothimera Karam is freshly prepared in small batches in Manikonda. We source fragrant local farm coriander, sun-dried Guntur chillies, and stone-grind them with tamarind pulp, roasted cumin, and whole garlic cloves. Stirred into hot steamed rice with a dollop of pure A2 desi cow ghee, it is heaven on a plate.',
    base_price: 150.00,
    compare_at_price: 180.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '6 Months from manufacture date',
    storage_instructions: 'Store in a cool dry place. Use a clean dry spoon. Keep refrigerated after opening for extended freshness.',
    ingredients: 'Fresh Farm Coriander (45%), Guntur Red Chillies, Pure Cold-Pressed Sesame Oil, Roasted Cumin, Garlic, Rock Salt, Tamarind Pulp, Mustard Seeds, Fenugreek.',
    benefits: 'Coriander is naturally rich in Vitamin C, K and antioxidants. Aids digestion, relieves bloating, and boosts metabolic immunity.',
    how_to_use: 'Mix 1-2 teaspoons with piping hot steamed rice and a spoonful of ManaDeshi A2 Ghee. Also pairs wonderfully with Idli, Dosa, Upma, or Curd Rice.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 84,
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 101, title: '250g', weight_value: 250, weight_unit: 'g', price: 150.00, compare_price: 180.00, stock_quantity: 85 },
      { id: 102, title: '500g', weight_value: 500, weight_unit: 'g', price: 290.00, compare_price: 350.00, stock_quantity: 60 },
      { id: 103, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 560.00, compare_price: 680.00, stock_quantity: 40 }
    ]
  },
  // 2. Andhra Avakaya
  {
    id: 2,
    category_id: 1,
    name: 'Traditional Andhra Avakaya (ఆవకాయ పచ్చడి)',
    slug: 'andhra-avakaya',
    tagline: 'King of Andhra pickles made with raw farm mangoes & wood-pressed sesame oil',
    short_description: 'Crisp hand-cut raw sour mango pieces infused with pungent mustard powder, red chilli, and pure cold-pressed sesame oil.',
    description: 'The golden jewel of Andhra home kitchens. Prepared strictly using traditional family heirloom recipes with sour farm mangoes cut with the inner kernel intact, stone-ground yellow mustard, Guntur chilli, and unrefined gingelly oil. Cured under natural Hyderabad sun.',
    base_price: 160.00,
    compare_at_price: 195.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '12 Months',
    storage_instructions: 'Keep in glass or ceramic jar. Ensure oil layer covers the pickle top. Do not touch with wet hands.',
    ingredients: 'Sour Raw Mango chunks with kernel, Cold-Pressed Sesame Oil, Stone-ground Mustard, Guntur Red Chilli Powder, Rock Salt, Fenugreek Powder, Garlic Pods.',
    benefits: 'Aids digestive fire (Agni), rich in digestive enzymes and Vitamin C, enhances gut flora.',
    how_to_use: 'Best enjoyed with hot steamed rice, mudda pappu (boiled toor dal), and fresh melted desi ghee.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 112,
    images: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 201, title: '250g', weight_value: 250, weight_unit: 'g', price: 160.00, compare_price: 195.00, stock_quantity: 90 },
      { id: 202, title: '500g', weight_value: 500, weight_unit: 'g', price: 310.00, compare_price: 380.00, stock_quantity: 75 },
      { id: 203, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 590.00, compare_price: 720.00, stock_quantity: 50 }
    ]
  },
  // 3. Gongura Pachadi
  {
    id: 3,
    category_id: 1,
    name: 'Guntur Gongura Pachadi (గోంగూర పచ్చడి)',
    slug: 'guntur-gongura-pachadi',
    tagline: 'Tangy red sorrel leaves cooked with garlic and wood-pressed oil',
    short_description: 'Authentic fiery sour sorrel leaves chutney, Andhra’s pride, slow-cooked in cold-pressed oil with roasted spices.',
    description: 'Made from farm-fresh red-stem Gongura leaves known for their distinct tangy flavor. Slow simmered with whole garlic, roasted coriander seeds, fenugreek, and tempered in traditional wood-pressed gingelly oil.',
    base_price: 155.00,
    compare_at_price: 185.00,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '6 Months',
    storage_instructions: 'Keep in airtight glass jar. Refrigerate once opened.',
    ingredients: 'Fresh Red Stem Gongura Leaves, Pure Gingelly Oil, Guntur Chillies, Garlic, Coriander Seeds, Cumin, Mustard, Rock Salt, Turmeric.',
    benefits: 'Abundant in natural iron, calcium, and zinc. Fights anaemia and energizes sluggish digestion.',
    how_to_use: 'Serve with warm rice, ghee, raw sliced red onions, or alongside biryani and rotis.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 4.9,
    review_count: 67,
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 301, title: '250g', weight_value: 250, weight_unit: 'g', price: 155.00, compare_price: 185.00, stock_quantity: 70 },
      { id: 302, title: '500g', weight_value: 500, weight_unit: 'g', price: 299.00, compare_price: 360.00, stock_quantity: 45 },
      { id: 303, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 580.00, compare_price: 700.00, stock_quantity: 30 }
    ]
  },
  // 4. Karivepaku Podi
  {
    id: 4,
    category_id: 2,
    name: 'Karivepaku Podi / Curry Leaf Powder (కరివేపాకు పొడి)',
    slug: 'karivepaku-podi',
    tagline: 'Digestive medicinal spice powder roasted with lentils & garlic',
    short_description: 'Nutritious curry leaf podi prepared from crisp shade-dried curry leaves, roasted dals, cumin, and whole pepper.',
    description: 'Curry leaves are revered in Ayurveda for lustrous hair, eyesight, and gut health. We slow roast fresh organic curry leaves with urad dal, chana dal, black pepper, and whole garlic to make a savory, fragrant seasoning powder.',
    base_price: 140.00,
    compare_at_price: 170.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '6 Months',
    storage_instructions: 'Store in dry airtight container away from moisture.',
    ingredients: 'Fresh Curry Leaves, Roasted Chana Dal, Urad Dal, Dry Red Chillies, Cumin Seeds, Whole Garlic, Black Peppercorns, Rock Salt, Hing.',
    benefits: 'High in Iron, Vitamin A & E. Known to arrest hair fall, improve gut microbiome and lower blood sugar.',
    how_to_use: 'Sprinkle on hot idlis, dosas with ghee or mix directly into hot rice as the first comforting morsel.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 53,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 401, title: '250g', weight_value: 250, weight_unit: 'g', price: 140.00, compare_price: 170.00, stock_quantity: 80 },
      { id: 402, title: '500g', weight_value: 500, weight_unit: 'g', price: 270.00, compare_price: 330.00, stock_quantity: 50 },
      { id: 403, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 520.00, compare_price: 620.00, stock_quantity: 35 }
    ]
  },
  // 5. Vedic A2 Gir Cow Bilona Cultured Ghee
  {
    id: 5,
    category_id: 4,
    name: 'Vedic A2 Gir Cow Bilona Ghee (దేశీ ఆవు నెయ్యి)',
    slug: 'vedic-a2-gir-cow-bilona-ghee',
    tagline: 'Hand-churned from grass-fed Gir cow cultured curd in brass vessel',
    short_description: 'Golden granular aromatic ghee prepared using the ancient Vedic 5-step bilona method. 100% pure nectar for health.',
    description: 'Crafted from pure milk of free-grazing Indian indigenous Gir cows. Milk is boiled in clay pots, cultured into curd overnight, bi-directionally wooden-churned (Bilona) to separate makkhan (butter), and slow-clarified over mild cow dung & firewood. Rich nutty aroma and golden grains.',
    base_price: 799.00,
    compare_at_price: 950.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '12 Months',
    storage_instructions: 'Store at room temperature in the original glass jar. Do not refrigerate.',
    ingredients: '100% Pure Cultured Cow Ghee from Free-Roaming A2 Gir Cows.',
    benefits: 'Contains healthy fat-soluble vitamins (A, D, E, K), boosts memory (Medhya), strengthens joints, and contains butyric acid for a healthy gut.',
    how_to_use: 'Add a tablespoon to warm rice, rotis, khichdi, or consume 1 teaspoon empty stomach in morning with warm water.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 98,
    images: [
      'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 501, title: '250ml', weight_value: 250, weight_unit: 'ml', price: 450.00, compare_price: 520.00, stock_quantity: 50 },
      { id: 502, title: '500ml', weight_value: 500, weight_unit: 'ml', price: 799.00, compare_price: 950.00, stock_quantity: 65 },
      { id: 503, title: '1 Litre', weight_value: 1000, weight_unit: 'ml', price: 1550.00, compare_price: 1850.00, stock_quantity: 40 }
    ]
  },
  // 6. Wood-Pressed Groundnut Oil
  {
    id: 6,
    category_id: 3,
    name: 'Wood-Pressed Groundnut Oil (గానుగ వేరుశెనగ నూనె)',
    slug: 'wood-pressed-groundnut-oil',
    tagline: 'Cold extracted in traditional wooden marachekku churner',
    short_description: 'Unrefined, unbleached, sulphur-free peanut oil with rich nutty aroma and high smoke point for daily healthy cooking.',
    description: 'Pressed from sun-dried native groundnuts on a slow rotating wooden pestle (Marachekku) at temperatures below 40°C. Sediments are settled naturally in sunlight without chemicals or artificial filters.',
    base_price: 240.00,
    compare_at_price: 280.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '9 Months',
    storage_instructions: 'Store in cool dark spot away from direct heat.',
    ingredients: '100% Pure Native Groundnut Seeds (Sulphur-free).',
    benefits: 'Zero cholesterol, zero trans fat. High in natural Vitamin E, plant sterols and monounsaturated fatty acids (MUFA).',
    how_to_use: 'Perfect for deep frying, sautéing curries, tempering dals, and traditional snacks.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 4.9,
    review_count: 76,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 601, title: '500ml', weight_value: 500, weight_unit: 'ml', price: 130.00, compare_price: 150.00, stock_quantity: 80 },
      { id: 602, title: '1 Litre', weight_value: 1000, weight_unit: 'ml', price: 240.00, compare_price: 280.00, stock_quantity: 120 },
      { id: 603, title: '5 Litres', weight_value: 5000, weight_unit: 'ml', price: 1150.00, compare_price: 1350.00, stock_quantity: 30 }
    ]
  },
  // 7. Bellam Sunnundalu
  {
    id: 7,
    category_id: 6,
    name: 'Bellam Sunnundalu (బెల్లం సున్నుండలు)',
    slug: 'bellam-sunnundalu',
    tagline: 'Hand-rolled roasted urad dal & organic jaggery laddoos in pure cow ghee',
    short_description: 'Rich, melt-in-the-mouth traditional Andhra laddoos made with whole roasted black urad dal, organic jaggery, and aromatic ghee.',
    description: 'The ultimate nourishing sweet of Telugu households, prepared with slow roasted split black gram, organic crushed sugarcane jaggery, and pure country ghee. High in protein and iron, perfect snack for kids, mothers, and sweet lovers.',
    base_price: 260.00,
    compare_at_price: 310.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '30 Days',
    storage_instructions: 'Keep in dry airtight container. Do not refrigerate.',
    ingredients: 'Roasted Minapa Pappu (Urad Dal), Pure Country Ghee, Organic Bellam (Jaggery), Cardamom Powder.',
    benefits: 'High protein, calcium and mineral content. Builds bone strength and gives sustained energy.',
    how_to_use: 'Enjoy 1 laddoo every morning with a glass of milk or as an after-school healthy snack.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 88,
    images: [
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 701, title: '250g (approx 6-7 pcs)', weight_value: 250, weight_unit: 'g', price: 260.00, compare_price: 310.00, stock_quantity: 40 },
      { id: 702, title: '500g (approx 12-14 pcs)', weight_value: 500, weight_unit: 'g', price: 490.00, compare_price: 590.00, stock_quantity: 35 },
      { id: 703, title: '1kg (approx 25 pcs)', weight_value: 1000, weight_unit: 'g', price: 950.00, compare_price: 1150.00, stock_quantity: 20 }
    ]
  },
  // 8. Raw Wild Forest Honey
  {
    id: 8,
    category_id: 4,
    name: 'Raw Wild Forest Honey (అడవి తేనె)',
    slug: 'raw-wild-forest-honey',
    tagline: '100% Unprocessed, unpasteurized honey from Eastern Ghats hives',
    short_description: 'Pure, dark amber wild rock bee honey collected sustainably by tribal honey gatherers from medicinal forest flowers.',
    description: 'Unheated, unfiltered wild rock bee honey straight from deep forest nectar. Unlike commercial sugar-syrup adulterated honeys, ManaDeshi forest honey retains its live enzymes, pollen, propolis, and deep floral notes.',
    base_price: 320.00,
    compare_at_price: 390.00,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '18 Months',
    storage_instructions: 'Keep tightly closed at room temperature. Natural crystallization is proof of purity.',
    ingredients: '100% Raw Wild Forest Multi-Flora Honey.',
    benefits: 'Natural immunity booster, soothes sore throats, rich in anti-bacterial propolis and antioxidants.',
    how_to_use: 'Take 1 spoon with lukewarm water and lemon on an empty stomach or drizzle over cut fruits and pancakes.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 4.9,
    review_count: 42,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 801, title: '250g', weight_value: 250, weight_unit: 'g', price: 180.00, compare_price: 220.00, stock_quantity: 50 },
      { id: 802, title: '500g', weight_value: 500, weight_unit: 'g', price: 320.00, compare_price: 390.00, stock_quantity: 45 },
      { id: 803, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 600.00, compare_price: 750.00, stock_quantity: 30 }
    ]
  },
  // 9. Foxtail Millet (Korra)
  {
    id: 9,
    category_id: 7,
    name: 'Organic Foxtail Millet (కొర్రలు - Unpolished)',
    slug: 'organic-foxtail-millet-korra',
    tagline: 'Nutrient-rich ancient grain high in fibre and low glycemic index',
    short_description: 'Unpolished native Foxtail Millet (Korra), organically grown without chemical fertilizers. Ideal replacement for white rice.',
    description: 'Foxtail millet is one of the five sacred positive millets (Siridhanyalu). Slowly cleaned and dehusked to retain the nutrient-packed bran layer. Helps manage diabetic sugar spikes and keeps you feeling full longer.',
    base_price: 110.00,
    compare_at_price: 135.00,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    is_organic_certified: true,
    shelf_life: '12 Months',
    storage_instructions: 'Store in dry airtight container.',
    ingredients: '100% Unpolished Organic Foxtail Millet (Setaria italica).',
    benefits: 'Low glycemic index (GI), gluten-free, rich in iron, calcium, and dietary fibre. Excellent for diabetes management.',
    how_to_use: 'Soak for 2-3 hours before cooking. Cook like rice (1:2.5 water ratio) or make millet khichdi, pongal, or upma.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 4.8,
    review_count: 31,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 901, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 110.00, compare_price: 135.00, stock_quantity: 100 },
      { id: 902, title: '2kg Pack', weight_value: 2000, weight_unit: 'g', price: 210.00, compare_price: 260.00, stock_quantity: 60 },
      { id: 903, title: '5kg Family Pack', weight_value: 5000, weight_unit: 'g', price: 500.00, compare_price: 620.00, stock_quantity: 40 }
    ]
  },
  // 10. Handcrafted Murukku / Chakralu
  {
    id: 10,
    category_id: 5,
    name: 'Butter Murukku / Chakralu (వెన్న జంతికలు)',
    slug: 'butter-murukku-chakralu',
    tagline: 'Melt-in-mouth crunchy traditional spirals fried in wood-pressed oil',
    short_description: 'Classic savoury spirals seasoned with cumin, sesame, and fresh butter, fried in wood-pressed groundnut oil.',
    description: 'Crispy, crunchy, and non-greasy. Made from finely ground rice flour, roasted gram flour, carom seeds (vaamu), and pure butter. Fried in cold-pressed oil with zero palm oil or artificial colors.',
    base_price: 130.00,
    compare_at_price: 160.00,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    is_organic_certified: true,
    shelf_life: '45 Days',
    storage_instructions: 'Keep in airtight tin to retain crispiness.',
    ingredients: 'Rice Flour, Roasted Gram, White Butter, Cumin, Carom Seeds (Ajwain), Cold-Pressed Peanut Oil, Rock Salt.',
    benefits: 'Zero palm oil, zero preservatives. A healthier wholesome tea-time crunch.',
    how_to_use: 'Serve during tea-time, festive occasions, or pack for school & office snacks.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 4.9,
    review_count: 57,
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 1001, title: '250g', weight_value: 250, weight_unit: 'g', price: 130.00, compare_price: 160.00, stock_quantity: 50 },
      { id: 1002, title: '500g', weight_value: 500, weight_unit: 'g', price: 250.00, compare_price: 300.00, stock_quantity: 40 },
      { id: 1003, title: '1kg', weight_value: 1000, weight_unit: 'g', price: 480.00, compare_price: 580.00, stock_quantity: 25 }
    ]
  },
  // 11. ManaDeshi Royal Heritage Hamper
  {
    id: 11,
    category_id: 8,
    name: 'ManaDeshi Royal Heritage Gift Box (రాయల్ కానుక పెట్టె)',
    slug: 'manadeshi-royal-heritage-box',
    tagline: 'Deluxe curation of A2 Ghee, Avakaya, Kothimera Karam & Sunnundalu',
    short_description: 'A grand festive hamper containing our finest authentic bestsellers packed in a heritage keepsake gift box.',
    description: 'The quintessential taste of Andhra tradition in one magnificent hamper. Includes: 1x Vedic A2 Gir Cow Ghee (500ml), 1x Signature Kothimera Karam (250g), 1x Royal Avakaya (250g), 1x Bellam Sunnundalu (500g), and 1x Raw Forest Honey (250g). Adorned with traditional festive jute wrapping and personalized gift card.',
    base_price: 1850.00,
    compare_at_price: 2200.00,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: true,
    is_organic_certified: true,
    shelf_life: '6 Months',
    storage_instructions: 'Individual packaging instructions apply for each product inside.',
    ingredients: 'Combination of A2 Ghee, Avakaya, Kothimera Karam, Bellam Sunnundalu & Wild Forest Honey.',
    benefits: 'The ultimate gift of pure health, nostalgia, and authentic homemade taste.',
    how_to_use: 'Perfect for Housewarmings, Diwali, Sankranti, Ugadi, Corporate Gifting, or Family Festivities.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 29,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 1101, title: 'Standard Gift Box', weight_value: 1800, weight_unit: 'g', price: 1850.00, compare_price: 2200.00, stock_quantity: 20 },
      { id: 1102, title: 'Deluxe Teak Wooden Keepsake Box', weight_value: 2200, weight_unit: 'g', price: 2350.00, compare_price: 2750.00, stock_quantity: 15 }
    ]
  },
  // 12. Atreyapuram Bellam Dry Fruit Pootharekulu
  {
    id: 12,
    category_id: 6,
    name: 'Atreyapuram Bellam Pootharekulu (ఆత్రేయపురం పూతరేకులు)',
    slug: 'atreyapuram-bellam-pootharekulu',
    tagline: 'World-famous paper sweet filled with organic jaggery, ghee & roasted nuts',
    short_description: 'Wafer-thin rice starch edible paper rolled with crushed dry fruits, pure cow ghee, and organic jaggery from Godavari.',
    description: 'Handmade by women artisans of Atreyapuram village in Andhra Pradesh. Fragile layers of rice paper made on inverted clay pots, layered with freshly ground organic jaggery, pure cow ghee, roasted cashews, almonds, and pistachios.',
    base_price: 320.00,
    compare_at_price: 380.00,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    is_organic_certified: true,
    shelf_life: '20 Days',
    storage_instructions: 'Keep in airtight container away from heat. Do not crush.',
    ingredients: 'Rice Starch Paper, Organic Bellam (Jaggery), Desi Cow Ghee, Roasted Almonds, Cashews, Pistachios, Cardamom.',
    benefits: 'GI tagged delicacy, high in wholesome calories, pure jaggery iron, and dry fruit goodness.',
    how_to_use: 'Enjoy fresh, gently biting into the crispy melt-in-mouth sweet layers.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 48,
    images: [
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 1201, title: 'Pack of 5 Pcs', weight_value: 200, weight_unit: 'g', price: 180.00, compare_price: 210.00, stock_quantity: 35 },
      { id: 1202, title: 'Box of 10 Pcs', weight_value: 400, weight_unit: 'g', price: 320.00, compare_price: 380.00, stock_quantity: 30 }
    ]
  }
];

export const deliveryPincodesSeed = [
  { pincode: '500089', area_name: 'Manikonda / Puppalguda / Alkapur Township (Local Store Area)', zone: 'Hyderabad Express', delivery_time_estimate: '1-2 Hours (Immediate Store Delivery)', delivery_fee: 0.00, free_delivery_above: 299.00 },
  { pincode: '500032', area_name: 'Gachibowli / Financial District / Nanakramguda', zone: 'Hyderabad Express', delivery_time_estimate: '2-3 Hours', delivery_fee: 30.00, free_delivery_above: 499.00 },
  { pincode: '500084', area_name: 'Kondapur / Kothaguda / Whitefields', zone: 'Hyderabad Express', delivery_time_estimate: '2-4 Hours', delivery_fee: 30.00, free_delivery_above: 499.00 },
  { pincode: '500081', area_name: 'Madhapur / Hitec City / Durgam Cheruvu', zone: 'Hyderabad Express', delivery_time_estimate: '2-4 Hours', delivery_fee: 30.00, free_delivery_above: 499.00 },
  { pincode: '500033', area_name: 'Jubilee Hills / Road No 36 / Film Nagar', zone: 'Hyderabad Express', delivery_time_estimate: '2-4 Hours', delivery_fee: 40.00, free_delivery_above: 499.00 },
  { pincode: '500034', area_name: 'Banjara Hills / Somajiguda', zone: 'Hyderabad Express', delivery_time_estimate: '2-4 Hours', delivery_fee: 40.00, free_delivery_above: 499.00 },
  { pincode: '500072', area_name: 'Kukatpally / KPHB Colony', zone: 'Hyderabad Standard', delivery_time_estimate: 'Same Day (4-6 Hours)', delivery_fee: 45.00, free_delivery_above: 599.00 },
  { pincode: '500008', area_name: 'Mehdipatnam / Tolichowki', zone: 'Hyderabad Standard', delivery_time_estimate: 'Same Day (3-5 Hours)', delivery_fee: 35.00, free_delivery_above: 499.00 },
  { pincode: '500001', area_name: 'Abids / Koti / Central Hyderabad', zone: 'Hyderabad Standard', delivery_time_estimate: 'Same Day Evening', delivery_fee: 50.00, free_delivery_above: 699.00 },
  { pincode: '500016', area_name: 'Begumpet / Ameerpet', zone: 'Hyderabad Standard', delivery_time_estimate: 'Same Day (4-6 Hours)', delivery_fee: 45.00, free_delivery_above: 599.00 }
];

export const couponsSeed = [
  { code: 'MANADESHI10', description: '10% OFF on all organic orders above ₹499', discount_type: 'percentage', discount_value: 10.00, min_order_amount: 499.00, max_discount_amount: 250.00 },
  { code: 'SWATHI50', description: 'Flat ₹50 OFF for authentic traditional foods', discount_type: 'fixed', discount_value: 50.00, min_order_amount: 399.00, max_discount_amount: 50.00 },
  { code: 'FIRSTORDER', description: 'Welcome treat! 15% OFF your first ManaDeshi order', discount_type: 'percentage', discount_value: 15.00, min_order_amount: 350.00, max_discount_amount: 300.00 },
  { code: 'HYDEXPRESS', description: 'Free local delivery across Hyderabad on orders above ₹400', discount_type: 'fixed', discount_value: 40.00, min_order_amount: 400.00, max_discount_amount: 40.00 }
];

export const initialOrdersSeed = [
  {
    id: 1,
    order_number: 'MD-89241',
    customer_name: 'Ravi Teja',
    customer_phone: '+91 98490 12345',
    customer_email: 'ravi.teja@gmail.com',
    delivery_address: {
      flat_house: 'Villa 42, Palm Meadows',
      street_area: 'Manikonda near Secretariat Colony',
      landmark: 'Near Harivillu Apartments',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500089'
    },
    delivery_zone: 'Hyderabad Express (Manikonda Local)',
    subtotal: 1240.00,
    discount_amount: 100.00,
    delivery_fee: 0.00,
    total_amount: 1140.00,
    coupon_code: 'MANADESHI10',
    payment_method: 'UPI',
    payment_status: 'Paid',
    order_status: 'Confirmed',
    special_instructions: 'Please pack in glass bottles securely.',
    whatsapp_order_sent: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      { product_name: 'Kothimera Karam (కొత్తిమీర కారం)', variant_title: '500g', price: 290.00, quantity: 1, subtotal: 290.00 },
      { product_name: 'Vedic A2 Gir Cow Bilona Ghee (దేశీ ఆవు నెయ్యి)', variant_title: '500ml', price: 799.00, quantity: 1, subtotal: 799.00 },
      { product_name: 'Butter Murukku / Chakralu', variant_title: '250g', price: 130.00, quantity: 1, subtotal: 130.00 }
    ]
  },
  {
    id: 2,
    order_number: 'MD-89240',
    customer_name: 'Srilatha Reddy',
    customer_phone: '+91 97011 88990',
    customer_email: 'srilatha.r@yahoo.com',
    delivery_address: {
      flat_house: 'Flat 502, Aparna Sarovar Zenith',
      street_area: 'Nallagandla / Gachibowli',
      landmark: 'Near Citizen Hospital',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032'
    },
    delivery_zone: 'Hyderabad Express',
    subtotal: 850.00,
    discount_amount: 50.00,
    delivery_fee: 0.00,
    total_amount: 800.00,
    coupon_code: 'SWATHI50',
    payment_method: 'COD',
    payment_status: 'Pending',
    order_status: 'Shipped',
    special_instructions: 'Deliver before 5 PM please.',
    whatsapp_order_sent: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      { product_name: 'Traditional Andhra Avakaya (ఆవకాయ పచ్చడి)', variant_title: '500g', price: 310.00, quantity: 1, subtotal: 310.00 },
      { product_name: 'Bellam Sunnundalu (బెల్లం సున్నుండలు)', variant_title: '500g', price: 490.00, quantity: 1, subtotal: 490.00 }
    ]
  },
  {
    id: 3,
    order_number: 'MD-89239',
    customer_name: 'Venkatesh Murthy',
    customer_phone: '+91 94401 56789',
    customer_email: 'vmurthy@gmail.com',
    delivery_address: {
      flat_house: 'Plot 18, Road No. 12',
      street_area: 'Banjara Hills',
      landmark: 'Near MLA Colony',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034'
    },
    delivery_zone: 'Hyderabad Express',
    subtotal: 1850.00,
    discount_amount: 150.00,
    delivery_fee: 0.00,
    total_amount: 1700.00,
    coupon_code: 'MANADESHI10',
    payment_method: 'Razorpay',
    payment_status: 'Paid',
    order_status: 'Delivered',
    special_instructions: 'Gift pack requested.',
    whatsapp_order_sent: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      { product_name: 'ManaDeshi Royal Heritage Gift Box (రాయల్ కానుక పెట్టె)', variant_title: 'Standard Gift Box', price: 1850.00, quantity: 1, subtotal: 1850.00 }
    ]
  }
];

// Seed function
export async function seedDatabase() {
  console.log('🌱 Starting ManaDeshi Dukaan seed data population...');

  // Always populate mockDbStore so fallback is ready
  mockDbStore.categories = [...categoriesSeed];
  mockDbStore.products = [...productsSeed];
  mockDbStore.delivery_pincodes = [...deliveryPincodesSeed];
  mockDbStore.coupons = [...couponsSeed];
  mockDbStore.orders = [...initialOrdersSeed];

  if (!isPgActive()) {
    console.log('✅ In-memory mock store successfully seeded with', productsSeed.length, 'products,', categoriesSeed.length, 'categories, and', deliveryPincodesSeed.length, 'pincodes.');
    return;
  }

  try {
    // 1. Seed Categories
    for (const cat of categoriesSeed) {
      await query(
        `INSERT INTO categories (id, name, slug, description, icon, image_url, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           description = EXCLUDED.description,
           icon = EXCLUDED.icon,
           image_url = EXCLUDED.image_url,
           display_order = EXCLUDED.display_order`,
        [cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.image_url, cat.display_order]
      );
    }

    // 2. Seed Products & Variants
    for (const p of productsSeed) {
      await query(
        `INSERT INTO products (
           id, category_id, name, slug, tagline, short_description, description,
           base_price, compare_at_price, is_featured, is_bestseller, is_new_arrival,
           is_organic_certified, shelf_life, storage_instructions, ingredients,
           benefits, how_to_use, fssai_license, rating, review_count
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
         ) ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           base_price = EXCLUDED.base_price,
           description = EXCLUDED.description,
           rating = EXCLUDED.rating`,
        [
          p.id, p.category_id, p.name, p.slug, p.tagline, p.short_description, p.description,
          p.base_price, p.compare_at_price, p.is_featured, p.is_bestseller, p.is_new_arrival,
          p.is_organic_certified, p.shelf_life, p.storage_instructions, p.ingredients,
          p.benefits, p.how_to_use, p.fssai_license, p.rating, p.review_count
        ]
      );

      // Seed Variants
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          await query(
            `INSERT INTO product_variants (id, product_id, title, weight_value, weight_unit, price, compare_price, stock_quantity)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO UPDATE SET
               price = EXCLUDED.price,
               compare_price = EXCLUDED.compare_price,
               stock_quantity = EXCLUDED.stock_quantity`,
            [v.id, p.id, v.title, v.weight_value, v.weight_unit, v.price, v.compare_price, v.stock_quantity]
          );
        }
      }

      // Seed Images
      if (p.images && p.images.length > 0) {
        for (let i = 0; i < p.images.length; i++) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING`,
            [p.id, p.images[i], i === 0, i]
          );
        }
      }
    }

    // 3. Seed Pincodes
    for (const pin of deliveryPincodesSeed) {
      await query(
        `INSERT INTO delivery_pincodes (pincode, area_name, zone, delivery_time_estimate, delivery_fee, free_delivery_above)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (pincode) DO UPDATE SET
           area_name = EXCLUDED.area_name,
           zone = EXCLUDED.zone,
           delivery_time_estimate = EXCLUDED.delivery_time_estimate,
           delivery_fee = EXCLUDED.delivery_fee,
           free_delivery_above = EXCLUDED.free_delivery_above`,
        [pin.pincode, pin.area_name, pin.zone, pin.delivery_time_estimate, pin.delivery_fee, pin.free_delivery_above]
      );
    }

    // 4. Seed Coupons
    for (const c of couponsSeed) {
      await query(
        `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (code) DO NOTHING`,
        [c.code, c.description, c.discount_type, c.discount_value, c.min_order_amount, c.max_discount_amount]
      );
    }

    console.log('✅ PostgreSQL database seeded successfully with complete catalog!');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

export default { seedDatabase };
