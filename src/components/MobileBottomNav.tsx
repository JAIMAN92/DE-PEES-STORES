import React from 'react';
import { Home, ShoppingBag, Grid, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageView } from '../types';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigateTo, cartItemCount, setIsCartOpen, settings } = useStore();

  // Hide on admin portal
  if (currentPage === 'admin' || currentPage === 'admin-login') {
    return null;
  }

  const handleWhatsAppClick = () => {
    if (isValidWhatsAppNumber(settings.whatsapp_number)) {
      const url = getWhatsAppUrl(
        settings.whatsapp_number,
        'Hello DE-PEES BABY & MOTHER CARE, I am browsing your website and need assistance.'
      );
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigateTo('contact');
    }
  };

  const navItems = [
    {
      id: 'home' as PageView,
      label: 'Home',
      icon: Home,
      action: () => navigateTo('home'),
      isActive: currentPage === 'home',
    },
    {
      id: 'shop' as PageView,
      label: 'Shop',
      icon: Grid,
      action: () => navigateTo('shop'),
      isActive: currentPage === 'shop',
    },
    {
      id: 'cart' as const,
      label: 'Cart',
      icon: ShoppingBag,
      action: () => setIsCartOpen(true),
      badge: cartItemCount,
      isActive: false,
    },
    {
      id: 'whatsapp' as const,
      label: 'WhatsApp',
      icon: MessageCircle,
      action: handleWhatsAppClick,
      isSpecial: true,
      isActive: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center min-h-[48px] w-full relative transition-colors focus:outline-none ${
                item.isActive ? 'text-[#DB2777]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? 'scale-110 text-[#DB2777]' : item.isSpecial ? 'text-[#25D366]' : ''
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-4.5 px-1 rounded-full bg-[#DB2777] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  item.isActive
                    ? 'font-bold text-[#DB2777]'
                    : item.isSpecial
                    ? 'font-medium text-[#25D366]'
                    : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-[#DB2777]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
