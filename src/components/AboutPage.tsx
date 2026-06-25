import React from 'react';
import { Heart, Shield, Crown, Leaf, Sparkles, Award } from 'lucide-react';
import {
  ABOUT_CONTENT,
  ABOUT_STATS,
  ABOUT_VALUES,
  ABOUT_PROMISE,
} from '../data/siteContent';
import TestimonialsSection from './TestimonialsSection';
import CategoriesSection from './CategoriesSection';
import RoyalSectionHeader from './RoyalSectionHeader';

interface AboutPageProps {
  onShopCategory: (category: string) => void;
}

const STAT_ICONS = [Award, Heart, Crown, Leaf];
const VALUE_ICONS = [Heart, Shield, Crown];
const PROMISE_ICONS = [Leaf, Sparkles, Award];

function RoyalInfoCard({
  icon: Icon,
  label,
  title,
  desc,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="ab-royal-card">
      <div className="ab-royal-card-icon">
        <Icon size={20} />
      </div>
      <p className="ab-royal-card-label">{label}</p>
      <p className="ab-royal-card-value">{title}</p>
      <p className="ab-royal-card-sub">{desc}</p>
    </div>
  );
}

export default function AboutPage({ onShopCategory }: AboutPageProps) {
  return (
    <div className="animate-bloom ab-store-page ab-about-page">
      <section className="ab-page-hero ab-about-hero">
        <div className="ab-page-hero-inner">
          <span className="ab-page-hero-badge">Our Heritage</span>
          <h1 className="ab-page-hero-title">About Agrahara Bhojanam</h1>
          <p className="ab-page-hero-desc">
            Rooted in Madurai&apos;s sacred agraharam — where food is devotion, tradition is taste, and purity is the only ingredient.
          </p>
        </div>
      </section>

      <div className="ab-about-body">
        <div className="ab-store-container">
          <section className="ab-royal-cards-grid ab-about-cards-overlap">
            {ABOUT_STATS.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <RoyalInfoCard
                  key={s.label}
                  icon={Icon}
                  label="Our Legacy"
                  title={s.value}
                  desc={s.label}
                />
              );
            })}
          </section>

          {/* Our Story — text-only royal card */}
          <section className="ab-about-story-section">
            <div className="ab-about-story-card">
              <RoyalSectionHeader
                badge="Our Story"
                title={ABOUT_CONTENT.subtitle}
                subtitle="Authentic Brahmin traditions from Madurai's sacred agraharam"
              />
              <div className="ab-about-story-body">
                {ABOUT_CONTENT.paragraphs.map((p, i) => (
                  <p key={i} className="ab-about-story-text">
                    {p}
                  </p>
                ))}
              </div>
              <div className="ab-about-pillars">
                {ABOUT_CONTENT.bullets.map(b => (
                  <span key={b} className="ab-about-pillar">
                    {b}
                  </span>
                ))}
              </div>
              <blockquote className="ab-about-quote-new ab-about-quote-centered">
                &ldquo;{ABOUT_CONTENT.closing}&rdquo;
              </blockquote>
            </div>
          </section>
        </div>
      </div>

      {/* Core values */}
      <section className="ab-store-section ab-about-values-band py-14">
        <div className="ab-store-container">
          <RoyalSectionHeader
            badge="Our Values"
            title="What We Stand For"
            subtitle="The principles behind every product from our royal kitchen"
          />
          <div className="ab-royal-cards-grid ab-royal-cards-grid--3">
            {ABOUT_VALUES.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <RoyalInfoCard
                  key={v.title}
                  icon={Icon}
                  label="Our Values"
                  title={v.title}
                  desc={v.desc}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Royal promise — on parchment, dark readable text */}
      <section className="ab-store-section ab-about-promise-band ab-about-promise-band--light py-14">
        <div className="ab-store-container">
          <RoyalSectionHeader
            badge="Our Promise"
            title="The Agraharam Way"
            subtitle="Three pillars that guide everything we prepare and deliver"
          />
          <div className="ab-royal-cards-grid ab-royal-cards-grid--3">
            {ABOUT_PROMISE.map((item, i) => {
              const Icon = PROMISE_ICONS[i % PROMISE_ICONS.length];
              return (
                <RoyalInfoCard
                  key={item.title}
                  icon={Icon}
                  label="Our Promise"
                  title={item.title}
                  desc={item.desc}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop collections CTA */}
      <CategoriesSection
        onSelectCategory={onShopCategory}
        variant="about"
        title="Our Royal Collections"
        subtitle="Discover every tradition we preserve — shop authentic flavours"
      />

      <TestimonialsSection title="Voices of Our Patrons" showReviewsLabel />
    </div>
  );
}
