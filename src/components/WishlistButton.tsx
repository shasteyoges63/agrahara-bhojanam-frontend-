import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const WISHLIST_KEY = 'ab_wishlist';

function loadWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(ids: string[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = '' }: WishlistButtonProps) {
  const [saved, setSaved] = useState(() => loadWishlist().includes(productId));

  useEffect(() => {
    setSaved(loadWishlist().includes(productId));
  }, [productId]);

  const toggle = () => {
    const list = loadWishlist();
    const idx = list.indexOf(productId);
    if (idx > -1) {
      list.splice(idx, 1);
      setSaved(false);
    } else {
      list.push(productId);
      setSaved(true);
    }
    saveWishlist(list);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-4 ab-card rounded-2xl transition-all shadow-md ${
        saved
          ? 'text-[#5c1a1b] border-[#c9a227]/60 bg-[#fdf6ec] scale-105'
          : 'text-[#6b5b4f] hover:text-[#5c1a1b] hover:border-[#c9a227]/40'
      } ${className}`}
      title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
    >
      <Heart size={24} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

export function isInWishlist(productId: string) {
  return loadWishlist().includes(productId);
}

export function getWishlistIds() {
  return loadWishlist();
}
