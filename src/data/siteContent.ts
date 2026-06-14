/** Single masala / podi photo — used for Podi category, podi products & spice sections */
export const PODI_MASALA_IMAGE =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop';

/** Verified working masala / food placeholder photos (Unsplash) */
export const MASALA_IMAGES = {
  spices: PODI_MASALA_IMAGE,
  spicesPowder: PODI_MASALA_IMAGE,
  pickle: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
  porridge: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800&auto=format&fit=crop',
  grains: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  instant: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
  vathal: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
  curry: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop',
  herbs: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  rice: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800&auto=format&fit=crop',
} as const;

export const CATEGORY_IMAGES = {
  podi: PODI_MASALA_IMAGE,
  pickle: MASALA_IMAGES.pickle,
  porridge: MASALA_IMAGES.porridge,
  instant: MASALA_IMAGES.instant,
  vathal: MASALA_IMAGES.vathal,
} as const;

export const SITE_IMAGES = {
  hero: PODI_MASALA_IMAGE,
  howItWorks: PODI_MASALA_IMAGE,
  aboutMain: PODI_MASALA_IMAGE,
  aboutSecondary: MASALA_IMAGES.pickle,
} as const;

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'Podi Varieties': CATEGORY_IMAGES.podi,
  'Pickle Varieties': CATEGORY_IMAGES.pickle,
  'Porridge Mix': CATEGORY_IMAGES.porridge,
  'Instant Mix': CATEGORY_IMAGES.instant,
  'Vathal Varieties': CATEGORY_IMAGES.vathal,
};

export function categoryImageFor(name: string): string {
  return CATEGORY_IMAGE_MAP[name] ?? MASALA_IMAGES.spices;
}

export const SHOP_CATEGORIES = [
  {
    name: 'Podi Varieties',
    image: CATEGORY_IMAGES.podi,
    desc: 'Stone-ground podis — idli milagai, sambar, rasam & paruppu podi from traditional recipes.',
  },
  {
    name: 'Pickle Varieties',
    image: CATEGORY_IMAGES.pickle,
    desc: 'Homemade pickles with native spices — maavadu, narthangai, citron & more.',
  },
  {
    name: 'Porridge Mix',
    image: CATEGORY_IMAGES.porridge,
    desc: 'Nutritious porridge mixes for healthy mornings — easy to cook, pure ingredients.',
  },
  {
    name: 'Instant Mix',
    image: CATEGORY_IMAGES.instant,
    desc: 'Ready-to-cook instant mixes — save time without compromising authentic taste.',
  },
  {
    name: 'Vathal Varieties',
    image: CATEGORY_IMAGES.vathal,
    desc: 'Sun-dried vathal varieties — milaguthakkali, sundakkai & traditional favorites.',
  },
];

export const TRUST_BADGES = [
  { title: 'Home Made', desc: 'Not factory-made, but heart-made. Prepared with love, care, and authenticity' },
  { title: 'No Preservatives', desc: 'Only purity, nothing else. Zero chemicals, no artificial flavors, no preservatives.' },
  { title: '100% Natural', desc: 'Nature in its purest form. Made with carefully sourced, wholesome ingredients' },
  { title: 'Traditional Recipes', desc: 'Rooted in agraharam kitchens. Recipes passed down through generations of Brahmin households' },
  { title: 'Pure Vegetarian', desc: 'Simple and pure' },
];

export const HOW_IT_WORKS = [
  {
    title: 'Order',
    desc: 'Explore our premium-quality, healthy products and add your favorites to the cart. Place your order using Cash on Delivery (COD) or bank transfer.',
  },
  {
    title: 'Order Confirmation Call',
    desc: 'After placing your order, our team will contact you to confirm the details. If you choose bank transfer, we\'ll share our account information during the call.',
  },
  {
    title: 'Shipping Charges',
    desc: 'Shipping fees vary depending on your delivery location and will be shared during the confirmation call.',
  },
];

export const HOW_IT_WORKS_DEFAULT_IMAGE = SITE_IMAGES.howItWorks;

export const ABOUT_DEFAULT_MAIN_IMAGE = SITE_IMAGES.aboutMain;

export const ABOUT_DEFAULT_SECONDARY_IMAGE = SITE_IMAGES.aboutSecondary;

export const ABOUT_CONTENT = {
  subtitle: 'From Our Agraharam Kitchen to Yours',
  paragraphs: [
    'Agrahara Bhojanam was born in the sacred streets of Madurai, inspired by the Agraharam lifestyle — where food is not just nourishment, but a daily offering of love, purity, and tradition.',
    'Every product we create follows the same methods our grandmothers used — roasting spices in earthen pots, grinding them on stone, and preparing each batch with care. No shortcuts. No preservatives. Only authentic South Indian vegetarian goodness.',
  ],
  bullets: [
    'Tradition is the taste.',
    'Purity is the ingredient.',
    'Love is the secret.',
  ],
  closing: 'From the agraharam streets of Madurai to your dining table — this is our journey. This is Agrahara Bhojanam.',
};

export const ABOUT_STATS = [
  { value: '25+', label: 'Years of Heritage' },
  { value: '100%', label: 'Pure Vegetarian' },
  { value: '5', label: 'Royal Collections' },
  { value: '0', label: 'Preservatives' },
];

export const ABOUT_VALUES = [
  { title: 'Made With Love', desc: 'Every batch prepared with devotion in our home kitchen, just as our elders taught us.' },
  { title: 'Pure & Natural', desc: 'No chemicals, no shortcuts — only authentic ingredients sourced with care.' },
  { title: 'Royal Recipes', desc: 'Brahmin traditions preserved and passed through agraharam generations.' },
];

export const ABOUT_PROMISE = [
  { title: 'Tradition is the Taste', desc: 'Stone-ground podis, sun-dried vathal, and time-honoured recipes from Madurai.' },
  { title: 'Purity is the Ingredient', desc: '100% vegetarian, preservative-free, and prepared in small fresh batches.' },
  { title: 'Love is the Secret', desc: 'Every pack carries the warmth of our agraharam kitchen to your family table.' },
];

export const TESTIMONIALS = [
  { name: 'John Paul', text: 'Super nice taste. All products' },
  { name: 'Vijithra Ganesh', text: 'It was very tasty and healthy. I have tasted most of products from Agrahara Bhojanam. Give it a try. Must buy.' },
  { name: 'Harsha Naidu', text: 'Agrahara bhojanam masala has been life saver. Their flavorful masala makes food incredibly yummy.' },
  { name: 'Vignesh Vicky', text: 'Tried their idly milagai podi, sambar podi and rasam podi. Must try products from Agrahara Bhojanam.' },
  { name: 'Pavithran M', text: 'I recently tried the Agrahara Bhojanam Sambar Powder and was impressed with its flavor and aroma.' },
];

export const HERO_IMAGE = SITE_IMAGES.hero;

export const BANNER_IMAGES = [
  CATEGORY_IMAGES.podi,
  CATEGORY_IMAGES.pickle,
  CATEGORY_IMAGES.vathal,
];
