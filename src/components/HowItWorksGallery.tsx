import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import image4 from '../assets/Image 4.jpg';
import image5 from '../assets/Image 5.jpg';

const GALLERY_IMAGES = [
  {
    src: image4,
    alt: 'Brass anjarai petti with traditional Indian spices and lentils',
    caption: 'Brass Anjarai Petti',
  },
  {
    src: image5,
    alt: 'Wooden spice box with masala powders on rustic surface',
    caption: 'Traditional Masala Box',
  },
] as const;

const AUTO_MS = 5000;

export default function HowItWorksGallery() {
  const [active, setActive] = useState(0);
  const total = GALLERY_IMAGES.length;

  const goTo = useCallback((index: number) => {
    setActive((index + total) % total);
  }, [total]);

  useEffect(() => {
    const timer = window.setInterval(() => goTo(active + 1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [active, goTo]);

  return (
    <div className="ab-how-gallery">
      <div className="ab-how-gallery-frame">
        <div className="ab-how-gallery-topbar" aria-hidden="true" />
        <div className="ab-how-gallery-viewport">
          {GALLERY_IMAGES.map((item, index) => (
            <img
              key={item.caption}
              src={item.src}
              alt={item.alt}
              className={`ab-how-gallery-img${index === active ? ' ab-how-gallery-img--active' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <button
          type="button"
          className="ab-how-gallery-arrow ab-how-gallery-arrow--prev"
          onClick={() => goTo(active - 1)}
          aria-label="Previous image"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="ab-how-gallery-arrow ab-how-gallery-arrow--next"
          onClick={() => goTo(active + 1)}
          aria-label="Next image"
        >
          <ChevronRight size={18} />
        </button>
        <div className="ab-how-gallery-dots">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={item.caption}
              type="button"
              aria-label={item.caption}
              aria-current={index === active}
              className={`ab-how-gallery-dot${index === active ? ' ab-how-gallery-dot--active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <p className="ab-how-gallery-caption">{GALLERY_IMAGES[active].caption}</p>
      </div>
    </div>
  );
}
