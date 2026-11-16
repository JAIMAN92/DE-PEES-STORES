import React from 'react';
import {
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Heart,
  MessageCircle,
  Star,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

export const HomePage: React.FC = () => {
  const { products, categories, settings, navigateTo, setCategoryFilter } = useStore();

  const featuredProducts = products.filter((p) => p.is_featured && p.is_published).slice(0, 4);
  const latestArrivals = products.filter((p) => p.is_latest && p.is_published).slice(0, 4);

  const handleCategoryClick = (slug: string) => {
    setCategoryFilter(slug);
    navigateTo('shop');
  };

  const renderCategorySvg = (slug: string) => {
    switch (slug) {
      case 'childrens-shoes':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5a2.5 2.5 0 0 0-1.8-2.4l-4.4-1.3L11 8H7.5a2 2 0 0 0-1.9 1.4L4 16Z" />
            <path d="M4 17h16" />
          </svg>
        );
      case 'childrens-school-bags':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Z" />
            <path d="M9 6V4a3 3 0 0 1 6 0v2" />
            <path d="M8 14h8" />
            <path d="M9 17h6" />
          </svg>
        );
      case 'childrens-lunch-boxes':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <rect x="3" y="8" width="18" height="12" rx="3" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            <path d="M3 13h18" />
          </svg>
        );
      case 'childrens-clothing-fashion':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M8 4h8l3 4-3 2v10H8V10L5 8l3-4Z" />
            <path d="M10 4a2 2 0 0 0 4 0" />
          </svg>
        );
      case 'baby-newborn-care-essentials':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" />
            <circle cx="12" cy="12" r="1.5" />
          </svg>
        );
      case 'womens-fashion-accessories':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M5 9h14l-1.5 11h-11L5 9Z" />
            <path d="M9 9V7a3 3 0 0 1 6 0v2" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
            <path d="M6 7h12l1 13H5L6 7Z" />
            <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-24 md:pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F8]/80 via-white to-[#F0FDFA]/60 border-b border-pink-100/60 pt-8 pb-12 sm:pt-16 sm:pb-24">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              {/* Brand Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-amber-200/80 shadow-2xs text-[11px] sm:text-xs font-semibold tracking-wide text-amber-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#D4AF37]" aria-hidden="true">
                  <path d="M3 18h18" />
                  <path d="M5 15l2-9 5 4 5-4 2 9H5Z" />
                </svg>
                <span>DE-PEES BABY & MOTHER CARE · PORT HARCOURT</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A8A] tracking-tight leading-[1.2] text-balance">
                {settings.hero_headline}
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {settings.hero_supporting_text}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  onClick={() => navigateTo('shop')}
                  className="w-full sm:w-auto min-h-[48px] py-3.5 px-8 rounded-xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-[#DB2777] via-[#BE185D] to-[#1E3A8A] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>SHOP NOW</span>
                </button>

                <button
                  onClick={() => navigateTo('contact')}
                  className="w-full sm:w-auto min-h-[48px] py-3.5 px-8 rounded-xl font-semibold text-xs sm:text-sm tracking-wide bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A]/20 hover:border-[#1E3A8A] transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>CONTACT US</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left">
                <div>
                  <div className="text-sm sm:text-xl font-bold text-[#1E3A8A]">100% Genuine</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Quality Assured</div>
                </div>
                <div>
                  <div className="text-sm sm:text-xl font-bold text-[#DB2777]">Port Harcourt</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">Fast Local Delivery</div>
                </div>
                <div>
                  <div className="text-sm sm:text-xl font-bold text-[#D4AF37]">Nationwide</div>
                  <div className="text-[10px] sm:text-xs text-slate-500">All 36 States</div>
                </div>
              </div>
            </div>

            {/* Right Visual Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-pink-100/80">
                {/* Brand Showcase Emblem */}
                <div className="relative text-center py-5 sm:py-6 px-3 sm:px-4 bg-gradient-to-b from-[#FDF2F8] to-[#FFFBEB] rounded-2xl border border-amber-100 space-y-4">
                  {/* Official Brand Logo Showcase */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-pink-200/90 shadow-md bg-white">
                    <img
                      src="/images/depees_logo.jpg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
                      }}
                      alt="DE-PEES BABY & MOTHER CARE Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E3A8A]">DE-PEES</h3>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
                      BABY & MOTHER CARE
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 max-w-xs mx-auto">
                      Children's shoes, boutique outfits, school bags, lunch sets, and mother care essentials.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="pt-2 grid grid-cols-2 gap-2 text-left text-xs font-medium text-slate-700">
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-pink-100 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#DB2777] shrink-0" />
                      <span className="text-[11px] sm:text-xs">Comfort & Style</span>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-amber-100 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
                      <span className="text-[11px] sm:text-xs">Affordable Luxury</span>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-blue-100 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#1E3A8A] shrink-0" />
                      <span className="text-[11px] sm:text-xs">Mother & Baby</span>
                    </div>
                    <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-cyan-100 flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0891B2] shrink-0" />
                      <span className="text-[11px] sm:text-xs">Speedy Dispatch</span>
                    </div>
                  </div>

                  {isValidWhatsAppNumber(settings.whatsapp_number) ? (
                    <a
                      href={getWhatsAppUrl(settings.whatsapp_number, 'Hello DE-PEES, I am visiting your website and want to place an order.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 min-h-[44px] flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xs transition-colors"
                    >
                      Quick Order via WhatsApp
                    </a>
                  ) : (
                    <button
                      onClick={() => navigateTo('contact')}
                      className="mt-3 min-h-[44px] flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-xs transition-colors"
                    >
                      Enquire / Contact Store
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WELCOME TO DE-PEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-2xs">
          <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777]">
              Welcome to DE-PEES
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Carefully Selected Quality for Nigerian Mothers & Children
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Based in Port Harcourt, DE-PEES BABY & MOTHER CARE is dedicated to bringing you the finest
              children's shoes, adorable clothing, durable school essentials, and premium maternity items.
              Every single product in our catalog combines comfort, durability, and elegance to ensure you
              and your child get only the best.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
              Explore Our Collections
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">Shop by Category</h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-[#1E3A8A] hover:text-[#DB2777] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const itemCount = products.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group text-left p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-[#DB2777] hover:shadow-md transition-all duration-200 flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-50 group-hover:bg-[#DB2777] group-hover:text-white text-[#DB2777] flex items-center justify-center transition-colors mb-2.5 sm:mb-3">
                    {renderCategorySvg(cat.slug)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#DB2777] transition-colors line-clamp-2">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION: FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Handpicked Favourites
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Products</h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-[#1E3A8A] hover:text-[#DB2777] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>See Full Store</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION: LATEST ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0891B2]">
              Fresh In Stock
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">Latest Arrivals</h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-semibold text-[#1E3A8A] hover:text-[#DB2777] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Explore All New</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {latestArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION: WHY CHOOSE US */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              The DE-PEES Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">Why Shop With Us?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We understand what mothers and growing children need: durability, comfort, elegance, and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-[#DB2777] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Care & Comfort</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breathable fabrics, ergonomic shoe soles, and gentle baby-safe materials selected with true motherly care.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Local & Nationwide Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast doorstep delivery across Port Harcourt and trusted interstate logistics to all 36 Nigerian states.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Affordable Luxury</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-end style and durable school accessories at realistic Nigerian Naira prices without compromising quality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Personal Attention</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct WhatsApp consultation with our team for shoe sizing, hospital hampers, and customized orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777]">
            Real Customer Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Our Customers Say</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Read verified feedback from mothers and families who shop with DE-PEES in Port Harcourt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "The school shoes I bought for my twin boys survived an entire school term without peeling.
              DE-PEES is now my only go-to store in Port Harcourt for kids shoes."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Mrs. Eniola Briggs</span>
              <span className="text-slate-400">GRA Phase 2, PH</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "I ordered the hospital welcome hamper for my sister's baby shower in Abuja. It arrived neatly packaged
              and every piece of clothing was soft organic cotton. Outstanding service!"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Chidinma Eze</span>
              <span className="text-slate-400">Abuja, FCT</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "Ordering via WhatsApp was so effortless. They helped me confirm my daughter's sneaker size and delivered
              it to my office at Peter Odili road within hours."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900">Oby Douglas</span>
              <span className="text-slate-400">Trans-Amadi, PH</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CONTACT & WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#0891B2] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              We Are Always Here For You
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
              Have a Question About Sizing or Delivery in Port Harcourt?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Chat directly with our care specialists. We assist you with sizes, package customisation,
              and immediate dispatch.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {isValidWhatsAppNumber(settings.whatsapp_number) ? (
                <a
                  href={getWhatsAppUrl(settings.whatsapp_number, 'Hello DE-PEES BABY & MOTHER CARE, I would like to make an enquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat with us on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={() => navigateTo('contact')}
                  className="py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send Us an Enquiry</span>
                </button>
              )}

              <button
                onClick={() => navigateTo('contact')}
                className="py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                View Contact & Location
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
