import React, { useState, useEffect } from 'react';
import { DEFAULT_PRODUCTS } from './data/defaultProducts';
import { normalizeProductImages } from './data/productImages';
import { Product, CartItem, Order, ContactMessage } from './types';
import TradHeader from './components/TradHeader';
import TradFooter from './components/TradFooter';
import PublicPages from './components/PublicPages';
import CustomerPages from './components/CustomerPages';
import CartDrawer from './components/CartDrawer';
import { api } from './api/client';

const PRODUCT_SCREEN_TABS = ['product-details', 'product-preview', 'product-reviews'] as const;

function readStoredProductId(): string | null {
  try {
    const raw = localStorage.getItem('ab_selected_product_id');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function findProductById(catalog: Product[], id: string | null): Product | null {
  if (!id) return null;
  return catalog.find(p => p.id === id) ?? null;
}

export default function App() {
  const getStored = <T,>(key: string, defaultValue: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Local storage sync error: ', e);
    }
  };

  const [currentTab, setCurrentTab] = useState<string>(() => {
    const tab = getStored<string>('ab_current_tab', 'home');
    if (!PRODUCT_SCREEN_TABS.includes(tab as (typeof PRODUCT_SCREEN_TABS)[number])) return tab;
    return findProductById(DEFAULT_PRODUCTS, readStoredProductId()) ? tab : 'products';
  });
  const [shopCategory, setShopCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [apiOffline, setApiOffline] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(getStored<CartItem[]>('ab_cart', []));
  const [customerUser, setCustomerUser] = useState<{ id: string; name: string; email: string; phone: string; address?: string } | null>(
    getStored('ab_customer_user', null)
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const tab = getStored<string>('ab_current_tab', 'home');
    if (!PRODUCT_SCREEN_TABS.includes(tab as (typeof PRODUCT_SCREEN_TABS)[number])) return null;
    return findProductById(DEFAULT_PRODUCTS, readStoredProductId());
  });
  const [returnTab, setReturnTab] = useState('home');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const loadProducts = () => {
    return api.getProducts()
      .then((data) => {
        setApiOffline(false);
        setProducts(normalizeProductImages(data));
      })
      .catch(() => {
        setApiOffline(true);
        setProducts((prev) => (prev.length > 0 ? prev : DEFAULT_PRODUCTS));
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const refreshTabs = ['home', 'products', 'product-details', 'product-preview', 'product-reviews'];
    if (!refreshTabs.includes(currentTab)) return;
    loadProducts();
  }, [currentTab]);

  useEffect(() => {
    const onFocus = () => loadProducts();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const fresh = findProductById(products, selectedProduct.id);
    if (fresh) setSelectedProduct(fresh);
  }, [products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!PRODUCT_SCREEN_TABS.includes(currentTab as (typeof PRODUCT_SCREEN_TABS)[number])) {
      setStored('ab_current_tab', currentTab);
    }
  }, [currentTab]);
  useEffect(() => { setStored('ab_cart', cart); }, [cart]);
  useEffect(() => { setStored('ab_customer_user', customerUser); }, [customerUser]);

  useEffect(() => {
    if (!PRODUCT_SCREEN_TABS.includes(currentTab as (typeof PRODUCT_SCREEN_TABS)[number])) return;
    if (selectedProduct) return;

    const savedId = readStoredProductId();
    const found = findProductById(products, savedId);
    if (found) {
      setSelectedProduct(found);
      return;
    }

    setCurrentTab('products');
  }, [currentTab, products, selectedProduct]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    localStorage.removeItem('ab_selected_product_id');
  };

  const rememberSelectedProduct = (product: Product) => {
    setStored('ab_selected_product_id', product.id);
    setSelectedProduct(product);
  };

  const navigate = (tab: string) => {
    clearSelectedProduct();
    setCurrentTab(tab);
  };

  const goToShop = (category: string) => {
    setShopCategory(category);
    clearSelectedProduct();
    setActiveOrder(null);
    setCurrentTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product | null) => {
    if (product) {
      const fresh = findProductById(products, product.id) ?? product;
      rememberSelectedProduct(fresh);
      setCurrentTab('product-details');
      api.getProduct(product.id)
        .then((latest) => {
          setProducts((prev) => prev.map((p) => (p.id === latest.id ? normalizeProductImages([latest])[0] : p)));
          setSelectedProduct(normalizeProductImages([latest])[0]);
          setApiOffline(false);
        })
        .catch(() => {
          /* keep catalog copy when single-product fetch fails */
        });
      return;
    }
    clearSelectedProduct();
    setCurrentTab('products');
  };

  const handlePreviewProduct = (product: Product) => {
    setReturnTab(currentTab);
    rememberSelectedProduct(product);
    setCurrentTab('product-preview');
  };

  const handleReviewProduct = (product: Product) => {
    setReturnTab(currentTab);
    rememberSelectedProduct(product);
    setCurrentTab('product-reviews');
  };

  const handleBackFromProductScreen = () => {
    clearSelectedProduct();
    setCurrentTab(returnTab);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const update = [...prev];
        update[idx].quantity += 1;
        return update;
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => setCart([]);

  const handleContactSubmit = (msg: Omit<ContactMessage, 'id' | 'date' | 'resolved'>) => {
    api.createContactMessage(msg).catch(e => console.error('Failed to submit contact message', e));
  };

  const handleLoginCustomer = async (
    user: { name: string; email: string; phone: string; address?: string },
    isRegistering: boolean
  ) => {
    const saved = isRegistering ? await api.registerUser(user) : await api.loginUser(user);
    setCustomerUser({
      id: saved.id,
      name: saved.name,
      email: saved.email,
      phone: saved.phone,
      address: saved.address,
    });
  };

  const handleLogoutCustomer = () => {
    setCustomerUser(null);
    setCart([]);
    setCurrentTab('home');
  };

  const handlePlaceOrder = async (form: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: 'UPI' | 'COD' | 'WhatsAppLink';
    notes?: string;
  }): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      customerId: customerUser?.id,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      customerAddress: form.customerAddress,
      totalPrice: subtotal,
      orderDate: new Date().toISOString(),
      status: 'Pending',
      paymentMethod: form.paymentMethod,
      paymentStatus: form.paymentMethod === 'UPI' ? 'Completed' : 'Pending',
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      whatsappSent: false,
      emailSent: false,
      notes: form.notes,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        costPrice: item.product.costPrice || Math.floor(item.product.price * 0.45)
      }))
    };

    const savedOrder = await api.createOrder(newOrder);
    const updatedProducts = await api.getProducts();
    setProducts(normalizeProductImages(updatedProducts));
    setCart([]);
    return savedOrder;
  };

  return (
    <div className="ab-app-shell min-h-screen flex flex-col text-[#2c1810] relative">
      <div className="relative z-10 flex flex-col min-h-screen flex-1">
      <TradHeader
        currentTab={currentTab}
        onChangeTab={navigate}
        onShopCategory={goToShop}
        cartCount={cartCount}
        customerName={customerUser?.name || null}
        onLoginClick={() => { setAuthMode('login'); navigate('customer-login'); }}
        onSignUpClick={() => { setAuthMode('register'); navigate('customer-login'); }}
        onLogoutCustomer={handleLogoutCustomer}
        onOpenCart={() => setCartOpen(true)}
      />

      {apiOffline && (
        <div className="relative z-20 bg-[#5c1a1b] border-b border-[#c9a227]/40 text-[#f5e6b8] text-center text-xs py-2 px-4">
          Store is offline — showing saved sample products. Start the database and API to see admin products:{' '}
          <code className="font-mono">cd backend; npm run dev</code>
        </div>
      )}

      <main className="flex-1 w-full">
        {['home', 'about', 'products', 'product-details', 'product-preview', 'product-reviews', 'contact', 'privacy-policy', 'refund-policy', 'shipping'].includes(currentTab) && (
          <PublicPages
            currentTab={currentTab}
            onChangeTab={navigate}
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
            onPreviewProduct={handlePreviewProduct}
            onReviewProduct={handleReviewProduct}
            onBackFromProductScreen={handleBackFromProductScreen}
            onAddToCart={handleAddToCart}
            onContactSubmit={handleContactSubmit}
            shopCategory={shopCategory}
            onShopCategoryChange={setShopCategory}
          />
        )}

        {['customer-login', 'cart', 'checkout', 'order-confirmation'].includes(currentTab) && (
          <CustomerPages
            currentTab={currentTab}
            onChangeTab={navigate}
            cart={cart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            activeOrder={activeOrder}
            setActiveOrder={setActiveOrder}
            customerUser={customerUser}
            authMode={authMode}
            onLoginCustomer={handleLoginCustomer}
          />
        )}
      </main>

      <TradFooter onChangeTab={navigate} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onViewCart={() => {
          setCartOpen(false);
          navigate('cart');
        }}
        onContinueShopping={() => {
          setCartOpen(false);
          navigate('products');
        }}
        onCheckout={() => {
          setCartOpen(false);
          navigate('checkout');
        }}
      />
      </div>
    </div>
  );
}
