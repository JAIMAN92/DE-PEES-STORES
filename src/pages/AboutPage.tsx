import React from 'react';
import {
  Heart,
  ShieldCheck,
  Truck,
  Award,
  Users,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="pb-28 sm:pb-20 space-y-12 sm:space-y-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#FDF2F8] via-white to-slate-50 border-b border-pink-100/60 py-10 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777]">
            About DE-PEES BABY & MOTHER CARE
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A8A] tracking-tight leading-tight">
            Nurturing Mothers, Styling Children, Celebrating Family
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to DE-PEES BABY & MOTHER CARE, your destination for beautiful, stylish, and
            carefully selected fashion and lifestyle products for mothers, women, and children.
          </p>
        </div>
      </section>

      {/* Main Core Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-2xs space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Story & Purpose</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#DB2777] to-[#D4AF37] rounded-full" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We believe that every mother and child deserves comfort, beauty, quality, and style.
              Founded in Port Harcourt, Nigeria, <strong>DE-PEES BABY & MOTHER CARE</strong> was born
              out of a genuine passion to eliminate the difficulty parents face when searching for durable,
              fashionable, and safe items for their growing children.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our business is committed to making shopping for children's fashion, baby essentials, and
              women's lifestyle products convenient, enjoyable, and affordable. At DE-PEES BABY & MOTHER CARE,
              we aim to make every purchase a delightful experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Who We Are */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#DB2777] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Who We Are</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are a proudly Nigerian fashion and lifestyle boutique based in Port Harcourt,
                dedicated to curating premium baby gear, exquisite children's clothing, sturdy shoes,
                and elegant women's accessories.
              </p>
            </div>

            {/* What We Offer */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">What We Offer</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From orthopedic school shoes and party dresses to insulated lunch sets, hospital hampers,
                and timeless mother's totes, every item is vetted for long-lasting quality and beauty.
              </p>
            </div>

            {/* Our Commitment to Customers */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Our Commitment to Customers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero compromises on safety or fabric comfort. We deliver exactly what you order, backed by
                transparent sizing assistance and friendly Port Harcourt customer support.
              </p>
            </div>

            {/* Why Shop With Us? */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-[#0891B2] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Why Shop With Us?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Realistic Nigerian Naira pricing, rapid local dispatch within Port Harcourt, nationwide delivery,
                and direct WhatsApp consultation for personalized sizing and gift bundling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Port Harcourt Store Presence */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0891B2] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" /> Port Harcourt Roots, Nationwide Reach
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Experience the DE-PEES Standard Today</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg">
              Explore our current catalogue and discover why mothers trust us across Rivers State and Nigeria.
            </p>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-[#DB2777] hover:bg-[#BE185D] text-white shadow-md transition-colors flex items-center gap-2 shrink-0"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
