import React from 'react';
import {
  Compass,
  Heart,
  Shield,
  Eye,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ValueGemSvg: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
    <path d="M2 9h20" />
    <path d="M12 21L8 9l4-6 4 6-4 12Z" />
  </svg>
);

export const VisionPage: React.FC = () => {
  const { navigateTo } = useStore();

  const coreValues = [
    {
      title: 'Comfort First for Little Ones',
      description:
        'Children thrive when they are comfortable. Every shoe, fabric, and baby gear item is hand-selected to support healthy physical development and active play.',
      icon: Heart,
      color: 'text-[#DB2777]',
      bg: 'bg-pink-50',
    },
    {
      title: 'Uncompromised Quality & Durability',
      description:
        'We believe in products that last. From reinforced stitching on school backpacks to scuff-resistant school shoes, our items withstand real-world use.',
      icon: Shield,
      color: 'text-[#1E3A8A]',
      bg: 'bg-blue-50',
    },
    {
      title: 'Affordability & Fair Value',
      description:
        'Luxury and beauty should be accessible. We provide premium aesthetic items at reasonable Nigerian Naira rates with honest pricing.',
      icon: ValueGemSvg,
      color: 'text-[#D4AF37]',
      bg: 'bg-amber-50',
    },
    {
      title: 'Dedicated Customer Care',
      description:
        'Every customer is treated like family. We listen attentively, assist with accurate sizing, and follow up until your order arrives safely at your doorstep.',
      icon: CheckCircle,
      color: 'text-[#0891B2]',
      bg: 'bg-cyan-50',
    },
  ];

  return (
    <div className="pb-28 sm:pb-20 space-y-12 sm:space-y-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#FFFBEB]/70 via-white to-slate-50 border-b border-amber-100/60 py-10 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center justify-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Our Vision & Guiding Star</span>
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A8A] tracking-tight leading-tight">
            Building a Legacy of Care and Elegance
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the principles, aspirations, and values that guide DE-PEES BABY & MOTHER CARE
            every single day.
          </p>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#D4AF37]/30 shadow-md text-center space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-[#D4AF37] flex items-center justify-center mx-auto shadow-xs">
            <Eye className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
            Official Vision Statement
          </span>

          <blockquote className="text-lg sm:text-2xl font-semibold text-[#1E3A8A] leading-relaxed max-w-3xl mx-auto">
            "To become a trusted and recognized destination for quality children's fashion,
            mother and baby care products and women's lifestyle essentials, providing customers with
            beautiful products, excellent service and a delightful shopping experience."
          </blockquote>

          <div className="w-20 h-0.5 bg-gradient-to-r from-[#DB2777] via-[#D4AF37] to-[#0891B2] mx-auto rounded-full" />

          {/* Brand Philosophy */}
          <div className="pt-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777] block mb-2">
              Our Brand Philosophy
            </span>
            <p className="text-base sm:text-lg font-medium text-slate-700 italic">
              "We believe every child deserves comfort and style, every mother deserves care, and
              every customer deserves quality and satisfaction."
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0891B2]">
            What We Stand For
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Pillars of Excellence</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Four guiding values that drive how we select products, package orders, and serve our patrons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${val.bg} ${val.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold">Join the DE-PEES Family Today</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Experience our commitment firsthand. Order children's fashion, school gear, or maternity essentials with ease.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="py-3 px-8 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#DB2777] to-[#D4AF37] text-white shadow-md hover:opacity-95 transition-all inline-flex items-center gap-2"
            >
              <span>Explore the Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
