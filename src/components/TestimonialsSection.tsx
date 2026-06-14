import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/siteContent';

function photoKey(name: string) {
  return `ab_client_photo_${name.replace(/\s+/g, '_').toLowerCase()}`;
}

function ClientPhoto({ name }: { name: string }) {
  const [photo, setPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(photoKey(name));
    } catch {
      return null;
    }
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      try {
        localStorage.setItem(photoKey(name), dataUrl);
      } catch {
        /* ignore */
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <label
      className="ab-testimonial-avatar w-12 h-12 rounded-full overflow-hidden shrink-0 cursor-pointer border-2 border-[#c9a227]/50 mx-auto mb-3 block"
      title="Click to upload client photo"
      onClick={(e) => e.stopPropagation()}
    >
      {photo ? (
        <img src={photo} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="w-full h-full flex items-center justify-center bg-[#5c1a1b] text-[#f5e6b8] font-bold text-sm">
          {name.charAt(0)}
        </span>
      )}
      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </label>
  );
}

function TestimonialCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="ab-testimonial-card bg-white rounded-2xl p-6 text-center border border-[#c9a227]/20 shadow-sm">
      <ClientPhoto name={name} />
      <p className="ab-testimonial-name font-serif font-semibold text-[#5c1a1b] text-sm mb-1">{name}</p>
      <div className="flex gap-0.5 mb-3 justify-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="#c9a227" color="#c9a227" />
        ))}
      </div>
      <p className="ab-testimonial-text text-sm text-[#4a3728] leading-relaxed italic">&quot;{text}&quot;</p>
    </div>
  );
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  showReviewsLabel?: boolean;
}

export default function TestimonialsSection({
  title = 'Voices of Our Royal Patrons',
  subtitle = `EXCELLENT — Based on ${TESTIMONIALS.length} reviews`,
  showReviewsLabel = false,
}: TestimonialsSectionProps) {
  return (
    <section className="ab-section-band-alt w-full py-16 md:py-20 border-t border-[#c9a227]/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="ab-section-heading ab-section-heading-plain">
          {showReviewsLabel && (
            <p className="text-xs font-bold uppercase tracking-widest text-[#c9a227] mb-2">Reviews</p>
          )}
          <h2 className="ab-page-h2">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.slice(0, 3).map(t => (
            <TestimonialCard key={t.name} name={t.name} text={t.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
