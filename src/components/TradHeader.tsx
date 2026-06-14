import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, ChevronDown, Menu, X, LogOut, Search } from 'lucide-react';
import { SHOP_CATEGORIES } from '../data/siteContent';

interface TradHeaderProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onShopCategory: (category: string) => void;
  cartCount: number;
  customerName: string | null;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onLogoutCustomer: () => void;
  onOpenCart: () => void;
}

export default function TradHeader({
  currentTab,
  onChangeTab,
  onShopCategory,
  cartCount,
  customerName,
  onLoginClick,
  onSignUpClick,
  onLogoutCustomer,
  onOpenCart,
}: TradHeaderProps) {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const navClass = (tab: string) =>
    currentTab === tab ? 'ab-header-nav ab-header-nav-active' : 'ab-header-nav';

  const pickCategory = (category: string) => {
    setShopOpen(false);
    setMobileOpen(false);
    setAccountOpen(false);
    onShopCategory(category);
  };

  useEffect(() => {
    if (!shopOpen && !accountOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (shopOpen && shopMenuRef.current && !shopMenuRef.current.contains(target)) {
        setShopOpen(false);
      }
      if (accountOpen && accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setAccountOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShopOpen(false);
        setAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [shopOpen, accountOpen]);

  return (
    <header className="ab-site-header fixed top-0 left-0 right-0 w-full z-[150] backdrop-blur-md shadow-sm no-print animate-header-enter isolate">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-[76px] gap-4">
          <button onClick={() => onChangeTab('home')} className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-full bg-[#5c1a1b] border-2 border-[#c9a227] flex items-center justify-center text-[#f5e6b8] font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
              AB
            </div>
            <div className="hidden sm:block text-left">
              <p className="ab-header-brand-title font-serif font-bold text-base md:text-lg leading-tight">Agrahara Bhojanam</p>
              <p className="ab-header-brand-sub text-[10px] tracking-[0.15em] uppercase font-semibold">Royal Traditional Kitchen</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => onChangeTab('home')} className={`pb-1 ${navClass('home')}`}>Home</button>
            <button onClick={() => onChangeTab('about')} className={`pb-1 ${navClass('about')}`}>About Us</button>

            <div className="relative" ref={shopMenuRef}>
              <button
                type="button"
                aria-expanded={shopOpen}
                aria-haspopup="true"
                onClick={() => {
                  setAccountOpen(false);
                  setShopOpen((open) => !open);
                }}
                className={`flex items-center gap-1 pb-1 ${navClass('products')} ${shopOpen ? 'text-[#5c1a1b]' : ''}`}
              >
                Categories
                <ChevronDown size={14} className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopOpen && (
                <div className="absolute top-full left-0 pt-2 z-[200] min-w-[14rem]">
                  <div className="ab-header-dropdown shadow-2xl py-1.5">
                    <button
                      type="button"
                      onClick={() => pickCategory('All')}
                      className="ab-header-dropdown-item block w-full text-left px-4 py-2.5 text-sm font-medium"
                    >
                      All Products
                    </button>
                    {SHOP_CATEGORIES.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => pickCategory(c.name)}
                        className="ab-header-dropdown-item block w-full text-left px-4 py-2.5 text-sm"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => onChangeTab('contact')} className={`pb-1 ${navClass('contact')}`}>Contact Us</button>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => onChangeTab('products')}
              className="ab-header-icon hidden md:flex p-2 transition-colors"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>

            <button onClick={onOpenCart} className="ab-header-icon relative p-2 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#c9a227] text-[#3d1011] text-[10px] font-bold rounded-full flex items-center justify-center border border-[#5c1a1b]/20">
                  {cartCount}
                </span>
              )}
            </button>

            {customerName ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  aria-expanded={accountOpen}
                  onClick={() => {
                    setShopOpen(false);
                    setAccountOpen((open) => !open);
                  }}
                  className="ab-header-link flex items-center gap-1.5 text-sm font-medium px-1"
                >
                  <User size={18} />
                  <span className="hidden sm:inline max-w-[120px] truncate">{customerName.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full pt-2 z-[200] min-w-[11rem]">
                    <div className="ab-header-dropdown shadow-2xl py-1">
                    <button
                      onClick={() => { onChangeTab('cart'); setAccountOpen(false); }}
                      className="ab-header-dropdown-item block w-full text-left px-4 py-2.5 text-sm"
                    >
                      My Cart
                    </button>
                    <button
                      onClick={() => { onChangeTab('checkout'); setAccountOpen(false); }}
                      className="ab-header-dropdown-item block w-full text-left px-4 py-2.5 text-sm"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => { onLogoutCustomer(); setAccountOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={onLoginClick} className="ab-header-link hidden md:block text-sm font-medium">
                  Login
                </button>
                <button onClick={onSignUpClick} className="hidden md:block ab-btn-primary px-5 py-2 text-sm font-semibold">
                  Sign Up
                </button>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="ab-header-icon lg:hidden p-2">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="ab-site-mobile-menu lg:hidden px-4 py-4 space-y-1">
          <button onClick={() => { onChangeTab('home'); setMobileOpen(false); }} className="ab-header-mobile-link block w-full text-left py-2.5 font-medium">Home</button>
          <button onClick={() => { onChangeTab('about'); setMobileOpen(false); }} className="ab-header-mobile-link block w-full text-left py-2.5 font-medium">About Us</button>
          <p className="ab-header-brand-sub text-xs uppercase tracking-wider pt-2 px-1 font-semibold">Categories</p>
          <button
            type="button"
            onClick={() => pickCategory('All')}
            className="ab-header-mobile-muted block w-full text-left py-2 pl-3 text-sm font-medium"
          >
            All Products
          </button>
          {SHOP_CATEGORIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => pickCategory(c.name)}
              className="ab-header-mobile-muted block w-full text-left py-2 pl-3 text-sm"
            >
              {c.name}
            </button>
          ))}
          <button onClick={() => { onChangeTab('contact'); setMobileOpen(false); }} className="ab-header-mobile-link block w-full text-left py-2.5 font-medium">Contact Us</button>
          {customerName ? (
            <>
              <p className="ab-header-brand-sub text-xs uppercase tracking-wider pt-2 px-1 font-semibold">Account</p>
              <button onClick={() => { onChangeTab('cart'); setMobileOpen(false); }} className="ab-header-mobile-link block w-full text-left py-2.5 font-medium">
                Hi, {customerName}
              </button>
              <button onClick={() => { onChangeTab('checkout'); setMobileOpen(false); }} className="ab-header-mobile-muted block w-full text-left py-2 pl-3 text-sm">
                Checkout
              </button>
              <button
                onClick={() => { onLogoutCustomer(); setMobileOpen(false); }}
                className="ab-header-mobile-link block w-full text-left py-2.5 font-semibold text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { onLoginClick(); setMobileOpen(false); }} className="ab-header-mobile-link block w-full text-left py-2.5 font-semibold">
                Login
              </button>
              <button onClick={() => { onSignUpClick(); setMobileOpen(false); }} className="ab-header-mobile-muted block w-full text-left py-2 pl-3 text-sm font-semibold">
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
