import React, { useEffect, useState } from 'react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilter } from '../components/products/ProductFilter';
import { Search, SlidersHorizontal, PackageX } from 'lucide-react';

interface CollectionsPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onViewProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  initialCategory = '',
  initialSearch = '',
  onViewProduct
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        api.getCategories(),
        api.getProducts({
          category: selectedCategory,
          fabric: selectedFabric,
          color: selectedColor,
          sort: selectedSort,
          search: searchQuery
        })
      ]);
      setCategories(catRes.categories || []);
      setProducts(prodRes.products || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedFabric, selectedColor, selectedSort, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedFabric('');
    setSelectedColor('');
    setSelectedSort('newest');
    setSearchQuery('');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-boutique-100 rounded-3xl p-6 sm:p-10 border border-gold-500/20 text-center space-y-2">
        <span className="text-gold-600 font-extrabold text-xs uppercase tracking-widest">Product Catalog</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-900">
          {selectedCategory ? `${selectedCategory} Collection` : 'All Products & Fabrics'}
        </h1>
        <p className="text-gray-600 text-sm max-w-xl mx-auto">
          Explore our wide selection of authentic sarees, dress materials, ready-to-wear blouses, and wholesale fabric rolls.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            selectedFabric={selectedFabric}
            selectedColor={selectedColor}
            selectedSort={selectedSort}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onFabricChange={setSelectedFabric}
            onColorChange={setSelectedColor}
            onSortChange={setSelectedSort}
            onSearchChange={setSearchQuery}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
          <span className="text-sm font-bold text-gray-800">
            Showing {products.length} Products
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 bg-boutique-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex justify-end">
            <div className="bg-white w-full max-w-sm h-full overflow-y-auto rounded-2xl p-4 shadow-2xl relative">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="absolute top-4 right-4 text-gray-500 font-bold"
              >
                Close
              </button>
              <ProductFilter
                categories={categories}
                selectedCategory={selectedCategory}
                selectedFabric={selectedFabric}
                selectedColor={selectedColor}
                selectedSort={selectedSort}
                searchQuery={searchQuery}
                onCategoryChange={(c) => { setSelectedCategory(c); setMobileFilterOpen(false); }}
                onFabricChange={(f) => { setSelectedFabric(f); setMobileFilterOpen(false); }}
                onColorChange={(col) => { setSelectedColor(col); setMobileFilterOpen(false); }}
                onSortChange={(s) => { setSelectedSort(s); setMobileFilterOpen(false); }}
                onSearchChange={setSearchQuery}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Products Grid Column */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
              <PackageX className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-gray-800">No matching products found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                We couldn't find any products matching your selected category or search query. Try resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-boutique-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                  onEnquireNow={onViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
