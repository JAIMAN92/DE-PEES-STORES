import React from 'react';
import { ShoppingBag, Zap, Eye, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { BrandedPlaceholder } from './BrandedPlaceholder';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductId, navigateTo } = useStore();

  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const inStock = product.stock_quantity > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart(
      product,
      1,
      product.sizes.length > 0 ? product.sizes[0] : undefined,
      product.colors.length > 0 ? product.colors[0] : undefined
    );
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inStock) return;
    addToCart(
      product,
      1,
      product.sizes.length > 0 ? product.sizes[0] : undefined,
      product.colors.length > 0 ? product.colors[0] : undefined
    );
    navigateTo('checkout');
  };

  const handleCardClick = () => {
    setSelectedProductId(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 hover:border-pink-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full"
    >
      {/* Media Slot: Genuine Photo or Branded Placeholder */}
      <div className="relative w-full aspect-square bg-[#F8FAFC] overflow-hidden border-b border-slate-100">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <BrandedPlaceholder
            categoryName={product.category_name}
            productName={product.name}
            aspectRatio="square"
            className="h-full border-none rounded-none"
          />
        )}

        {/* Status Tag (Zero-pill discipline: unboxed subtle text badge) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.is_featured && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/95 text-white shadow-2xs">
              Featured
            </span>
          )}
          {product.is_latest && (
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#0891B2]/95 text-white shadow-2xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#DB2777]" /> View Details
          </span>
        </div>
      </div>

      {/* Content Slot */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-1">
            {product.category_name}
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#DB2777] transition-colors line-clamp-2 mb-1.5 leading-snug">
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Sizing & Colors summary */}
          <div className="mb-3 text-[11px] text-slate-500 space-y-1">
            {product.sizes.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-slate-400 font-medium">Sizes:</span>
                <span className="text-slate-700">{product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? '...' : ''}</span>
              </div>
            )}
            {product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="text-slate-400 font-medium">Colours:</span>
                <span className="text-slate-700">{product.colors.slice(0, 3).join(', ')}{product.colors.length > 3 ? '...' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-2.5 sm:mb-3">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tabular-nums">
                ₦{product.price.toLocaleString()}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums">
                  ₦{product.original_price.toLocaleString()}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-medium flex items-center gap-1 ${
                inStock ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {inStock ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                  <span>In Stock</span>
                </>
              ) : (
                'Out of Stock'
              )}
            </span>
          </div>

          {/* Two Action Buttons: ADD TO CART & BUY NOW */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={`Add ${product.name} to cart`}
              className={`min-h-[40px] sm:min-h-[42px] py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-colors focus:outline-none active:scale-[0.98] ${
                inStock
                  ? 'bg-slate-100 hover:bg-pink-50 text-slate-800 hover:text-[#DB2777] border border-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              aria-label={`Buy ${product.name} now`}
              className={`min-h-[40px] sm:min-h-[42px] py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-colors shadow-xs focus:outline-none active:scale-[0.98] ${
                inStock
                  ? 'bg-gradient-to-r from-[#DB2777] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
