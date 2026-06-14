import React, { useState } from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { categoryImageFor } from '../data/siteContent';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onPreview: (p: Product) => void;
  onReview: (p: Product) => void;
}

export default function ProductCard({ product, onSelect, onAddToCart, onPreview, onReview }: ProductCardProps) {
  const [addedFlash, setAddedFlash] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  };

  return (
    <div
      className="ab-product-card cursor-pointer group"
      onClick={() => onSelect(product)}
    >
      <div className="ab-product-img-wrap relative h-44 bg-[#fff8f0] flex items-center justify-center p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = categoryImageFor(product.category);
          }}
        />
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(product); }}
            className="p-1.5 bg-white rounded-full shadow-md text-[#6b5b4f] hover:text-[#5c1a1b] border border-[#c9a227]/20"
            aria-label="Preview"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onReview(product); }}
            className="p-1.5 bg-white rounded-full shadow-md text-[#6b5b4f] hover:text-[#5c1a1b] border border-[#c9a227]/20"
            aria-label="Reviews"
          >
            <Star size={14} />
          </button>
        </div>
      </div>
      <div className="p-4 border-t border-[#c9a227]/10">
        <h3 className="ab-product-title text-sm font-semibold text-[#2c1810] line-clamp-2 mb-1 group-hover:text-[#5c1a1b] transition-colors font-serif">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2 mt-3">
          <span className="text-[#c9a227] font-bold text-base">₹{product.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1.5 ab-btn-primary px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            <ShoppingCart size={12} />
            {addedFlash ? 'Added!' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
