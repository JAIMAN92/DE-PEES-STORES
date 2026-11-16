import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, currentPage, navigateTo, showNotification } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on admin page to keep admin workspace clean
  if (currentPage === 'admin') return null;

  const quickEnquiries = [
    { label: "Children's Shoes & Sizing", text: "Hello DE-PEES! I would like to make an enquiry about children's shoes availability and sizing." },
    { label: "Children's Clothing & Dresses", text: "Hello DE-PEES! I would like to enquire about children's clothing and party dresses." },
    { label: "School Bags & Lunch Boxes", text: "Hello DE-PEES! I would like to ask about durable school bags and insulated lunch boxes." },
    { label: "Baby & Newborn Hospital Care", text: "Hello DE-PEES! I would like to enquire about baby essentials and newborn hampers." },
    { label: "Delivery within Port Harcourt", text: "Hello DE-PEES! I would like to ask about same-day delivery options within Port Harcourt." },
    { label: "Nationwide Delivery across Nigeria", text: "Hello DE-PEES! I would like to inquire about shipping to my state in Nigeria." },
  ];

  const handleStartChat = (customText?: string) => {
    if (!isValidWhatsAppNumber(settings.whatsapp_number)) {
      showNotification('WhatsApp line: Please contact us via our Contact page or add a number in Admin Settings.');
      navigateTo('contact');
      setIsOpen(false);
      return;
    }
    const message = customText || 'Hello DE-PEES BABY & MOTHER CARE. I would like to make an enquiry about your products.';
    const url = getWhatsAppUrl(settings.whatsapp_number, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Inquiry Modal */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-1.5rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0891B2] p-3.5 sm:p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">DE-PEES WhatsApp Help</h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span>Port Harcourt Store</span> · <span>Online Now</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50/50 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Welcome to <strong>DE-PEES BABY & MOTHER CARE</strong>. Select a question or tap below to chat directly with our team:
            </p>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {quickEnquiries.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleStartChat(item.text)}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-[#DB2777] hover:bg-pink-50/40 text-xs font-medium text-slate-700 transition-all flex items-center justify-between group shadow-2xs"
                >
                  <span className="group-hover:text-[#DB2777] line-clamp-1">{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#DB2777] shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={() => handleStartChat()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with DE-PEES on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open WhatsApp Support"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
      </button>
    </div>
  );
};
