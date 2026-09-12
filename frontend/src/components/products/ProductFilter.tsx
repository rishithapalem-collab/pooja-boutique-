import React from 'react';
import { Category } from '../../types';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string;
  selectedFabric: string;
  selectedColor: string;
  selectedSort: string;
  searchQuery: string;
  onCategoryChange: (cat: string) => void;
  onFabricChange: (fabric: string) => void;
  onColorChange: (color: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  selectedFabric,
  selectedColor,
  selectedSort,
  searchQuery,
  onCategoryChange,
  onFabricChange,
  onColorChange,
  onSortChange,
  onSearchChange,
  onReset
}) => {
  const fabricsList = ['Cotton', 'Pure Silk', 'Georgette', 'Chiffon', 'Linen', 'Rayon', 'Raw Silk'];
  const colorsList = ['Maroon', 'Pink', 'Gold', 'Blue', 'Green', 'Teal', 'Red'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-serif font-bold text-lg text-boutique-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-gold-500" /> Filter Catalogue
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-boutique-700 hover:text-boutique-900 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Search Products</label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Silk Saree, Blouse..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Categories</label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex justify-between items-center ${
              selectedCategory === ''
                ? 'bg-boutique-700 text-white'
                : 'text-gray-700 hover:bg-boutique-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                selectedCategory === cat.name
                  ? 'bg-boutique-700 text-white font-bold'
                  : 'text-gray-700 hover:bg-boutique-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat.product_count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === cat.name ? 'bg-gold-500 text-boutique-900 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.product_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Types */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Fabric Material</label>
        <select
          value={selectedFabric}
          onChange={(e) => onFabricChange(e.target.value)}
          className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:ring-2 focus:ring-boutique-700 focus:outline-none"
        >
          <option value="">All Fabrics</option>
          {fabricsList.map((fab) => (
            <option key={fab} value={fab}>{fab}</option>
          ))}
        </select>
      </div>

      {/* Color Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Color Palette</label>
        <select
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:ring-2 focus:ring-boutique-700 focus:outline-none"
        >
          <option value="">All Colors</option>
          {colorsList.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">Sort By</label>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:ring-2 focus:ring-boutique-700 focus:outline-none"
        >
          <option value="newest">New Arrivals First</option>
          <option value="popular">Popular Featured First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};
