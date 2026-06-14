import { Product } from '../types';
import { MASALA_IMAGES, PODI_MASALA_IMAGE } from './siteContent';

const CATEGORY_IMAGES: Record<string, string[]> = {
  'Podi Varieties': [PODI_MASALA_IMAGE],
  'Pickle Varieties': [MASALA_IMAGES.pickle, MASALA_IMAGES.herbs],
  'Porridge Mix': [MASALA_IMAGES.porridge, MASALA_IMAGES.grains],
  'Instant Mix': [MASALA_IMAGES.instant, MASALA_IMAGES.rice],
  'Vathal Varieties': [MASALA_IMAGES.vathal, MASALA_IMAGES.curry],
};

const BROKEN_IMAGE_IDS = [
  'photo-1615485290382', // broccoli
  'photo-1601050690597', // removed pickle
  'photo-1506368249637', // removed spice
  'photo-1498837167922', // removed porridge
  'photo-1628102476695', // removed
  'photo-1556910103', // western kitchen — not masala podi
];

export function imagesForCategory(category: string, variant = 0): string[] {
  const pair = CATEGORY_IMAGES[category] ?? [PODI_MASALA_IMAGE];
  const primary = pair[variant % pair.length];
  return [primary];
}

function isBrokenImageUrl(url: string): boolean {
  return BROKEN_IMAGE_IDS.some((id) => url.includes(id));
}

/** Replace known broken / wrong placeholder URLs from API data */
export function normalizeProductImages(products: Product[]): Product[] {
  return products.map((product, index) => {
    const needsFix = product.images.some(isBrokenImageUrl);
    if (!needsFix) return product;
    return {
      ...product,
      images: imagesForCategory(product.category, index),
    };
  });
}
