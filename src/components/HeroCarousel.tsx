import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { HERO_CAROUSEL_SLIDES } from '../data/heroCarousel';

const AUTO_MS = 6000;

const ROYAL_STATS = [
  { value: '25+', label: 'Years Heritage' },
  { value: '100%', label: 'Pure Vegetarian' },
  { value: '5', label: 'Royal Collections' },
  { value: '0', label: 'Preservatives' },
];

interface HeroCarouselProps {
  onChangeTab: (tab: string) => void;
}

export default function HeroCarousel({ onChangeTab }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HERO_CAROUSEL_SLIDES.length;

  const goTo = useCallback((index: number) => {
    setActive((index + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [next, paused]);

  const slide = HERO_CAROUSEL_SLIDES[active];

  return (
    <section
      className="ab-hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Welcome highlights"
    >
      <div className="ab-hero-carousel-viewport">
        {HERO_CAROUSEL_SLIDES.map((item, index) => (
          <div
            key={item.id}
            className={`ab-hero-carousel-slide${index === active ? ' ab-hero-carousel-slide--active' : ''}`}
            data-slide={item.id}
            aria-hidden={index !== active}
          >
            <img
              src={item.image}
              alt={item.imageAlt}
              className="ab-hero-carousel-bg"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="ab-hero-carousel-shade" aria-hidden="true" />
          </div>
        ))}

        <div className="ab-hero-carousel-topbar" aria-hidden="true" />

        <div className="ab-hero-carousel-inner max-w-7xl mx-auto px-4 md:px-6">
          <div key={slide.id} className="ab-hero-carousel-copy animate-hero-slide">
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-5">
              <span className="ab-hero-carousel-badge">{slide.badge}</span>
              <span className="ab-hero-carousel-badge ab-hero-carousel-badge--gold">
                <Crown size={11} className="inline mr-1 -mt-px" aria-hidden="true" />
                Royal Kitchen
              </span>
            </div>

            <h1 className="ab-hero-carousel-title font-serif">
              {slide.title}{' '}
              <span className="ab-hero-carousel-highlight">{slide.highlight}</span>
            </h1>

            <div className="ab-hero-carousel-divider" aria-hidden="true" />

            <p className="ab-hero-carousel-desc">{slide.description}</p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-7">
              <button
                type="button"
                onClick={() => onChangeTab('products')}
                className="ab-btn-primary ab-hero-carousel-cta px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg inline-flex items-center gap-2"
              >
                Shop Collection <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChangeTab('about')}
                className="ab-btn-outline ab-hero-carousel-cta-outline px-8 py-3.5 rounded-full text-sm font-semibold"
              >
                Our Story
              </button>
            </div>
          </div>

          <div className="ab-hero-carousel-stats">
            {ROYAL_STATS.map(s => (
              <div key={s.label} className="ab-hero-carousel-stat">
                <p className="ab-hero-carousel-stat-value">{s.value}</p>
                <p className="ab-hero-carousel-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="ab-hero-carousel-arrow ab-hero-carousel-arrow--prev"
          onClick={prev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="ab-hero-carousel-arrow ab-hero-carousel-arrow--next"
          onClick={next}
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        <div className="ab-hero-carousel-dots" role="tablist" aria-label="Hero slides">
          {HERO_CAROUSEL_SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Slide ${index + 1}: ${item.highlight}`}
              className={`ab-hero-carousel-dot${index === active ? ' ab-hero-carousel-dot--active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <div className="ab-hero-carousel-progress" aria-hidden="true">
          <span
            key={active}
            className="ab-hero-carousel-progress-bar"
            style={{ animationDuration: `${AUTO_MS}ms` }}
          />
        </div>
      </div>
    </section>
  );
}
