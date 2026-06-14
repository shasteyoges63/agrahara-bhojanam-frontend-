import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SHOP_CATEGORIES, categoryImageFor } from '../data/siteContent';
import RoyalSectionHeader from './RoyalSectionHeader';

interface CategoriesSectionProps {
  onSelectCategory: (name: string) => void;
  variant?: 'home' | 'shop' | 'about';
  title?: string;
  subtitle?: string;
}

export default function CategoriesSection({
  onSelectCategory,
  variant = 'home',
  title = 'Explore Royal Categories',
  subtitle = 'Five authentic collections from our Madurai kitchen',
}: CategoriesSectionProps) {
  const isShop = variant === 'shop';
  const isAbout = variant === 'about';
  const categories = isAbout ? SHOP_CATEGORIES.slice(0, 4) : SHOP_CATEGORIES;

  const sectionBg = isShop ? 'ab-store-section--cream' : isAbout ? 'ab-store-section--warm' : 'ab-store-section--cream';

  return (
    <section className={`ab-store-section ${sectionBg}`}>
      <div className="ab-store-container">
        <RoyalSectionHeader
          badge={isShop ? 'Shop' : 'Collections'}
          title={title}
          subtitle={subtitle}
        />

        <div
          className={`grid gap-4 md:gap-5 ${
            isAbout
              ? 'grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
          }`}
        >
          {categories.map(cat => (
            <button
              key={cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className="ab-category-grid-card group w-full"
            >
              <div className="ab-category-grid-img-wrap">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = categoryImageFor(cat.name);
                  }}
                />
              </div>
              <div className="ab-category-grid-footer">
                <p className="ab-category-grid-title">{cat.name}</p>
                <span className="ab-category-grid-shop-hint">Shop <ArrowRight size={10} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
