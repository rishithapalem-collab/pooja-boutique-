import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Heart, Eye, MessageCircle, ShoppingBag, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onEnquireNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onEnquireNow
}) => {
  const { wishlist, addToWishlist, isInWishlist, addToCart, getWhatsAppLink } = useShop();
  const isWished = isInWishlist(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.featured === 1 && (
            <span className="bg-gold-500 text-boutique-900 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow">
              Featured
            </span>
          )}
          {product.new_arrival === 1 && (
            <span className="bg-boutique-700 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow">
              New
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isWished
              ? 'bg-boutique-700 text-white'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-boutique-700'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white text-boutique-900 text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg hover:bg-gold-500 transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gold-600 font-semibold mb-1">
            <span>{product.category_name || 'Collection'}</span>
            {product.fabric && (
              <span className="text-gray-400 font-normal flex items-center gap-1">
                <Tag className="w-3 h-3" /> {product.fabric}
              </span>
            )}
          </div>

          <h3
            onClick={() => onViewDetails(product)}
            className="font-serif font-bold text-base text-gray-900 line-clamp-1 hover:text-boutique-700 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price Tag */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-extrabold text-boutique-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.discount_price > 0 && product.discount_price < product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.discount_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-boutique-100 hover:bg-boutique-200 text-boutique-900 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Cart
            </button>
            <a
              href={getWhatsAppLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Enquire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
