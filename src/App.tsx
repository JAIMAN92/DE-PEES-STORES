import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { VisionPage } from './pages/VisionPage';
import { ShopPage } from './pages/ShopPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, notification } = useStore();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'vision':
        return <VisionPage />;
      case 'shop':
        return <ShopPage />;
      case 'contact':
        return <ContactPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  const isPublicPage = currentPage !== 'admin' && currentPage !== 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1E293B]">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation (only on public & checkout views) */}
      {currentPage !== 'admin' && <Navbar />}

      {/* Page Content */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Footer (only on public storefront pages) */}
      {isPublicPage && <Footer />}

      {/* Floating WhatsApp support button */}
      {isPublicPage && <FloatingWhatsApp />}

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Shopping Bag Slide-Over Drawer */}
      <CartDrawer />

      {/* Mobile Ergonomic Bottom Tab Bar (Home, Shop, Cart, WhatsApp) */}
      {isPublicPage && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
