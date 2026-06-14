import React from 'react';
import { ArrowRight, Leaf, Award, Heart, Shield, Crown, ChefHat } from 'lucide-react';
import { Product } from '../types';
import { SHOP_CATEGORIES, TRUST_BADGES, HOW_IT_WORKS, HOW_IT_WORKS_DEFAULT_IMAGE, HERO_IMAGE, categoryImageFor } from '../data/siteContent';
import ProductCard from './ProductCard';
import TestimonialsSection from './TestimonialsSection';
import HowItWorksStepCard from './HowItWorksStepCard';
import CategoriesSection from './CategoriesSection';

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

const ROYAL_STATS = [
  { value: '25+', label: 'Years Heritage' },
  { value: '100%', label: 'Pure Vegetarian' },
  { value: '5', label: 'Royal Collections' },
  { value: '0', label: 'Preservatives' },
];

export default function HomePage({ products, onChangeTab, onShopCategory, onSelectProduct, onPreviewProduct, onReviewProduct, onAddToCart }: HomePageProps) {
  const enabled = products.filter(p => p.enabled);
  const bestSelling = enabled.slice(0, 4);
  const featuredCategories = SHOP_CATEGORIES.slice(0, 2);

  return (
    <div className="animate-content-enter ab-home-page">
      {/* Royal Hero */}
      <section className="ab-hero-royal">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-14 md:pt-14 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-7 text-center lg:text-left order-2 lg:order-1">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="ab-royal-badge">Madurai · Agraharam Heritage</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5c1a1b] text-[#f5e6b8] border border-[#c9a227]/40">
                  <Crown size={11} className="text-[#c9a227]" /> Royal Kitchen
                </span>
              </div>
              <h1 className="ab-hero-title font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-[#5c1a1b] leading-[1.15]">
                Authentic Royal Taste From Our Agraharam Kitchen
              </h1>
              <div className="ab-royal-divider lg:mx-0 max-w-xs" />
              <p className="ab-hero-desc text-[#4a3728] text-sm md:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Stone-ground podis, sun-dried vathal, and traditional pickles — Brahmin recipes from Madurai, crafted with purity, devotion, and generations of love.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button onClick={() => onChangeTab('products')} className="ab-btn-primary px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg inline-flex items-center gap-2">
                  Shop Collection <ArrowRight size={16} />
                </button>
                <button onClick={() => onChangeTab('about')} className="ab-btn-outline px-8 py-3.5 rounded-full text-sm font-semibold">
                  Our Story
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-lg mx-auto lg:mx-0">
                {ROYAL_STATS.map(s => (
                  <div key={s.label} className="ab-royal-stat-card">
                    <p className="ab-royal-stat-value">{s.value}</p>
                    <p className="ab-royal-stat-label">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[#c9a227]/30 rounded-full" aria-hidden="true" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-[#c9a227]/20 rounded-2xl rotate-6" aria-hidden="true" />
                <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a227]/15 to-[#5c1a1b]/5 rounded-3xl blur-2xl" aria-hidden="true" />
                <img
                  src={HERO_IMAGE}
                  alt="Traditional spices and homemade foods"
                  className="relative w-full h-auto object-contain rounded-2xl shadow-2xl border-2 border-[#c9a227]/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Trust strip */}
      <section className="ab-trust-strip py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="ab-trust-strip-heading text-center text-xs uppercase tracking-[0.2em] mb-8 font-semibold">Why Families Trust Us</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {TRUST_BADGES.map((b, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <div key={b.title} className="text-center px-2">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#c9a227]/15 border border-[#c9a227]/30 flex items-center justify-center">
                    <Icon size={20} className="text-[#c9a227]" />
                  </div>
                  <h4 className="font-semibold text-white mb-1.5 text-sm">{b.title}</h4>
                  <p className="text-xs text-[#e8d48b]/65 leading-relaxed">{b.desc}</p>
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
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-[#c9a227]/25 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5c1a1b] via-[#c9a227] to-[#5c1a1b] z-10" />
              <img
                src={HOW_IT_WORKS_DEFAULT_IMAGE}
                alt="Traditional masala podi and spices"
                className="w-full h-full object-cover min-h-[280px] lg:min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection title="Voices of Our Royal Patrons" />
    </div>
  );
}
