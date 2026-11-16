import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'latest'>(
    'featured'
  );
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Must be published
        if (!product.is_published) return false;

        // Category filter
        if (categoryFilter) {
          const category = categories.find((c) => c.slug === categoryFilter);
          if (category && product.category_id !== category.id) {
            return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCategory = product.category_name.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCategory) {
            return false;
          }
        }

        // In Stock filter
        if (onlyInStock && product.stock_quantity <= 0) {
          return false;
        }

        // Featured filter
        if (onlyFeatured && !product.is_featured) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'latest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        // Default: featured first
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return 0;
      });
  }, [products, categories, categoryFilter, searchQuery, onlyInStock, onlyFeatured, sortBy]);

  const activeCategory = categories.find((c) => c.slug === categoryFilter);

  const resetFilters = () => {
    setCategoryFilter(null);
    setSearchQuery('');
    setOnlyInStock(false);
    setOnlyFeatured(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(categoryFilter) ||
    Boolean(searchQuery) ||
    onlyInStock ||
    onlyFeatured ||
    sortBy !== 'featured';

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-28 sm:pb-24">
      {/* Category / Shop Header */}
      <div className="bg-gradient-to-b from-[#FDF2F8]/70 via-white to-[#F0FDFA]/50 border-b border-pink-100/60 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-1.5 sm:space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#DB2777]">
              DE-PEES Online Catalogue
            </span>
            <h1 className="text-xl sm:text-4xl font-extrabold text-[#1E3A8A] tracking-tight">
              {activeCategory ? activeCategory.name : "All Children's & Mother Care Products"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeCategory
                ? activeCategory.description
                : "Explore our authentic collection of children's shoes, boutique outfits, school bags, lunch sets, and mother care essentials."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-5 sm:space-y-6">
        {/* Controls Toolbar: Search & Quick Filters */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5 sm:space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input (min 44px height, 16px font on mobile to prevent iOS auto-zoom) */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, shoes, backpack, hamper, sizes..."
                className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-sm sm:text-xs rounded-xl border border-slate-200 focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777] outline-none bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sorting & Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              {/* Sort By */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-[#1E3A8A]"
                >
                  <option value="featured">Featured First</option>
                  <option value="latest">Latest Arrivals</option>
                  <option value="price-asc">Price: Low to High (₦)</option>
                  <option value="price-desc">Price: High to Low (₦)</option>
                </select>
              </div>

              {/* In-Stock Toggle */}
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`text-xs font-medium py-2 px-3 rounded-xl border transition-colors ${
                  onlyInStock
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                In Stock Only
              </button>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === null
                  ? 'bg-[#1E3A8A] text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items ({products.filter((p) => p.is_published).length})
            </button>
            {categories.map((cat) => {
              const isSelected = categoryFilter === cat.slug;
              const count = products.filter((p) => p.category_id === cat.id && p.is_published).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[#DB2777] text-white shadow-2xs font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Metadata Line (Zero-Pill discipline) */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>
            {activeCategory && (
              <>
                <span>·</span>
                <span className="font-medium text-slate-700">{activeCategory.name}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>·</span>
                <span>Searching "{searchQuery}"</span>
              </>
            )}
          </div>
          <span className="font-medium text-slate-600">All prices in Nigerian Naira (₦)</span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching products found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any items matching your active search or filters. Try resetting the filters or searching for another term.
            </p>
            <div className="pt-2">
              <button
                onClick={resetFilters}
                className="py-2.5 px-6 rounded-xl text-xs font-semibold bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
