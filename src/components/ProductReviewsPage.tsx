import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingBag, MessageCircle, ZoomIn, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { TESTIMONIALS, categoryImageFor } from '../data/siteContent';

export interface ProductReview {
  id: string;
  productId: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  image?: string;
  date: string;
}

interface ProductReviewsPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onPreview: (product: Product) => void;
}

const REVIEWS_STORAGE_KEY = 'ab_product_reviews';
const GOLD = '#c9a227';

function loadReviews(productId: string): ProductReview[] {
  try {
    const all: ProductReview[] = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');
    return all.filter(r => r.productId === productId);
  } catch {
    return [];
  }
}

function saveReview(review: ProductReview) {
  try {
    const all: ProductReview[] = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');
    all.unshift(review);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

function loadSavedReviewer(): { name: string; email: string } | null {
  try {
    return JSON.parse(localStorage.getItem('ab_reviewer_info') || 'null');
  } catch {
    return null;
  }
}

export default function ProductReviewsPage({ product, onBack, onAddToCart, onPreview }: ProductReviewsPageProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<ProductReview[]>(() => loadReviews(product.id));
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const saved = loadSavedReviewer();
  const [form, setForm] = useState({
    rating: 0,
    text: '',
    name: saved?.name || '',
    email: saved?.email || '',
    saveInfo: !!saved,
  });

  useEffect(() => {
    setReviews(loadReviews(product.id));
    setQty(1);
    setActiveTab('description');
    setSubmitted(false);
  }, [product.id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating || !form.text.trim() || !form.name.trim() || !form.email.trim()) return;

    const review: ProductReview = {
      id: 'rev-' + Date.now(),
      productId: product.id,
      name: form.name.trim(),
      email: form.email.trim(),
      rating: form.rating,
      text: form.text.trim(),
      date: new Date().toISOString(),
    };

    saveReview(review);
    if (form.saveInfo) {
      localStorage.setItem('ab_reviewer_info', JSON.stringify({ name: form.name, email: form.email }));
    } else {
      localStorage.removeItem('ab_reviewer_info');
    }

    setReviews(loadReviews(product.id));
    setForm(f => ({ ...f, rating: 0, text: '' }));
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/919025672285?text=${encodeURIComponent(`Enquiry about ${product.name}`)}`;
  const reviewCount = reviews.length;
  const productImage = product.images?.[0] || categoryImageFor(product.category);
  const productPrice = Number(product.price);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-bloom">
      <div className="ab-section-panel rounded-2xl p-6 md:p-10 space-y-8 my-4">
        <button type="button" onClick={onBack} className="ab-back-link">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative rounded-xl overflow-hidden border border-[#c9a227]/25 bg-[#fff8f0]">
            <img src={productImage} alt={product.name} className="w-full h-64 md:h-72 object-cover" />
            <button
              type="button"
              onClick={() => onPreview(product)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#5c1a1b] hover:bg-[#c9a227] hover:text-white transition-colors shadow-md"
              title="Preview image"
              aria-label="Preview image"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#5c1a1b] leading-tight">{product.name}</h1>
            <p className="text-2xl font-bold text-[#c9a227]">₹{product.price.toFixed(2)}</p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-[#c9a227]/30 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-[#6b5b4f] hover:bg-[#fff8f0] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-[#2c1810] min-w-[2.5rem] text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(q => q + 1)}
                  className="px-3 py-2 text-[#6b5b4f] hover:bg-[#fff8f0] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center gap-2 ab-btn-primary px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                <ShoppingBag size={16} /> Add to cart
              </button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              <MessageCircle size={16} /> Enquiry on WhatsApp
            </a>

            <p className="text-sm text-[#6b5b4f]">
              Category: <span className="text-[#5c1a1b] font-medium">{product.category}</span>
            </p>
          </div>
        </div>

        <div className="border-b border-[#c9a227]/20 flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-semibold ${activeTab === 'description' ? 'ab-royal-tab-active' : 'ab-royal-tab'}`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-semibold ${activeTab === 'reviews' ? 'ab-royal-tab-active' : 'ab-royal-tab'}`}
          >
            Reviews ({reviewCount})
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-4 text-[#4a3728] leading-relaxed">
            <p>{product.description}</p>
            {product.weight && <p><span className="text-[#c9a227] font-semibold">Weight:</span> {product.weight}</p>}
            {product.ingredients && product.ingredients.length > 0 && (
              <p><span className="text-[#c9a227] font-semibold">Ingredients:</span> {product.ingredients.join(', ')}</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {reviews.length === 0 ? (
              <p className="text-sm text-[#6b5b4f] italic">There are no reviews yet. Be the first to review this product.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="ab-card rounded-xl p-5">
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? GOLD : 'none'} color={GOLD} />
                      ))}
                    </div>
                    <p className="text-sm text-[#4a3728] leading-relaxed mb-2">{r.text}</p>
                    {r.image && (
                      <img src={r.image} alt="Review upload" className="w-24 h-24 object-cover rounded-lg border border-[#c9a227]/20 mb-2" />
                    )}
                    <p className="text-xs font-semibold text-[#5c1a1b]">— {r.name}</p>
                  </div>
                ))}
              </div>
            )}

            {reviews.length === 0 && TESTIMONIALS.slice(0, 2).map(t => (
              <div key={t.name} className="ab-card rounded-xl p-5 opacity-90">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={GOLD} color={GOLD} />)}
                </div>
                <p className="text-sm text-[#4a3728] leading-relaxed mb-2 italic">&quot;{t.text}&quot;</p>
                <p className="text-xs font-semibold text-[#5c1a1b]">— {t.name}</p>
              </div>
            ))}

            <div className="ab-card rounded-xl p-6 md:p-8">
              <h3 className="font-serif text-lg font-bold text-[#5c1a1b] mb-5">Add a review</h3>

              {submitted && (
                <p className="text-sm text-[#1b4332] bg-[#1b4332]/10 border border-[#1b4332]/25 rounded-lg px-4 py-3 mb-5">
                  Thank you! Your review has been submitted.
                </p>
              )}

              <form onSubmit={handleSubmitReview}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm text-[#2c1810] mb-2 font-medium">Your rating <span className="text-red-600">*</span></label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setForm(f => ({ ...f, rating: star }))}
                            className="p-0.5 transition-transform hover:scale-110"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              size={22}
                              fill={(hoverRating || form.rating) >= star ? GOLD : 'none'}
                              color={GOLD}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#2c1810] mb-2 font-medium">Your review <span className="text-red-600">*</span></label>
                      <textarea
                        required
                        value={form.text}
                        onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                        rows={5}
                        className="w-full ab-input rounded-lg px-4 py-3 text-sm resize-y min-h-[120px]"
                        placeholder="Write your review here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2c1810] mb-2 font-medium">Name <span className="text-red-600">*</span></label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full ab-input rounded-lg px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#2c1810] mb-2 font-medium">Email <span className="text-red-600">*</span></label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full ab-input rounded-lg px-4 py-2.5 text-sm"
                      />
                    </div>

                    <label className="flex items-start gap-2 text-xs text-[#6b5b4f] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.saveInfo}
                        onChange={e => setForm(f => ({ ...f, saveInfo: e.target.checked }))}
                        className="mt-0.5 accent-[#5c1a1b]"
                      />
                      Save my name and email for next time.
                    </label>

                    <button type="submit" className="ab-btn-primary px-8 py-2.5 rounded-full text-sm font-semibold">
                      Submit Review
                    </button>
                  </div>

                  <div className="relative min-h-[320px]">
                    <div className="relative h-full min-h-[320px] rounded-2xl overflow-hidden border-2 border-[#c9a227]/25">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full min-h-[320px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
