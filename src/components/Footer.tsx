import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageView } from '../types';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

export const Footer: React.FC = () => {
  const { navigateTo, setCategoryFilter, categories, settings, isAdminLoggedIn } = useStore();

  const handlePageClick = (page: PageView) => {
    navigateTo(page);
  };

  const handleCategoryClick = (slug: string) => {
    setCategoryFilter(slug);
    navigateTo('shop');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-28 sm:pt-16 sm:pb-12 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200/80 shadow-xs shrink-0 bg-white">
                <img
                  src="/images/depees_logo.jpg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
                  }}
                  alt="DE-PEES BABY & MOTHER CARE"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">DE-PEES</span>
                <span className="block text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37]">
                  BABY & MOTHER CARE
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fashion and lifestyle boutique dedicated to providing beautiful, quality, and affordable
              luxury products for mothers, women, and children in Port Harcourt and nationwide.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0891B2]" /> Port Harcourt, Rivers State
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DB2777]" /> Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => handlePageClick('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home Storefront
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Us & Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('vision')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Our Vision & Values
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('shop')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Online Shop Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Store Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0891B2]" /> Catalogue
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="hover:text-cyan-300 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Direct Shopping */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> Customer Care
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            {settings.phone ? (
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0891B2] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </p>
            ) : (
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0891B2] shrink-0" />
                <button onClick={() => handlePageClick('contact')} className="hover:text-white transition-colors text-left">
                  Port Harcourt Customer Support
                </button>
              </p>
            )}
            {isValidWhatsAppNumber(settings.whatsapp_number) ? (
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getWhatsAppUrl(settings.whatsapp_number, 'Hello DE-PEES BABY & MOTHER CARE, I would like to make an enquiry.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp ({settings.whatsapp_display || settings.whatsapp_number})
                </a>
              </p>
            ) : (
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <button onClick={() => handlePageClick('contact')} className="hover:text-emerald-400 transition-colors text-left">
                  WhatsApp Orders (Online Enquiry)
                </button>
              </p>
            )}
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-400 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                {settings.email}
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            <p className="flex items-center justify-center sm:justify-start gap-1">
              © {new Date().getFullYear()} DE-PEES BABY & MOTHER CARE. All Rights Reserved.
              <span className="hidden sm:inline">Crafted with care in Port Harcourt, Nigeria.</span>
            </p>
          </div>

          {isAdminLoggedIn && (
            <div className="flex items-center justify-center sm:justify-end">
              <button
                onClick={() => handlePageClick('admin')}
                className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
                title="Active Owner Session"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0891B2]" />
                <span>Dashboard</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
