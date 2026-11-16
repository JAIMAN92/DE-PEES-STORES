import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, Phone, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageView } from '../types';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo, cartItemCount, setIsCartOpen, isAdminLoggedIn, settings } =
    useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'HOME', page: 'home' },
    { label: 'ABOUT US', page: 'about' },
    { label: 'VISION', page: 'vision' },
    { label: 'SHOP', page: 'shop' },
    { label: 'CONTACT', page: 'contact' },
  ];

  const handleNavClick = (page: PageView) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else {
      navigateTo('admin-login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Slim Top Bar: Trust, Location, and Phone */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#0891B2] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold text-[11px] uppercase tracking-wider shrink-0">
              <MapPin className="w-3 h-3" /> Port Harcourt
            </span>
            <span className="hidden sm:inline text-blue-200">·</span>
            <span className="hidden sm:inline text-white/90 truncate">
              {settings.promotional_banner}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            {settings.phone && !settings.phone.replace(/[^0-9]/g, '').includes('8031234567') ? (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-1 text-white/90 hover:text-amber-200 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden md:inline">{settings.phone}</span>
              </a>
            ) : (
              <button
                onClick={() => handleNavClick('contact')}
                className="flex items-center gap-1 text-white/90 hover:text-amber-200 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span className="hidden md:inline">Contact Store</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation - 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="group text-left flex items-center gap-3 whitespace-nowrap shrink-0 focus:outline-none"
          >
            {/* Official Brand Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-pink-200/80 shadow-xs shrink-0 bg-white">
              <img
                src="/images/depees_logo.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
                }}
                alt="DE-PEES BABY & MOTHER CARE"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#1E3A8A] group-hover:text-[#DB2777] transition-colors">
                DE-PEES
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]">
                BABY & MOTHER CARE
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`relative py-2 whitespace-nowrap transition-colors hover:text-[#DB2777] focus:outline-none ${
                    isActive ? 'text-[#DB2777] font-semibold' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#DB2777] to-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Shopping Cart (Admin login icon hidden from audience) */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-[#DB2777] hover:bg-pink-50/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#DB2777] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* If owner is already authenticated in this session, show dashboard shortcut */}
            {isAdminLoggedIn && (
              <button
                onClick={handleAdminClick}
                title="Admin Dashboard (Active Session)"
                aria-label="Admin Dashboard"
                className="p-2 rounded-full text-[#0891B2] bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors focus:outline-none"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pink-50 text-[#DB2777] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {isAdminLoggedIn && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-4">
              <span className="text-xs text-slate-500">Owner Session</span>
              <button
                onClick={handleAdminClick}
                className="text-xs font-semibold text-[#0891B2] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
