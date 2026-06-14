import React, { useEffect } from 'react';
import { ShoppingBag, X, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';
import CartLineItem, { formatInr } from './CartLineItem';

import { STORE_WHATSAPP_URL } from '../constants/contact';

const WHATSAPP_URL = STORE_WHATSAPP_URL;

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (productId: string) => void;
  onViewCart: () => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  onRemoveFromCart,
  onViewCart,
  onContinueShopping,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const whatsappText = cart.length
    ? `Hi, I would like to enquire about my cart:\n${cart.map(i => `- ${i.product.name} x${i.quantity}`).join('\n')}\nSubtotal: ${formatInr(subtotal)}`
    : 'Hi, I have an enquiry about Agrahara Bhojanam products.';

  return (
    <div
      className={`ab-cart-modal-overlay ${open ? 'ab-cart-modal-overlay--open' : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="ab-cart-modal-backdrop"
        onClick={onClose}
        aria-label="Close cart"
      />

      <div
        className={`ab-cart-modal ${open ? 'ab-cart-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your Cart"
      >
        <header className="ab-cart-modal-header">
          <div className="ab-cart-modal-header-title">
            <ShoppingBag size={22} strokeWidth={2} />
            <h2>Your Cart</h2>
          </div>
          <button type="button" onClick={onClose} className="ab-cart-modal-close" aria-label="Close">
            <X size={22} />
          </button>
        </header>

        <div className="ab-cart-modal-body">
          {cart.length === 0 ? (
            <div className="ab-cart-modal-empty">
              <ShoppingBag size={40} strokeWidth={1.5} />
              <p>Your cart is empty.</p>
              <button type="button" onClick={onContinueShopping} className="ab-cart-modal-empty-link">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="ab-cart-modal-items">
              {cart.map(item => (
                <CartLineItem
                  key={item.product.id}
                  item={item}
                  onRemove={onRemoveFromCart}
                  variant="drawer"
                />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="ab-cart-modal-footer">
            <p className="ab-cart-modal-subtotal">Subtotal: {formatInr(subtotal)}</p>
            <p className="ab-cart-modal-note">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
            <div className="ab-cart-modal-actions">
              <button type="button" onClick={onViewCart} className="ab-cart-modal-btn ab-cart-modal-btn--outline">
                View Cart
              </button>
              <button type="button" onClick={onContinueShopping} className="ab-cart-modal-btn ab-cart-modal-btn--outline">
                Continue Shopping
              </button>
              <button type="button" onClick={onCheckout} className="ab-cart-modal-btn ab-cart-modal-btn--primary">
                Checkout — {formatInr(subtotal)}
              </button>
            </div>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ab-cart-modal-whatsapp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={22} />
            </a>
          </footer>
        )}
      </div>
    </div>
  );
}
