import React, { useState } from 'react';
import { ShoppingCart, LogIn, UserPlus, ArrowLeft, CheckCircle, MessageCircle, MailCheck, ShieldCheck, Download, Printer, FileText } from 'lucide-react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import CartLineItem, { formatInr } from './CartLineItem';

interface CustomerPagesProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  cart: CartItem[];
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: 'UPI' | 'COD' | 'WhatsAppLink';
    notes?: string;
  }) => Promise<Order | null>;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  customerUser: { id: string; name: string; email: string; phone: string; address?: string } | null;
  authMode: 'login' | 'register';
  onLoginCustomer: (
    user: { name: string; email: string; phone: string; address?: string },
    isRegistering: boolean
  ) => Promise<void>;
}

export default function CustomerPages({
  currentTab,
  onChangeTab,
  cart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  activeOrder,
  setActiveOrder,
  customerUser,
  authMode,
  onLoginCustomer,
}: CustomerPagesProps) {

  // Invoice toggle & downloading progress states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const getOrderStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#5c1a1b] text-[#f5e6b8] border-[#c9a227]';
      case 'Dispatched':
        return 'bg-[#3d3520] text-[#e9c46a] border-[#d4af37]';
      case 'Pending':
        return 'bg-[#23150d] text-[#b0a090] border-[#4a3528]';
      default:
        return 'bg-[#3d1515] text-red-300 border-red-800';
    }
  };

  const getPaymentStatusLabel = (paymentStatus: Order['paymentStatus']) => {
    switch (paymentStatus) {
      case 'Completed':
        return 'SUCCESS PAID';
      case 'Refunded':
        return 'REFUNDED';
      default:
        return 'PAYMENT PENDING';
    }
  };

  const getPaymentStatusClass = (paymentStatus: Order['paymentStatus']) => {
    switch (paymentStatus) {
      case 'Completed':
        return 'text-[#1b4332]';
      case 'Refunded':
        return 'text-[#9b1c1c]';
      default:
        return 'text-[#b45309]';
    }
  };

  const solidifyInvoiceForPdfCapture = (root: HTMLElement) => {
    root.style.background = '#ffffff';
    root.style.color = '#2c1810';
    root.style.borderRadius = '0';
    root.style.border = '2px solid #d4a017';
    root.style.boxShadow = 'none';
    root.style.overflow = 'visible';

    root.querySelectorAll<HTMLElement>('*').forEach((node) => {
      node.style.backdropFilter = 'none';
      node.style.setProperty('-webkit-backdrop-filter', 'none');

      if (node.classList.contains('ab-invoice-brand-band')) {
        node.style.background = '#4a1e1e';
        node.style.backgroundImage = 'none';
        node.style.color = '#f5e6b8';
      }
      if (node.classList.contains('ab-invoice-table') && node.tagName === 'THEAD') {
        node.style.background = '#4a1e1e';
      }
    });
  };

  const handleDownloadPDF = async () => {
    if (!activeOrder) return;
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('tax-invoice-printable-doc-cust');
      if (!element) return;

      element.scrollIntoView({ block: 'start' });
      await document.fonts.ready;

      const captureWidth = 794;
      const prevWidth = element.style.width;
      const prevMaxWidth = element.style.maxWidth;
      element.style.width = `${captureWidth}px`;
      element.style.maxWidth = `${captureWidth}px`;

      const canvas = await html2canvas(element, {
        scale: 2,
        width: captureWidth,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (_doc, clonedEl) => {
          clonedEl.style.width = `${captureWidth}px`;
          clonedEl.style.maxWidth = `${captureWidth}px`;
          solidifyInvoiceForPdfCapture(clonedEl);
        },
      });

      element.style.width = prevWidth;
      element.style.maxWidth = prevMaxWidth;

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = 210;
      const pageHeight = 297;

      pdf.setFillColor(255, 251, 245);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFillColor(74, 30, 30);
      pdf.rect(0, 0, pageWidth, 2.5, 'F');
      pdf.setFillColor(212, 160, 23);
      pdf.rect(0, 2.5, pageWidth, 1, 'F');

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const finalHeight = Math.min(imgHeight, pageHeight);
      const finalWidth = (canvas.width * finalHeight) / canvas.height;
      const xOffset = (pageWidth - finalWidth) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, 3, finalWidth, finalHeight - 6);

      pdf.setDrawColor(212, 160, 23);
      pdf.setLineWidth(0.35);
      pdf.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S');

      pdf.save(`Agrahara_Bhojanam_Invoice_${activeOrder.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // Login & Register state
  const [isRegistering, setIsRegistering] = useState(authMode === 'register');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [credentials, setCredentials] = useState({
    name: customerUser?.name || '',
    email: customerUser?.email || '',
    phone: customerUser?.phone || '',
    address: customerUser?.address || '',
  });

  // Checkout states
  const [checkoutForm, setCheckoutForm] = useState({
    name: customerUser?.name || '',
    email: customerUser?.email || '',
    phone: customerUser?.phone || '',
    address: customerUser?.address || '',
    paymentMethod: 'UPI' as 'UPI' | 'COD' | 'WhatsAppLink',
    notes: ''
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    if (currentTab === 'customer-login') {
      setIsRegistering(authMode === 'register');
      setAuthError('');
    }
  }, [currentTab, authMode]);

  // Sync checkout form when user logs in/registers
  React.useEffect(() => {
    if (customerUser) {
      setCheckoutForm(prev => ({
        ...prev,
        name: customerUser.name,
        email: customerUser.email,
        phone: customerUser.phone,
        address: customerUser.address || ''
      }));
    }
  }, [customerUser]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.name || !credentials.email || !credentials.phone) return;

    setAuthLoading(true);
    setAuthError('');
    try {
      await onLoginCustomer({
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        address: credentials.address,
      }, isRegistering);
      onChangeTab(cart.length > 0 ? 'checkout' : 'products');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Could not complete sign in. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      alert('Please fill out all required shipping fields so we can register the parcel.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');
    try {
      const completedOrder = await onPlaceOrder({
        customerName: checkoutForm.name,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
        customerAddress: checkoutForm.address,
        paymentMethod: checkoutForm.paymentMethod,
        notes: checkoutForm.notes,
      });

      if (completedOrder) {
        setActiveOrder(completedOrder);
        onChangeTab('order-confirmation');
      }
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Could not place your order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  // Generate Web WhatsApp Pre-filled text URL (Real Dynamic WhatsApp notification links)
  const getWhatsAppURL = (order: Order) => {
    const defaultRecipient = '918838026509'; // Store owner
    const itemsText = order.items.map(it => `• ${it.productName} [Qty: ${it.quantity} @ ₹${it.price}]`).join('%0A');
    const msg = `🌿 Welcome! AGRAHARA BHOJANAM ORDER CONFIRMED 🌿%0A%0A` +
                `*Invoice:* ${order.invoiceNumber}%0A` +
                `*Date:* ${new Date(order.orderDate).toLocaleDateString()}%0A%0A` +
                `*Customer Details:*%0A` +
                `- Name: ${order.customerName}%0A` +
                `- Phone: ${order.customerPhone}%0A` +
                `- Address: ${order.customerAddress}%0A%0A` +
                `*Items Ordered:*%0A${itemsText}%0A%0A` +
                `*Total Grand Price:* ₹${order.totalPrice}%0A` +
                `*Payment Selected:* ${order.paymentMethod}%0A%0A` +
                `Please process our traditional food order. Thank you.`;
    return `https://wa.me/${defaultRecipient}?text=${msg}`;
  };

  // 1. CUSTOMER LOGIN & REGISTER SCREEN
  if (currentTab === 'customer-login') {
    return (
      <div className="max-w-md mx-auto px-4 py-8 animate-bloom">
        <div className="ab-section-panel rounded-3xl overflow-hidden p-8 space-y-6 my-4">
          <div className="text-center space-y-2">
            <span className="ab-royal-badge">Customer Portal</span>
            <div className="ab-section-heading mb-2">
              <h2 className="text-xl md:text-2xl">
              {isRegistering ? 'Create Your Account' : 'Welcome Back'}
            </h2></div>
            <p className="text-xs ab-muted font-sans">
              {isRegistering 
                ? 'Create a customer account to save your delivery details.' 
                : 'Sign in to access your shopping thali and order history.'}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans ab-muted">
            <div className="space-y-1">
              <label className="font-semibold block ab-h">Your Full Name *</label>
              <input 
                type="text"
                required
                value={credentials.name}
                onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                placeholder="e.g. Yogesh Shaste" 
                className="w-full p-2.5 ab-input rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold block ab-h">Email Address *</label>
              <input 
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder="e.g. yogeshshaste@gmail.com" 
                className="w-full p-2.5 ab-input rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold block ab-h">Active Phone (WhatsApp No) *</label>
              <input 
                type="tel"
                required
                value={credentials.phone}
                onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                placeholder="e.g. 9845012345" 
                className="w-full p-2.5 ab-input rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold block ab-h">Full Shipping Address</label>
              <textarea
                rows={3}
                value={credentials.address}
                onChange={(e) => setCredentials({...credentials, address: e.target.value})}
                placeholder="Your complete home or delivery coordinates..." 
                className="w-full p-2.5 ab-input rounded-lg"
              />
            </div>

            {authError && (
              <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11px] leading-relaxed">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full ab-btn-primary font-sans font-bold py-3 rounded-lg shadow-sm cursor-pointer text-xs uppercase tracking-wider disabled:opacity-60"
            >
              {authLoading
                ? 'Please wait...'
                : isRegistering
                  ? '🌿 Create Customer Account'
                  : '🗝️ Access Customer Portal'}
            </button>
          </form>

          <div className="text-center pt-2 text-xs font-sans ab-muted border-t border-[#c9a227]/20">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
              className="text-[#c9a227] hover:underline font-bold cursor-pointer"
            >
              {isRegistering ? 'Already have an account? Sign In instead' : 'New to Agrahara? Create an account for free'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SHOPPING CART VIEW — centered layout
  if (currentTab === 'cart') {
    return (
      <div className="ab-cart-page animate-bloom">
        <div className="ab-cart-modal ab-cart-modal--page">
          <header className="ab-cart-modal-header">
            <div className="ab-cart-modal-header-title">
              <ShoppingCart size={22} strokeWidth={2} />
              <h2>Your Cart</h2>
            </div>
          </header>

          {cart.length > 0 ? (
            <>
              <div className="ab-cart-modal-body">
                <div className="ab-cart-modal-items">
                  {cart.map(item => (
                    <CartLineItem
                      key={item.product.id}
                      item={item}
                      onRemove={onRemoveFromCart}
                      onUpdateQty={onUpdateCartQty}
                      variant="page"
                    />
                  ))}
                </div>
                <div className="ab-cart-page-links">
                  <button type="button" onClick={() => onChangeTab('products')}>
                    ← Continue Shopping
                  </button>
                  <button type="button" onClick={onClearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>

              <footer className="ab-cart-modal-footer">
                <p className="ab-cart-modal-subtotal">Subtotal: {formatInr(cartSubtotal)}</p>
                <p className="ab-cart-modal-note">
                  {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} · Free shipping on all orders
                </p>
                <div className="ab-cart-modal-actions flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeTab('checkout')}
                    className="ab-cart-modal-btn ab-cart-modal-btn--primary"
                  >
                    {customerUser ? 'Checkout' : 'Guest Checkout'} — {formatInr(cartSubtotal)}
                  </button>
                  {!customerUser && (
                    <button
                      type="button"
                      onClick={() => onChangeTab('customer-login')}
                      className="ab-cart-modal-btn ab-cart-modal-btn--outline text-xs"
                    >
                      Login for faster checkout
                    </button>
                  )}
                </div>
              </footer>
            </>
          ) : (
            <div className="ab-cart-modal-body">
              <div className="ab-cart-modal-empty">
                <ShoppingCart size={40} strokeWidth={1.5} />
                <p>Your cart is empty.</p>
                <button type="button" onClick={() => onChangeTab('products')} className="ab-cart-modal-empty-link">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. SECURE CHECKOUT VIEW (No Payment Gateway)
  if (currentTab === 'checkout') {
    if (cart.length === 0 && !orderLoading) {
      return (
        <div className="max-w-md mx-auto px-4 py-8 animate-bloom text-center space-y-4">
          <p className="text-sm ab-muted font-sans">Your cart is empty. Add items before checkout.</p>
          <button type="button" onClick={() => onChangeTab('products')} className="ab-btn-primary px-6 py-2.5 text-sm font-semibold">
            Browse Products
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto animate-bloom px-4 py-8">
        <div className="ab-section-panel rounded-2xl p-6 md:p-10 space-y-6 my-4">
        <button onClick={() => onChangeTab('cart')} className="ab-back-link">
          ← Return to Cart
        </button>

        <div className="ab-section-heading text-left mb-4 border-b border-[#c9a227]/20 pb-3">
          <h2 className="text-xl md:text-2xl flex items-center gap-2 justify-center md:justify-start">
            Secure Checkout
          </h2>
          {customerUser ? (
            <p className="text-xs ab-muted font-sans mt-2">
              Signed in as <strong className="ab-h">{customerUser.name}</strong>. Your saved delivery details are pre-filled.
            </p>
          ) : (
            <p className="text-xs ab-muted font-sans mt-2">
              Checking out as a guest — no login required.{' '}
              <button
                type="button"
                onClick={() => onChangeTab('customer-login')}
                className="text-[#c9a227] hover:underline font-bold"
              >
                Login
              </button>{' '}
              to save your details for next time.
            </p>
          )}
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Shipping and contact card */}
          <div className="ab-card p-6 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-[#c9a227] border-b border-[#c9a227]/20 pb-2 text-sm">
              1. Delivery Coordinates
            </h3>

            <div className="space-y-4 text-xs font-sans ab-muted">
              <div className="space-y-1">
                <label className="font-semibold block ab-h">Consignee Name *</label>
                <input
                  type="text"
                  required
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                  className="w-full p-2.5 ab-input rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block ab-h">Email to send Invoice *</label>
                <input
                  type="email"
                  required
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                  className="w-full p-2.5 ab-input rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block ab-h">Active WhatsApp Phone * (For Notifications)</label>
                <input
                  type="tel"
                  required
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                  className="w-full p-2.5 ab-input rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block ab-h">Complete Address (Include city, state, pin) *</label>
                <textarea
                  rows={3}
                  required
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                  className="w-full p-2.5 ab-input rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block ab-h">Special Instructions / Custom Notes</label>
                <input
                  type="text"
                  value={checkoutForm.notes}
                  onChange={(e) => setCheckoutForm({...checkoutForm, notes: e.target.value})}
                  placeholder="e.g. Mild sweet, packed separately"
                  className="w-full p-2.5 ab-input rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Payment method Selector & Scan QR Block */}
          <div className="space-y-6">
            <div className="ab-card p-6 rounded-2xl shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-[#c9a227] border-b border-[#c9a227]/20 pb-2 text-sm">
                2. Select Payment Method (Secure Checkout)
              </h3>

              <div className="space-y-3 text-xs font-sans">
                {/* UPI scan */}
                <label className="flex items-start gap-3 p-3 bg-[#fff8f0] rounded-lg border border-[#c9a227]/20 hover:border-[#c9a227]/40 shadow-xs cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={checkoutForm.paymentMethod === 'UPI'}
                    onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'UPI'})}
                    className="mt-1 accent-[#5c1a1b]"
                  />
                  <div>
                    <span className="font-bold ab-h block">Direct UPI QR Scan & Submit</span>
                    <span className="ab-muted text-[11px] block mt-0.5">
                      Verify order & scan our merchant UPI QR Code to verify payment.
                    </span>
                  </div>
                </label>

                {/* Cash on delivery */}
                <label className="flex items-start gap-3 p-3 bg-[#fff8f0] rounded-lg border border-[#c9a227]/20 hover:border-[#c9a227]/40 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={checkoutForm.paymentMethod === 'COD'}
                    onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'COD'})}
                    className="mt-1 accent-[#5c1a1b]"
                  />
                  <div>
                    <span className="font-bold ab-h block">Cash on Delivery (COD)</span>
                    <span className="ab-muted text-[11px] block mt-0.5">
                      Pay cash at your doorstep directly to native delivery boys.
                    </span>
                  </div>
                </label>

                {/* WhatsApp Payment Link */}
                <label className="flex items-start gap-3 p-3 bg-[#fff8f0] rounded-lg border border-[#c9a227]/20 hover:border-[#c9a227]/40 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="WhatsAppLink"
                    checked={checkoutForm.paymentMethod === 'WhatsAppLink'}
                    onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'WhatsAppLink'})}
                    className="mt-1 accent-[#5c1a1b]"
                  />
                  <div>
                    <span className="font-bold ab-h block flex items-center gap-1">
                      WhatsApp Billing Pay Link
                    </span>
                    <span className="ab-muted text-[11px] block mt-0.5">
                      Receive an custom chat containing payment instructions directly via WhatsApp.
                    </span>
                  </div>
                </label>
              </div>

              {/* DYNAMIC RENDERING: Beautiful UPI QR Code for UPI option */}
              {checkoutForm.paymentMethod === 'UPI' && (
                <div className="ab-card p-4 rounded-xl text-center space-y-2 animate-bloom">
                  <p className="text-[11px] text-[#c9a227] font-bold tracking-wider uppercase">✨ Direct Merchant UPI QR Code ✨</p>
                  
                  <div className="w-32 h-32 ab-card mx-auto rounded-lg flex items-center justify-center p-2 relative shadow-xs">
                    <div className="absolute inset-2 bg-white flex flex-wrap gap-1 p-0.5 overflow-hidden justify-center opacity-90 rounded">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2.5 h-2.5 ${
                            (i + 3) % 4 === 0 || i % 6 === 0 ? 'bg-[#5c1a1b]' : 'bg-neutral-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="absolute w-8 h-8 bg-white border border-[#c9a227]/20 rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
                      🌿
                    </div>
                  </div>

                  <p className="text-[10px] ab-muted font-mono font-bold">ID: <strong>merchant@upi</strong></p>
                  <p className="text-[11px] font-bold ab-h">SCAN & INSTANT TRANSFER: <span className="text-[#c9a227] font-sans font-black">₹ {cartSubtotal}</span></p>
                  <p className="text-[9px] ab-muted leading-none">Scan using GPay, PhonePe, or BHIM. Then click confirm below to register your order.</p>
                </div>
              )}

              {orderError && (
                <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11px] leading-relaxed">
                  {orderError}
                </p>
              )}

              <div className="border-t border-[#c9a227]/20 pt-4 flex flex-col items-center">
                <button
                  type="submit"
                  disabled={orderLoading || cart.length === 0}
                  className="w-full ab-btn-primary font-sans font-bold tracking-widest py-3.5 px-6 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer text-xs uppercase disabled:opacity-60"
                >
                  {orderLoading ? 'Placing your order...' : `🌿 Confirm & Place Order (₹${cartSubtotal})`}
                </button>
                <span className="text-[9px] ab-muted font-sans pt-1">
                  *Our team processes delivery slips securely through SMTP system notifications.*
                </span>
              </div>
            </div>
          </div>

        </form>
        </div>
      </div>
    );
  }

  // 4. ORDER CONFIRMATION VIEW (Prasadam voucher & notifications status logs)
  if (currentTab === 'order-confirmation' && activeOrder) {
    const o = activeOrder;
    return (
      <>
      <div className="order-confirmation-page no-print max-w-3xl mx-auto animate-bloom px-4 py-8">
        <div className="ab-section-panel rounded-2xl p-6 md:p-10 space-y-6 my-4">
        
        {/* Fresh Confirmation Banner Header */}
        <div className="ab-card p-6 rounded-2xl text-center space-y-2 shadow-xs">
          <CheckCircle className="text-[#c9a227] mx-auto w-12 h-12" />
          <div className="ab-section-heading mb-2"><h2 className="text-xl md:text-2xl">
            Your Traditional Order is Placed!
          </h2></div>
          <p className="text-xs ab-muted max-w-lg mx-auto font-sans">
            Thank you, <strong>{o.customerName}</strong>. Your traditional food order has been recorded. Our kitchen team is hand-packaging your items!
          </p>
        </div>

        {/* Outer Grid: Voucher Info & Notifications Simulator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* THE TRADITIONAL ORDER COUPON */}
          <div className="ab-card p-6 rounded-2xl border border-dashed border-[#5c1a1b]/30 shadow-xs space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#5c1a1b]" />
            
            <div className="flex justify-between items-start pt-2">
              <div>
                <span className="text-[10px] bg-black/40 text-[#c9a227] px-2 py-0.5 rounded font-bold font-sans uppercase tracking-wider">
                  AGRAHARA ORDER SLIP
                </span>
                <span className="text-[10px] ab-muted font-mono block mt-1">INVOICE: <strong>{o.invoiceNumber}</strong></span>
              </div>
              <span className="bg-[#5c1a1b] text-white text-[9px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                {o.paymentMethod}
              </span>
            </div>

            <div className="border-b border-[#c9a227]/20 my-3" />

            <div className="space-y-3.5 text-xs font-sans ab-muted">
              <div>
                <p className="ab-h font-bold">Consignee Coordinates:</p>
                <p className="text-[11px] leading-relaxed pl-2 bg-[#fff8f0] mt-1 p-2.5 rounded-lg border border-[#c9a227]/20 ab-p">
                  Name: {o.customerName}<br />
                  Phone: {o.customerPhone}<br />
                  Address: {o.customerAddress}
                </p>
              </div>
              
              <div className="pt-1">
                <p className="pb-1 font-bold ab-h">Ordered Traditional Items:</p>
                <div className="space-y-1.5 pl-2 border-l-2 border-[#5c1a1b]/15">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-[11px] leading-tight ab-muted">
                      <span>{it.productName} <strong className="text-[#c9a227]">x {it.quantity}</strong></span>
                      <span className="ab-h font-bold">₹ {it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#c9a227]/20 pt-3 flex justify-between font-bold text-[#c9a227] text-sm">
                <span>Total Package Price:</span>
                <span>₹ {o.totalPrice}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#c9a227]/20 pt-3 text-center space-y-2.5">
              <span className="text-[9px] font-mono ab-muted block">Recorded At: {new Date(o.orderDate).toLocaleString()}</span>
              
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="w-full inline-flex items-center justify-center gap-1.5 ab-btn-primary rounded-lg py-2 px-3 font-sans font-bold text-[10.5px] uppercase tracking-wider transition-all shadow-xs cursor-pointer select-none active:scale-95"
              >
                <FileText size={13} /> View & Download Invoice PDF
              </button>

              <p className="text-[10px] font-bold text-[#c9a227] font-sans uppercase tracking-widest pt-0.5">🌱 Handcrafted Traditional Heritage 🌱</p>
            </div>

          </div>

          {/* DYNAMIC NOTIFICATIONS ACTIONS */}
          <div className="ab-card ab-h p-5 rounded-2xl shadow-xs space-y-4 font-mono text-xs">
            
            <h4 className="text-[#c9a227] font-sans font-bold border-b border-[#c9a227]/20 pb-2 flex items-center gap-1.5 uppercase text-xs">
              <span>🔔</span> System Integration Core
            </h4>

            {/* A. WhatsApp Trigger Notification */}
            <div className="space-y-2 bg-[#fff8f0] p-3.5 rounded-xl border border-[#c9a227]/20">
              <p className="font-bold text-[11px] text-emerald-800 flex items-center gap-1 font-sans">
                🟢 WHATSAPP ORDER NOTIFIER
              </p>
              <p className="text-[9.5px] ab-muted leading-relaxed font-sans">
                We've generated a real pre-filled WhatsApp text containing invoice itemization for the store admin. Click below to launch Web WhatsApp directly!
              </p>
              
              <div className="pt-2">
                <a 
                  href={getWhatsAppURL(o)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 ab-btn-primary rounded py-2.5 px-3 font-bold active:scale-95 transition-all select-none text-[10px] uppercase font-sans tracking-wider cursor-pointer"
                >
                  <MessageCircle size={14} /> Send WhatsApp Alert
                </a>
              </div>
            </div>

            {/* B. SMTP Notification Logs */}
            <div className="space-y-2 bg-[#faf9f5] p-3.5 rounded-xl border border-[#eadeca]">
              <p className="font-bold text-[11.5px] text-[#d4af37] flex items-center gap-1 font-sans uppercase tracking-wider">
                📨 SMTP Mail Transfer Core
              </p>
              
              <div className="p-2 sm:p-2.5 bg-neutral-900 text-neutral-100 text-[10px] space-y-1.5 rounded-lg border border-neutral-800 h-32 overflow-y-auto font-mono scrollbar-none leading-relaxed">
                <div className="text-stone-400">[SYSTEM] Initializing secure SMTP Mail Delivery...</div>
                <div className="text-stone-300">[SMTP] Host identified: mail.agraharabhojanam.com</div>
                <div className="text-stone-300">[SMTP] TLS completed. Port 465 SSL Secure.</div>
                <div className="text-amber-200">[SMTP] Preparing parcel slip to: {o.customerEmail}</div>
                <div className="text-amber-200">[SMTP] Sending HTML Template "Order Invoice receipt"</div>
                <div className="text-emerald-400 font-bold">✓ [SMTP SUCCESS] Mail delivered successfully. Receipt issued.</div>
              </div>

              <p className="text-[9px] text-[#ebdcc9] italic font-sans">
                *Uses real configured merchant credentials.*
              </p>
            </div>

            {/* C. Return back home option */}
            <button
              onClick={() => {
                setActiveOrder(null);
                onClearCart();
                onChangeTab('products');
              }}
              className="w-full bg-[#fff8f0] hover:bg-black/50 text-[#c9a227] border border-[#c9a227]/20 rounded-lg py-2.5 font-sans font-bold text-center select-none text-[11px] cursor-pointer transition-all"
            >
              ← Done. Return to Heritage Store
            </button>

          </div>

        </div>
        </div>
      </div>

        {showInvoiceModal && activeOrder && (
          <div className="invoice-modal-overlay ab-invoice-overlay fixed inset-0 z-55 flex overflow-y-auto animate-fade-in">
            <div className="invoice-modal-shell ab-invoice-shell p-4 md:p-5 space-y-4 relative text-left my-auto">
              <div id="tax-invoice-printable-doc-cust" className="ab-invoice-doc">
                <div className="ab-invoice-brand-band">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <p className="ab-invoice-brand-tag mb-1">Royal Traditional Foods · Madurai</p>
                      <h3 className="ab-invoice-brand-title">Agrahara Bhojanam</h3>
                      <p className="text-[0.65rem] text-[#e8d48b]/85 mt-1 max-w-sm">
                        Temple Road, Srirangam, Madurai, Tamil Nadu 625001<br />
                        admin@agraharabhojanam.com · +91 90256 72285
                      </p>
                      <span className="ab-invoice-fssai">FSSAI 22421008000213</span>
                    </div>
                    <div className="ab-invoice-meta-box sm:text-right w-full sm:w-auto">
                      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#d4a017] mb-1">Tax Invoice</p>
                      <p className="text-[0.68rem] text-[#f5e6b8]/90 leading-relaxed font-mono">
                        No: <strong className="text-white">{activeOrder.invoiceNumber}</strong><br />
                        Date: <strong className="text-white">{new Date(activeOrder.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong><br />
                        Place of Supply: <strong className="text-white">Tamil Nadu (33)</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ab-invoice-body">
                  <div className="ab-invoice-party-grid">
                    <div className="ab-invoice-party-card">
                      <p className="ab-invoice-party-label">Bill To</p>
                      <strong className="block font-serif text-[#4a1e1e] text-sm mb-1">{activeOrder.customerName}</strong>
                      <p className="text-[0.68rem] text-[#6b5b4f] leading-relaxed">
                        {activeOrder.customerEmail}<br />
                        {activeOrder.customerPhone}
                      </p>
                    </div>
                    <div className="ab-invoice-party-card">
                      <p className="ab-invoice-party-label">Ship To</p>
                      <p className="text-[0.68rem] text-[#4a3728] whitespace-pre-wrap leading-relaxed">
                        {activeOrder.customerAddress}
                      </p>
                    </div>
                  </div>

                  <div className="ab-invoice-table-wrap">
                    <table className="ab-invoice-table">
                      <thead>
                        <tr>
                          <th className="text-center w-10">#</th>
                          <th>Item Description</th>
                          <th className="text-center w-20">HSN</th>
                          <th className="text-right w-16">Rate</th>
                          <th className="text-center w-12">Qty</th>
                          <th className="text-right w-20">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrder.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="text-center text-[#8a7568]">{idx + 1}</td>
                            <td className="ab-invoice-item-name">{it.productName}</td>
                            <td className="text-center font-mono text-[#8a7568]">21069099</td>
                            <td className="text-right font-mono">₹{it.price}</td>
                            <td className="text-center font-mono font-semibold">{it.quantity}</td>
                            <td className="text-right font-mono font-semibold">₹{it.price * it.quantity}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={4} className="text-right text-[#8a7568]">CGST (2.5% included)</td>
                          <td className="text-center">—</td>
                          <td className="text-right font-mono text-[#8a7568]">Incl.</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right text-[#8a7568]">SGST (2.5% included)</td>
                          <td className="text-center">—</td>
                          <td className="text-right font-mono text-[#8a7568]">Incl.</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right text-[#8a7568]">Shipping</td>
                          <td className="text-center">—</td>
                          <td className="text-right font-mono font-semibold text-[#1b4332]">FREE</td>
                        </tr>
                        <tr className="ab-invoice-total-row">
                          <td colSpan={4} className="text-right font-serif uppercase tracking-wide text-sm">Grand Total</td>
                          <td className="text-center">—</td>
                          <td className="text-right font-mono ab-invoice-grand">₹{activeOrder.totalPrice}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="ab-invoice-footer-grid">
                    <div className="ab-invoice-declaration">
                      <p className="font-bold text-[#4a1e1e] uppercase tracking-wide text-[0.58rem] mb-1">Declaration</p>
                      <p className="italic">
                        We certify that the particulars above are true and correct. All items are pure vegetarian,
                        handcrafted in our agraharam kitchen without preservatives.
                      </p>
                      <div className="mt-3 pt-2 border-t border-[#f0e6d8] grid grid-cols-3 gap-2 text-[0.58rem]">
                        <div>
                          <span className="text-[#8a7568] block uppercase">Status</span>
                          <span className={`ab-invoice-status-badge inline-block mt-0.5 border ${getOrderStatusBadgeClass(activeOrder.status)}`}>
                            {activeOrder.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8a7568] block uppercase">Payment</span>
                          <strong className={`block mt-0.5 ${getPaymentStatusClass(activeOrder.paymentStatus)}`}>
                            {getPaymentStatusLabel(activeOrder.paymentStatus)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#8a7568] block uppercase">Method</span>
                          <strong className="block mt-0.5 text-[#4a1e1e]">{activeOrder.paymentMethod}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
                      <div className="ab-invoice-stamp">
                        <span className="text-base">👑</span>
                        <span>Pure Veg</span>
                      </div>
                      <p className="text-[0.58rem] font-bold text-[#4a1e1e] uppercase tracking-wider mt-2">Authorized Signatory</p>
                      <p className="text-[0.55rem] text-[#8a7568]">Agrahara Bhojanam Kitchens</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ab-invoice-actions flex flex-wrap gap-2 justify-between items-center no-print">
                <span className="text-[0.65rem] text-[#8a7568] font-medium flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#1b4332]" /> Secure e-Invoice
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="ab-invoice-btn ab-invoice-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="ab-invoice-btn ab-invoice-btn-download disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Download size={13} /> {isGeneratingPDF ? 'Generating…' : 'Download PDF'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintInvoice}
                    className="ab-invoice-btn ab-invoice-btn-print flex items-center gap-1.5"
                  >
                    <Printer size={13} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </>
    );
  }

  return null;
}
