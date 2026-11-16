import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandedPlaceholder } from './BrandedPlaceholder';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartItemCount,
    navigateTo,
  } = useStore();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-[#DB2777]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
              <p className="text-xs text-slate-500">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8 text-pink-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Explore our lovely children's fashion, school shoes, and mother care products to begin shopping.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="mt-2 py-2 px-5 rounded-xl text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              const primaryImg =
                item.product.images.find((img) => img.is_primary) || item.product.images[0];

              return (
                <div key={`${item.product.id}-${item.selected_size}-${item.selected_color}-${index}`} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70 shrink-0 relative">
                    {primaryImg?.url ? (
                      <img
                        src={primaryImg.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BrandedPlaceholder
                        categoryName={item.product.category_name}
                        aspectRatio="square"
                        className="h-full border-none rounded-none p-1 text-[8px]"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.selected_size,
                              item.selected_color
                            )
                          }
                          aria-label="Remove item"
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                        {item.selected_size && <span>Size: {item.selected_size}</span>}
                        {item.selected_color && <span>• {item.selected_color}</span>}
                      </div>

                      <div className="text-xs font-bold text-[#1E3A8A] mt-1 tabular-nums">
                        ₦{item.product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selected_size,
                              item.selected_color
                            )
                          }
                          aria-label="Decrease quantity"
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selected_size,
                              item.selected_color
                            )
                          }
                          aria-label="Increase quantity"
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-800 tabular-nums">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 pb-8 sm:pb-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-slate-900 tabular-nums">
                ₦{cartSubtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Delivery charges calculated at checkout (Port Harcourt & Nationwide).
            </p>

            <button
              onClick={handleProceedToCheckout}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#DB2777] to-[#BE185D] hover:from-[#BE185D] hover:to-[#9D174D] text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full py-2 text-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
