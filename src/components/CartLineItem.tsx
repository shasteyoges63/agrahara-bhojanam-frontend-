import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../types';

export function formatInr(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

interface CartLineItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  variant?: 'drawer' | 'page';
  onUpdateQty?: (productId: string, quantity: number) => void;
}

export default function CartLineItem({ item, onRemove, variant = 'drawer', onUpdateQty }: CartLineItemProps) {
  const lineTotal = item.product.price * item.quantity;
  const isDrawer = variant === 'drawer';

  return (
    <article className="ab-cart-item">
      <img
        src={item.product.images[0]}
        alt={item.product.name}
        className="ab-cart-item-img"
        referrerPolicy="no-referrer"
      />
      <div className="ab-cart-item-details">
        <h4 className="ab-cart-item-title">{item.product.name}</h4>
        <p className="ab-cart-item-meta">Qty: {item.quantity}</p>
        <p className="ab-cart-item-meta">Price: {formatInr(item.product.price)}</p>
        {!isDrawer && onUpdateQty && (
          <div className="ab-cart-item-qty">
            <button
              type="button"
              onClick={() => {
                if (item.quantity > 1) onUpdateQty(item.product.id, item.quantity - 1);
              }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.product.id)}
        className="ab-cart-item-remove"
        title="Remove item"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
      <p className="ab-cart-item-total">{formatInr(lineTotal)}</p>
    </article>
  );
}
