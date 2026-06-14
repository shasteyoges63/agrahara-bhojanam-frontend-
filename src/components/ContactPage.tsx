import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, CheckCircle, Clock, MessageSquare, Send } from 'lucide-react';
import { ContactMessage } from '../types';
import PurchaseMapSection from './PurchaseMapSection';

interface ContactPageProps {
  onContactSubmit: (message: Omit<ContactMessage, 'id' | 'date' | 'resolved'>) => void;
}

const CONTACT_CARDS = [
  { icon: Mail, title: 'Email Us', value: 'admin@agraharabhojanam.com', sub: 'We reply within 12 hours' },
  { icon: Phone, title: 'Call / WhatsApp', value: '+91 90256 72285', sub: 'Mon–Sat, 9 AM – 7 PM' },
  { icon: MapPin, title: 'Visit Us', value: 'Madurai, Tamil Nadu 625001', sub: 'Agraharam heritage kitchen' },
  { icon: Clock, title: 'Business Hours', value: '9:00 AM – 7:00 PM', sub: 'Sunday by appointment' },
];

export default function ContactPage({ onContactSubmit }: ContactPageProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General enquiry',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContactSubmit({
      name: form.name,
      email: form.email,
      phone: form.phone || '—',
      subject: form.subject,
      message: form.message,
    });
    setSent(true);
    setForm({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' });
  };

  return (
    <div className="animate-bloom ab-contact-page">
      <section className="ab-page-hero ab-contact-hero">
        <div className="ab-page-hero-inner">
          <span className="ab-page-hero-badge">Reach Us</span>
          <h1 className="ab-page-hero-title">Contact Us</h1>
          <p className="ab-page-hero-desc">
            Bulk orders, festival packages, or questions about our royal traditional foods — we are here for you.
          </p>
        </div>
      </section>

      <div className="ab-contact-body">
        <div className="max-w-6xl mx-auto px-4">
          <section className="ab-contact-cards-grid">
            {CONTACT_CARDS.map(card => (
              <div key={card.title} className="ab-contact-card">
                <div className="ab-contact-card-icon">
                  <card.icon size={20} />
                </div>
                <p className="ab-contact-card-label">{card.title}</p>
                <p className="ab-contact-card-value">{card.value}</p>
                <p className="ab-contact-card-sub">{card.sub}</p>
              </div>
            ))}
          </section>

          <section className="ab-contact-form-card">
            <div className="ab-contact-form-aside">
              <div className="space-y-6">
                <div>
                  <div className="ab-contact-aside-icon">
                    <MessageSquare size={26} />
                  </div>
                  <h2 className="ab-contact-aside-title">Send a Message</h2>
                  <p className="ab-contact-aside-desc">
                    Fill in the form and our team will respond with care — just as we prepare every product.
                  </p>
                </div>
                <div>
                  <p className="ab-contact-aside-social-label">Follow our journey</p>
                  <div className="flex gap-2.5">
                    {[
                      { Icon: Instagram, href: '#' },
                      { Icon: Facebook, href: '#' },
                      { Icon: Youtube, href: '#' },
                    ].map(({ Icon, href }, i) => (
                      <a key={i} href={href} className="ab-contact-social-btn" aria-label="Social link">
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <p className="ab-contact-aside-quote hidden lg:block">
                &quot;From our agraharam kitchen to your heart.&quot;
              </p>
            </div>

            <div className="ab-contact-form-panel">
              {sent ? (
                <div className="ab-contact-success text-center space-y-4 py-8">
                  <CheckCircle className="mx-auto text-[#c9a227]" size={56} />
                  <h3 className="text-xl font-serif font-bold text-white">Message Sent!</h3>
                  <p className="text-white/85 text-sm max-w-sm mx-auto">
                    Thank you for reaching out. We will get back to you within 12 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="ab-contact-submit-btn mt-2 px-8 py-2.5 rounded-full text-sm font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="ab-contact-form-label">Your Name</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="ab-contact-input"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="ab-contact-form-label">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="ab-contact-input"
                        placeholder="+91 ..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="ab-contact-form-label">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="ab-contact-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="ab-contact-form-label">Subject</label>
                    <input
                      required
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="ab-contact-input"
                    />
                  </div>
                  <div>
                    <label className="ab-contact-form-label">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="ab-contact-input ab-contact-textarea"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className="ab-contact-submit-btn ab-contact-submit-btn-full">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </section>

          <PurchaseMapSection variant="contact" embedded showKitchenMarker />
        </div>
      </div>
    </div>
  );
}
