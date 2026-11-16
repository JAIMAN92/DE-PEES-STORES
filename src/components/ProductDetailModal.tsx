import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Zap,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandedPlaceholder } from './BrandedPlaceholder';
import { getWhatsAppUrl, isValidWhatsAppNumber } from '../lib/whatsapp';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    addToCart,
    navigateTo,
    settings,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Sync initial state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedColor(product.colors.length > 0 ? product.colors[0] : '');
      setQuantity(1);
      setActiveMediaTab('photos');
      setSelectedImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const inStock = product.stock_quantity > 0;
  const currentImage = product.images[selectedImageIndex] || product.images[0];
  const hasVideo = product.videos && product.videos.length > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setSelectedProductId(null);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
    setSelectedProductId(null);
    navigateTo('checkout');
  };

  const handleWhatsAppInquiry = () => {
    if (!isValidWhatsAppNumber(settings.whatsapp_number)) {
      setSelectedProductId(null);
      navigateTo('contact');
      return;
    }
    const sizePart = selectedSize ? ` (Size: ${selectedSize})` : '';
    const colorPart = selectedColor ? ` (Colour: ${selectedColor})` : '';
    const text = `Hello DE-PEES BABY & MOTHER CARE! I am interested in purchasing: "${product.name}"${sizePart}${colorPart} priced at ₦${product.price.toLocaleString()}. Is this currently available for delivery in Port Harcourt?`;
    const url = getWhatsAppUrl(settings.whatsapp_number, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={() => setSelectedProductId(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
      >
        {/* Close Button with generous touch hitbox */}
        <button
          onClick={() => setSelectedProductId(null)}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-8">
          {/* Left Column: Media Showcase */}
          <div className="space-y-4">
            {/* Media Mode Switcher (if video exists) */}
            {hasVideo && (
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`text-xs font-semibold py-1 px-3 rounded-lg transition-colors ${
                    activeMediaTab === 'photos'
                      ? 'bg-[#DB2777] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Photos ({product.images.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`text-xs font-semibold py-1 px-3 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeMediaTab === 'video'
                      ? 'bg-[#0891B2] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  Product Video
                </button>
              </div>
            )}

            {/* Main Media Display */}
            {activeMediaTab === 'video' && hasVideo ? (
              <div className="aspect-square bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                <video
                  src={product.videos![0].url}
                  controls
                  className="w-full h-full object-contain"
                  poster={currentImage?.url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80">
                {currentImage?.url ? (
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt_text || product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BrandedPlaceholder
                    categoryName={product.category_name}
                    productName={product.name}
                    aspectRatio="square"
                    className="h-full border-none rounded-none"
                  />
                )}
              </div>
            )}

            {/* Thumbnail Gallery (if multiple photos) */}
            {activeMediaTab === 'photos' && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-[#DB2777] scale-105' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <Truck className="w-4 h-4 text-[#0891B2] shrink-0" />
                <span>Port Harcourt Pickup & Delivery Available</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>100% Genuine Quality Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Module */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category */}
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-700 mb-1.5">
                {product.category_name}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                {product.name}
              </h1>

              {/* Price & Stock */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] tabular-nums">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ₦{product.original_price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {inStock ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      In Stock ({product.stock_quantity} left)
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Sizes Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-800">Select Size:</span>
                    <span className="text-xs text-slate-500 font-medium">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all focus:outline-none active:scale-[0.98] ${
                          selectedSize === size
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#1E3A8A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-800">Select Colour:</span>
                    <span className="text-xs text-slate-500 font-medium">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all focus:outline-none active:scale-[0.98] ${
                          selectedColor === color
                            ? 'bg-[#DB2777] text-white border-[#DB2777] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#DB2777]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mb-6 flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="min-h-[42px] min-w-[42px] flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors text-base font-semibold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    disabled={quantity >= product.stock_quantity}
                    className="min-h-[42px] min-w-[42px] flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors text-base font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full min-h-[46px] py-3 px-3 sm:px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-pink-50 text-slate-800 hover:text-[#DB2777] border border-slate-300 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full min-h-[46px] py-3 px-3 sm:px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#DB2777] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="truncate">BUY NOW</span>
                </button>
              </div>

              {/* WhatsApp direct order / inquiry */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enquire or Order via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
