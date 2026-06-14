import image1 from '../assets/Image1.jpg';
import image2 from '../assets/Image2.jpg';
import image3 from '../assets/Image3.jpg';

export type HeroCarouselSlide = {
  id: string;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  imageAlt: string;
};

/** Homepage hero carousel — brand spice photography (no faces) */
export const HERO_CAROUSEL_SLIDES: HeroCarouselSlide[] = [
  {
    id: 'anjarai-petti',
    image: image3,
    badge: 'Anjarai Petti · Traditional Spices',
    title: 'Fresh From Our',
    highlight: 'Anjarai Petti',
    description:
      'Wooden spice box treasures — coriander, milagai, bay leaf, and hand-picked masala measured with devotion, just as our agraharam elders taught us.',
    imageAlt: 'Traditional anjarai petti with Indian spices and lentils',
  },
  {
    id: 'royal-spices',
    image: image1,
    badge: 'Madurai · Royal Traditional Kitchen',
    title: 'Authentic Royal Taste From',
    highlight: 'Our Agraharam Kitchen',
    description:
      'Brass bowls of podi, milagai, and hand-ground masala — Brahmin recipes crafted with purity, devotion, and generations of love.',
    imageAlt: 'Brass spice bowls with turmeric and chili powder',
  },
  {
    id: 'stone-ground',
    image: image2,
    badge: 'Pure · Natural · Homemade',
    title: 'Crafted With',
    highlight: 'Traditional Recipes',
    description:
      'Stone-ground on ammi kal, sun-dried with care — pure vegetarian goodness with zero preservatives and 100% natural ingredients.',
    imageAlt: 'Stone mortar and pestle with traditional whole spices',
  },
];

export const HERO_IMAGE = image3;
