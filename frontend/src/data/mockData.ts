import { Product, Category } from '../types';

export const fallbackCategories: Category[] = [
  {
    id: 1,
    name: 'Traditional Pickles (పచ్చళ్ళు)',
    slug: 'pickles',
    description: 'Authentic Andhra & Telangana homemade pickles made with cold-pressed sesame oil.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    product_count: 3
  },
  {
    id: 2,
    name: 'Stone-Ground Podis (పోడులు)',
    slug: 'spices-powders',
    description: 'Slow-roasted lentils and curry leaves stone-ground to retain natural aroma.',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    product_count: 1
  },
  {
    id: 3,
    name: 'Cold-Pressed Oils (గానుగ నూనె)',
    slug: 'cold-pressed-oils',
    description: 'Traditional wood-pressed (Marachekku) oils extracted at room temperature.',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    product_count: 1
  },
  {
    id: 4,
    name: 'Pure Desi Ghee & Forest Honey',
    slug: 'ghee-honey',
    description: 'Vedic A2 Gir cow bilona churned golden ghee and raw forest honey.',
    image_url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80',
    product_count: 2
  },
  {
    id: 5,
    name: 'Crunchy Snacks & Vadiyalu',
    slug: 'snacks',
    description: 'Handcrafted crunchy snacks prepared in fresh cold-pressed groundnut oil.',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    product_count: 1
  },
  {
    id: 6,
    name: 'Authentic Andhra Sweets',
    slug: 'sweets',
    description: 'Mouthwatering traditional sweets like Bellam Sunnundalu and Pootharekulu.',
    image_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    product_count: 2
  },
  {
    id: 7,
    name: 'Organic Millets & Heritage Grains',
    slug: 'millets-grains',
    description: 'Unpolished, gluten-free traditional millets and native heritage rice.',
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    product_count: 1
  },
  {
    id: 8,
    name: 'Curated Gift Hampers',
    slug: 'hampers',
    description: 'Festive and wellness gift boxes containing authentic ManaDeshi bestsellers.',
    image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    product_count: 1
  }
];

export const fallbackProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Traditional Pickles',
    name: 'Kothimera Karam (కొత్తిమీర కారం)',
    slug: 'kothimera-karam',
    tagline: 'Signature fresh farm coriander and spicy red chilli paste',
    short_description: 'An iconic Andhra delicacy made from hand-sorted fresh coriander leaves, fiery red chillies, garlic pods, and cold-pressed sesame oil.',
    description: 'ManaDeshi Dukaan’s signature Kothimera Karam is freshly prepared in small batches in Manikonda. We source fragrant local farm coriander, sun-dried Guntur chillies, and stone-grind them with tamarind pulp, roasted cumin, and whole garlic cloves. Stirred into hot steamed rice with a dollop of pure A2 desi cow ghee, it is heaven on a plate.',
    base_price: 150.00,
    compare_at_price: 180.00,
    is_featured: true,
    is_bestseller: true,
    is_organic_certified: true,
    shelf_life: '6 Months',
    storage_instructions: 'Store in cool dry place.',
    ingredients: 'Fresh Farm Coriander (45%), Guntur Red Chillies, Pure Cold-Pressed Sesame Oil, Cumin, Garlic, Rock Salt, Tamarind Pulp.',
    benefits: 'Rich in Vitamin C & K. Aids digestion and boosts immunity.',
    how_to_use: 'Mix with piping hot rice and a spoonful of ManaDeshi A2 Ghee.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 84,
    images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { id: 101, title: '250g', price: 150.00, compare_price: 180.00, stock_quantity: 85 },
      { id: 102, title: '500g', price: 290.00, compare_price: 350.00, stock_quantity: 60 },
      { id: 103, title: '1kg', price: 560.00, compare_price: 680.00, stock_quantity: 40 }
    ]
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Traditional Pickles',
    name: 'Traditional Andhra Avakaya (ఆవకాయ పచ్చడి)',
    slug: 'andhra-avakaya',
    tagline: 'King of Andhra pickles made with raw farm mangoes & wood-pressed sesame oil',
    short_description: 'Crisp hand-cut raw sour mango pieces infused with pungent mustard powder, red chilli, and pure cold-pressed sesame oil.',
    description: 'The golden jewel of Andhra home kitchens. Prepared strictly using traditional family heirloom recipes with sour farm mangoes cut with the inner kernel intact, stone-ground yellow mustard, Guntur chilli, and unrefined gingelly oil. Cured under natural Hyderabad sun.',
    base_price: 160.00,
    compare_at_price: 195.00,
    is_featured: true,
    is_bestseller: true,
    is_organic_certified: true,
    shelf_life: '12 Months',
    storage_instructions: 'Keep in glass jar.',
    ingredients: 'Sour Raw Mango chunks, Cold-Pressed Sesame Oil, Mustard, Guntur Red Chilli, Rock Salt, Garlic.',
    benefits: 'Aids digestive fire, rich in Vitamin C.',
    how_to_use: 'Best enjoyed with hot steamed rice, mudda pappu, and melted ghee.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 112,
    images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { id: 201, title: '250g', price: 160.00, compare_price: 195.00, stock_quantity: 90 },
      { id: 202, title: '500g', price: 310.00, compare_price: 380.00, stock_quantity: 75 },
      { id: 203, title: '1kg', price: 590.00, compare_price: 720.00, stock_quantity: 50 }
    ]
  },
  {
    id: 5,
    category_id: 4,
    category_name: 'Pure Desi Ghee & Honey',
    name: 'Vedic A2 Gir Cow Bilona Ghee (దేశీ ఆవు నెయ్యి)',
    slug: 'vedic-a2-gir-cow-bilona-ghee',
    tagline: 'Hand-churned from grass-fed Gir cow cultured curd in brass vessel',
    short_description: 'Golden granular aromatic ghee prepared using the ancient Vedic 5-step bilona method. 100% pure nectar for health.',
    description: 'Crafted from pure milk of free-grazing Indian indigenous Gir cows. Milk is boiled in clay pots, cultured into curd overnight, bi-directionally wooden-churned (Bilona) to separate makkhan (butter), and slow-clarified over mild cow dung & firewood. Rich nutty aroma and golden grains.',
    base_price: 799.00,
    compare_at_price: 950.00,
    is_featured: true,
    is_bestseller: true,
    is_organic_certified: true,
    shelf_life: '12 Months',
    storage_instructions: 'Store at room temperature.',
    ingredients: '100% Pure Cultured Cow Ghee from Free-Roaming A2 Gir Cows.',
    benefits: 'Contains healthy fat-soluble vitamins (A, D, E, K), boosts memory, strengthens joints.',
    how_to_use: 'Add a tablespoon to warm rice, rotis, or khichdi.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 98,
    images: ['https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { id: 501, title: '250ml', price: 450.00, compare_price: 520.00, stock_quantity: 50 },
      { id: 502, title: '500ml', price: 799.00, compare_price: 950.00, stock_quantity: 65 },
      { id: 503, title: '1 Litre', price: 1550.00, compare_price: 1850.00, stock_quantity: 40 }
    ]
  },
  {
    id: 7,
    category_id: 6,
    category_name: 'Authentic Andhra Sweets',
    name: 'Bellam Sunnundalu (బెల్లం సున్నుండలు)',
    slug: 'bellam-sunnundalu',
    tagline: 'Hand-rolled roasted urad dal & organic jaggery laddoos in pure cow ghee',
    short_description: 'Rich, melt-in-the-mouth traditional Andhra laddoos made with whole roasted black urad dal, organic jaggery, and aromatic ghee.',
    description: 'The ultimate nourishing sweet of Telugu households, prepared with slow roasted split black gram, organic crushed sugarcane jaggery, and pure country ghee. High in protein and iron, perfect snack for kids, mothers, and sweet lovers.',
    base_price: 260.00,
    compare_at_price: 310.00,
    is_featured: true,
    is_bestseller: true,
    is_organic_certified: true,
    shelf_life: '30 Days',
    storage_instructions: 'Keep in dry airtight container.',
    ingredients: 'Roasted Minapa Pappu (Urad Dal), Pure Country Ghee, Organic Bellam (Jaggery), Cardamom.',
    benefits: 'High protein and calcium. Builds bone strength.',
    how_to_use: 'Enjoy 1 laddoo every morning.',
    fssai_license: 'FSSAI Lic: 23621028000492',
    rating: 5.0,
    review_count: 88,
    images: ['https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { id: 701, title: '250g', price: 260.00, compare_price: 310.00, stock_quantity: 40 },
      { id: 702, title: '500g', price: 490.00, compare_price: 590.00, stock_quantity: 35 },
      { id: 703, title: '1kg', price: 950.00, compare_price: 1150.00, stock_quantity: 20 }
    ]
  }
];
