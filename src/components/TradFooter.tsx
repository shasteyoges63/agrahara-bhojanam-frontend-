import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { STORE_WHATSAPP_DISPLAY } from '../constants/contact';

interface TradFooterProps {
  onChangeTab: (tab: string) => void;
}

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:3001';

export default function TradFooter({ onChangeTab }: TradFooterProps) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert('Thank you for subscribing! We will keep you updated.');
      setEmail('');
    }
  };

  return (
    <footer className="ab-site-footer no-print">
      {/* Newsletter — lighter maroon band */}
      <div className="ab-footer-newsletter">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          <h3 className="ab-footer-newsletter-title text-center md:text-left shrink-0">
            Be Always Updated With Us
          </h3>
          <form
            onSubmit={handleSubscribe}
            className="flex w-full md:w-auto md:min-w-[22rem] lg:min-w-[26rem] gap-2.5"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="ab-footer-email-input"
              required
            />
            <button type="submit" className="ab-footer-subscribe-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer — deep royal maroon */}
      <div className="ab-footer-main">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="ab-footer-logo-ring">AB</div>
                <h3 className="ab-footer-brand-name">Agrahara Bhojanam</h3>
              </div>
              <p className="ab-footer-desc max-w-sm">
                Authentic Brahmin traditional foods from Madurai — royal recipes passed through agraharam generations, crafted with purity and devotion.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="ab-footer-heading">Quick Links</h4>
              <ul className="space-y-2.5">
                <li><button type="button" onClick={() => onChangeTab('about')} className="ab-footer-link cursor-pointer">About</button></li>
                <li><button type="button" onClick={() => onChangeTab('contact')} className="ab-footer-link cursor-pointer">Contact</button></li>
                <li><button type="button" onClick={() => onChangeTab('refund-policy')} className="ab-footer-link cursor-pointer">Terms and Conditions</button></li>
                <li><button type="button" onClick={() => onChangeTab('privacy-policy')} className="ab-footer-link cursor-pointer">Privacy Policy</button></li>
                <li><a href={ADMIN_URL} target="_blank" rel="noopener noreferrer" className="ab-footer-link">Admin Panel</a></li>
              </ul>
            </div>

            {/* Locate Us */}
            <div>
              <h4 className="ab-footer-heading">Locate Us</h4>
              <ul className="space-y-3">
                <li className="flex gap-2.5 ab-footer-link items-start">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-[#d4a017]" />
                  <span>Madurai, Tamil Nadu 625001</span>
                </li>
                <li className="flex gap-2.5 ab-footer-link items-center">
                  <Phone size={16} className="shrink-0 text-[#d4a017]" />
                  <span>{STORE_WHATSAPP_DISPLAY}</span>
                </li>
                <li className="flex gap-2.5 ab-footer-link items-center">
                  <Mail size={16} className="shrink-0 text-[#d4a017]" />
                  <span>admin@agraharabhojanam.com</span>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="ab-footer-heading">Follow Us</h4>
              <div className="flex gap-3">
                <a href="#" className="ab-footer-social" aria-label="Instagram"><Instagram size={17} /></a>
                <a href="#" className="ab-footer-social" aria-label="Facebook"><Facebook size={17} /></a>
                <a href="#" className="ab-footer-social" aria-label="YouTube"><Youtube size={17} /></a>
              </div>
            </div>
          </div>

          <div className="ab-footer-copyright-bar">
            © Copyright 2026. All Rights Reserved. <strong>Agrahara Bhojanam</strong> — From Our Kitchen To Your Heart
          </div>
        </div>
      </div>
    </footer>
  );
}
