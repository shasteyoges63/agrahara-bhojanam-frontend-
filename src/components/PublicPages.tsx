import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, ShieldCheck, Sparkles, ShoppingBag, ArrowLeft, Eye } from 'lucide-react';
import { Product, ContactMessage } from '../types';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import ProductCard from './ProductCard';
import ProductReviewsPage from './ProductReviewsPage';
import WishlistButton from './WishlistButton';
import CategoriesSection from './CategoriesSection';

interface PublicPagesProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  onPreviewProduct: (product: Product) => void;
  onReviewProduct: (product: Product) => void;
  onBackFromProductScreen: () => void;
  onAddToCart: (product: Product) => void;
  onContactSubmit: (message: Omit<ContactMessage, 'id' | 'date' | 'resolved'>) => void;
  shopCategory: string;
  onShopCategoryChange: (cat: string) => void;
}

export default function PublicPages({
  currentTab,
  onChangeTab,
  products,
  selectedProduct,
  onSelectProduct,
  onPreviewProduct,
  onReviewProduct,
  onBackFromProductScreen,
  onAddToCart,
  onContactSubmit,
  shopCategory,
  onShopCategoryChange,
}: PublicPagesProps) {
  const enabledProducts = products.filter(p => p.enabled);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const selectedCategory = shopCategory;
  const setSelectedCategory = onShopCategoryChange;

  const filteredProducts = enabledProducts
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  if (sortBy === 'price-low') filteredProducts.sort((a,b) => a.price - b.price);
  if (sortBy === 'price-high') filteredProducts.sort((a,b) => b.price - a.price);

  const categories = ['All', 'Podi Varieties', 'Pickle Varieties', 'Porridge Mix', 'Instant Mix', 'Vathal Varieties'];

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedProduct?.id]);

  if (currentTab === 'home') {
    return (
      <HomePage
        products={products}
        onChangeTab={onChangeTab}
        onShopCategory={(cat) => { onShopCategoryChange(cat); onChangeTab('products'); }}
        onSelectProduct={onSelectProduct}
        onPreviewProduct={onPreviewProduct}
        onReviewProduct={onReviewProduct}
        onAddToCart={onAddToCart}
      />
    );
  }

  // 2. ABOUT US VIEW
  if (currentTab === 'about') {
    return (
      <AboutPage
        onShopCategory={(cat) => { onShopCategoryChange(cat); onChangeTab('products'); }}
      />
    );
  }

  // 3. PRODUCTS MARKETPLACE VIEW
  if (currentTab === 'products') {
    return (
      <div className="animate-bloom">
        <section className="ab-page-hero mb-0">
          <div className="ab-page-hero-inner">
            <span className="ab-page-hero-badge">Royal Shop</span>
            <h1 className="ab-page-hero-title">Our Categories &amp; Products</h1>
            <p className="ab-page-hero-desc">Browse authentic collections from our Madurai kitchen</p>
          </div>
        </section>

        <CategoriesSection
          onSelectCategory={setSelectedCategory}
          variant="shop"
          title="Browse by Category"
          subtitle="Select a royal collection to explore"
        />

        <div className="max-w-7xl mx-auto px-4 pb-16 space-y-8">
          <div className="ab-section-panel rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-[#c9a227]/20">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#5c1a1b]">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                </h2>
                <p className="text-sm text-[#6b5b4f] mt-1">{filteredProducts.length} items available</p>
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b5b4f]" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 ab-input rounded-full"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 ab-input rounded-full text-sm"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#5c1a1b] text-[#f5e6b8] border border-[#c9a227]/40 shadow-md'
                      : 'bg-[#fff8f0] border border-[#c9a227]/25 text-[#4a3728] hover:border-[#c9a227] hover:text-[#5c1a1b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  onPreview={onPreviewProduct}
                  onReview={onReviewProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 ab-card rounded-2xl">
                <p className="text-[#6b5b4f]">No products found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. PRODUCT PREVIEW VIEW
  if (currentTab === 'product-preview') {
    if (!selectedProduct) return null;
    const p = selectedProduct;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-bloom">
        <div className="ab-section-panel rounded-2xl p-6 md:p-10 space-y-8 my-4">
          <button type="button" onClick={onBackFromProductScreen} className="ab-back-link">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="text-center space-y-2">
            <span className="ab-royal-badge">Product Preview</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#5c1a1b] mt-3">{p.name}</h2>
          </div>

          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#c9a227]/25 shadow-xl bg-[#fff8f0]">
            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 px-3 py-1 bg-[#5c1a1b]/90 rounded-full text-[#f5e6b8] text-[10px] font-bold uppercase tracking-wider border border-[#c9a227]/40">
              {p.category}
            </span>
          </div>

          <div className="text-center space-y-3">
            <p className="text-3xl font-bold font-serif text-[#c9a227]">₹{p.price.toFixed(2)}</p>
            {p.weight && <p className="text-sm text-[#6b5b4f]">Weight: {p.weight}</p>}
            <div className="ab-card rounded-xl p-5 text-left max-w-2xl mx-auto space-y-2">
              <h4 className="font-serif font-bold text-[#c9a227] text-sm uppercase">Product Description</h4>
              <p className="text-base text-[#4a3728] leading-relaxed whitespace-pre-line">
                {p.description?.trim() || 'Description will be updated soon.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="ab-card rounded-xl p-4 space-y-2">
              <h4 className="font-serif font-bold text-[#c9a227] text-sm uppercase">Traditional Benefit</h4>
              <p className="text-xs text-[#6b5b4f]">{p.traditionalBenefit || 'Homemade with pure ingredients, no preservatives.'}</p>
            </div>
            <div className="ab-card rounded-xl p-4 space-y-2">
              <h4 className="font-serif font-bold text-[#c9a227] text-sm uppercase">Ingredients</h4>
              <p className="text-xs text-[#6b5b4f]">{(p.ingredients || []).join(', ') || 'Native spices, organic ingredients.'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button type="button" onClick={() => onAddToCart(p)} className="flex-1 flex items-center justify-center gap-2 ab-btn-primary py-3 rounded-full text-sm font-semibold">
              <ShoppingBag size={18} /> Add to cart
            </button>
            <button type="button" onClick={() => onSelectProduct(p)} className="flex-1 ab-btn-outline py-3 rounded-full text-sm font-semibold">
              View Full Details
            </button>
            <button type="button" onClick={() => onReviewProduct(p)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold ab-card text-[#5c1a1b] hover:border-[#c9a227] transition-colors">
              <Star size={16} /> See Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. PRODUCT REVIEWS VIEW
  if (currentTab === 'product-reviews') {
    if (!selectedProduct) return null;
    return (
      <ProductReviewsPage
        product={selectedProduct}
        onBack={onBackFromProductScreen}
        onAddToCart={onAddToCart}
        onPreview={onPreviewProduct}
      />
    );
  }

  // 6. PRODUCT DETAILS VIEW
  if (currentTab === 'product-details') {
    if (!selectedProduct) return null;
    const p = selectedProduct;

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-bloom">
        <div className="ab-section-panel rounded-2xl p-6 md:p-10 space-y-8 my-4">
        <button onClick={() => onChangeTab('products')} className="ab-back-link">
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="relative h-[500px] rounded-[2rem] overflow-hidden border-2 border-[#c9a227]/25 group shadow-xl bg-[#fff8f0]">
               <img 
                 src={p.images[activeImageIdx]} 
                 alt={p.name} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-6 left-6 flex gap-2">
                 <span className="px-4 py-1.5 bg-[#5c1a1b]/90 rounded-full text-[#f5e6b8] text-[10px] font-bold uppercase tracking-widest border border-[#c9a227]/40">
                   {p.category}
                 </span>
                 <span className="px-4 py-1.5 bg-white/90 rounded-full text-[#5c1a1b] text-[10px] font-bold uppercase tracking-widest border border-[#c9a227]/30">
                   Pure &amp; Homemade
                 </span>
               </div>
            </div>

            {p.images.length > 1 && (
               <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                  {p.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 ${
                        activeImageIdx === i ? 'border-[#c9a227] bg-[#fff8f0]' : 'border-[#c9a227]/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover rounded-lg" alt="" />
                    </button>
                  ))}
               </div>
            )}
          </div>

          <div className="space-y-8 py-4">
             <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#5c1a1b] leading-tight">{p.name}</h2>
                <div className="flex flex-wrap items-center gap-6">
                   <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-serif text-[#c9a227]">₹ {p.price}</span>
                      <span className="text-xs text-[#6b5b4f]">M.R.P. inclusive of taxes</span>
                   </div>
                   <div className="flex items-center gap-1 text-[#c9a227]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      <span className="text-xs text-[#6b5b4f] ml-1">(4.9/5)</span>
                   </div>
                </div>
             </div>

             <div className="space-y-6 text-[#4a3728] leading-relaxed">
                <div className="ab-card rounded-2xl p-5 md:p-6 space-y-3">
                  <h3 className="font-serif font-bold text-[#c9a227] text-sm uppercase tracking-wider">Product Description</h3>
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {p.description?.trim() || 'Description will be updated soon.'}
                  </p>
                  {p.weight && (
                    <p className="text-sm text-[#6b5b4f]">
                      <span className="font-semibold text-[#5c1a1b]">Weight:</span> {p.weight}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {p.traditionalBenefit?.trim() && (
                     <div className="p-4 ab-card rounded-2xl space-y-2">
                       <h4 className="font-serif font-bold text-[#c9a227] text-sm uppercase">Traditional Benefit</h4>
                       <p className="text-xs text-[#6b5b4f]">{p.traditionalBenefit}</p>
                     </div>
                   )}
                   {(p.ingredients || []).length > 0 && (
                     <div className="p-4 ab-card rounded-2xl space-y-2">
                       <h4 className="font-serif font-bold text-[#c9a227] text-sm uppercase">Pure Ingredients</h4>
                       <p className="text-xs text-[#6b5b4f]">{p.ingredients!.join(', ')}</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="pt-6 border-t border-[#c9a227]/20 flex flex-col sm:flex-row items-center gap-4">
                 <button 
                  onClick={() => onAddToCart(p)}
                  className="w-full sm:w-auto px-10 py-4 ab-btn-primary rounded-full font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-3"
                 >
                   Add to Cart <ShoppingBag size={20}/>
                 </button>
                 <WishlistButton productId={p.id} />
             </div>

             <div className="pt-8 grid grid-cols-3 gap-4 border-t border-[#c9a227]/20">
                <div className="text-center space-y-1">
                   <Clock size={20} className="mx-auto text-[#c9a227]" />
                   <p className="text-[10px] uppercase font-bold text-[#6b5b4f]">Fast Shipping</p>
                </div>
                <div className="text-center space-y-1">
                   <ShieldCheck size={20} className="mx-auto text-[#c9a227]" />
                   <p className="text-[10px] uppercase font-bold text-[#6b5b4f]">Secure Pay</p>
                </div>
                <div className="text-center space-y-1">
                   <Sparkles size={20} className="mx-auto text-[#c9a227]" />
                   <p className="text-[10px] uppercase font-bold text-[#6b5b4f]">Native Pure</p>
                </div>
             </div>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // 5. CONTACT VIEW
  if (currentTab === 'contact') {
    return <ContactPage onContactSubmit={onContactSubmit} />;
  }

  // 6. POLICY VIEWS (Minimalist)
  if (currentTab === 'privacy-policy' || currentTab === 'refund-policy' || currentTab === 'shipping') {
    const isPrivacy = currentTab === 'privacy-policy';
    const isRefund = currentTab === 'refund-policy';
    const isShipping = currentTab === 'shipping';

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-bloom ab-section-panel p-8 md:p-12 rounded-2xl my-4">
         <div className="ab-section-heading text-left mb-8">
            <h2>
               {isPrivacy && 'Privacy Policy'}
               {isRefund && 'Terms & Refund Policy'}
               {isShipping && 'Shipping Policy'}
            </h2>
            <p>Last Updated: May 2026</p>
         </div>
         
         <div className="space-y-8 text-[#4a3728] text-sm leading-relaxed">
            {isPrivacy && (
              <>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Data Collection</h4>
                   <p>We only collect your name, email, and shipping address to fulfill your orders. Your data is handled securely and used only for order processing.</p>
                </section>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Transaction Security</h4>
                   <p>We do not store card details. All UPI and COD payments are processed securely through our confirmation workflow.</p>
                </section>
              </>
            )}
            
            {isRefund && (
              <>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Product Integrity</h4>
                   <p>As our products are perishable traditional foods, we cannot accept returns once the seal is broken due to hygiene standards.</p>
                </section>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Damaged Parcel Promise</h4>
                   <p>If your package arrives damaged during transit, take a photo and contact us on WhatsApp. We will arrange a replacement or credit.</p>
                </section>
              </>
            )}

            {isShipping && (
              <>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Dispatch</h4>
                   <p>We ship all items within 24–48 hours of preparation. Parcels are packed with care to ensure freshness during transit.</p>
                </section>
                <section className="space-y-3">
                   <h4 className="font-bold text-[#c9a227] uppercase tracking-widest text-xs">Delivery Timeline</h4>
                   <p>Standard shipping takes 3–5 business days across India. Express delivery is available for Madurai and nearby areas (1–2 days).</p>
                </section>
              </>
            )}
         </div>

         <button onClick={() => onChangeTab('home')} className="mt-8 ab-back-link">
           Return to Home
         </button>
      </div>
    );
  }

  return (
    <div className="text-center py-20 px-4">
      <p className="text-[#5c1a1b] font-serif text-lg">Loading...</p>
    </div>
  );
}
