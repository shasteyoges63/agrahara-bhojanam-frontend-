import React from 'react';
import { ArrowRight, Leaf, Award, Heart, Shield, ChefHat } from 'lucide-react';
import { Product } from '../types';
import { SHOP_CATEGORIES, TRUST_BADGES, HOW_IT_WORKS, categoryImageFor } from '../data/siteContent';
import ProductCard from './ProductCard';
import TestimonialsSection from './TestimonialsSection';
import HowItWorksStepCard from './HowItWorksStepCard';
import HowItWorksGallery from './HowItWorksGallery';
import CategoriesSection from './CategoriesSection';
import HeroCarousel from './HeroCarousel';

interface HomePageProps {
  products: Product[];
  onChangeTab: (tab: string) => void;
  onShopCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onPreviewProduct: (product: Product) => void;
  onReviewProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const TRUST_ICONS = [Heart, Leaf, Shield, Award, ChefHat];

export default function HomePage({ products, onChangeTab, onShopCategory, onSelectProduct, onPreviewProduct, onReviewProduct, onAddToCart }: HomePageProps) {
  const enabled = products.filter(p => p.enabled);
  const bestSelling = enabled.slice(0, 4);
  const featuredCategories = SHOP_CATEGORIES.slice(0, 2);

  return (
    <div className="animate-content-enter ab-home-page">
      <HeroCarousel onChangeTab={onChangeTab} />

      {/* Featured collections — royal horizontal banners */}
      <section className="ab-section-band py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {featuredCategories.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => onShopCategory(cat.name)}
                className="ab-featured-collection group"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="ab-featured-collection-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = categoryImageFor(cat.name);
                  }}
                />
                <div className="ab-featured-collection-overlay" aria-hidden="true" />
                <div className="ab-featured-collection-body">
                  <span className="ab-featured-collection-label">Featured Collection</span>
                  <h3 className="ab-featured-collection-title">{cat.name}</h3>
                  <span className="ab-featured-shop-btn">
                    Shop Now <ArrowRight size={14} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — full royal grid */}
      <CategoriesSection
        onSelectCategory={onShopCategory}
        variant="home"
        title="Explore Royal Categories"
        subtitle="Five authentic collections from our Madurai kitchen"
      />

      {/* Trust strip — on parchment background, no maroon band */}
      <section className="ab-trust-strip ab-trust-strip--light py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="ab-trust-strip-heading text-center text-xs uppercase tracking-[0.2em] mb-8 font-semibold">Why Families Trust Us</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {TRUST_BADGES.map((b, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <div key={b.title} className="ab-trust-strip-item text-center px-2">
                  <div className="ab-trust-strip-icon mx-auto mb-3">
                    <Icon size={20} />
                  </div>
                  <h4 className="ab-trust-strip-title font-semibold mb-1.5 text-sm">{b.title}</h4>
                  <p className="ab-trust-strip-desc text-xs leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Best products */}
      <section className="ab-section-surface max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="ab-section-heading ab-section-heading-plain">
          <span className="ab-royal-badge mb-3">Bestsellers</span>
          <h2 className="ab-page-h2">Our Finest Products</h2>
          <p>Handpicked favorites from our royal kitchen</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {(bestSelling.length > 0 ? bestSelling : enabled.slice(0, 4)).map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              onPreview={onPreviewProduct}
              onReview={onReviewProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onChangeTab('products')} className="ab-btn-primary px-10 py-3 rounded-full text-sm font-semibold">
            View All Products
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="ab-section-band-alt py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="ab-section-heading ab-section-heading-plain">
            <h2 className="ab-page-h2">How We Serve You</h2>
            <p>Simple steps to enjoy authentic homemade taste</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-4">
              {HOW_IT_WORKS.map((step, i) => (
                <HowItWorksStepCard key={step.title} index={i} title={step.title} desc={step.desc} />
              ))}
            </div>
            <HowItWorksGallery />
          </div>
        </div>
      </section>

      <TestimonialsSection title="Voices of Our Royal Patrons" />
    </div>
  );
}
