import React from 'react';

interface BrandedPlaceholderProps {
  categoryName?: string;
  productName?: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  className?: string;
}

export const BrandedPlaceholder: React.FC<BrandedPlaceholderProps> = ({
  categoryName,
  aspectRatio = 'square',
  className = '',
}) => {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[16/10]'
      : 'aspect-[3/4]';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-gradient-to-b from-[#FDF2F8]/70 via-[#FFFBEB]/50 to-[#F0FDFA]/70 border border-pink-100/60 rounded-xl flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
    >
      {/* Subtle luxury geometric background motif */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Official Brand Logo Emblem */}
      <div className="relative mb-2.5 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-200/80 shadow-xs bg-white">
          <img
            src="/images/depees_logo.jpg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://i.ibb.co/mr0VXG8j/Whats-App-Image-2026-10-23-at-2-10-31-PM.jpg';
            }}
            alt="DE-PEES"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand & Category Label */}
      <div className="space-y-1 max-w-[85%] z-10">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-700/90 flex items-center justify-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#D4AF37]" aria-hidden="true">
            <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7l3-7Z" />
          </svg>
          <span>DE-PEES CARE</span>
        </div>
        {categoryName && (
          <p className="text-xs font-medium text-slate-600 line-clamp-1">{categoryName}</p>
        )}
        <div className="pt-1">
          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-medium bg-white/80 text-slate-500 border border-slate-200/70 shadow-2xs">
            Product image coming soon
          </span>
        </div>
      </div>

      {/* Location watermark */}
      <div className="absolute bottom-2 text-[9px] text-slate-400 font-medium tracking-wide">
        Port Harcourt, Nigeria
      </div>
    </div>
  );
};
