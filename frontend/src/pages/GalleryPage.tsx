import React, { useEffect, useState } from 'react';
import { GalleryItem } from '../types';
import { api } from '../services/api';
import { Sparkles, Eye, X } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.getGallery();
        setGallery(res.gallery || []);
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', 'Showroom', 'Sarees', 'Fabrics', 'Matching Centre', 'Kurtis'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-gold-600 font-extrabold text-xs uppercase tracking-widest">Showroom Showcase</span>
        <h1 className="font-serif text-4xl font-extrabold text-boutique-900">
          Store & Fabric Gallery
        </h1>
        <p className="text-gray-600 text-sm">
          Take a look inside Pooja Boutique and Matching Centre in Buddha Nagar, Hyderabad. Explore our fabric displays, silk sarees, and matching materials.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-boutique-700 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-boutique-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Image Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No gallery images available for this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer relative aspect-[4/3]"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-boutique-900/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <span className="text-gold-400 text-[10px] uppercase font-bold tracking-wider">
                  {item.category || 'Boutique'}
                </span>
                <h3 className="font-serif font-bold text-lg">{item.title}</h3>
                {item.description && <p className="text-xs text-gray-300 mt-1 line-clamp-1">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-[16/10] bg-black">
              <img src={activeImage.image_url} alt={activeImage.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-6 bg-white space-y-1">
              <span className="text-gold-600 text-xs font-bold uppercase tracking-wider">{activeImage.category}</span>
              <h3 className="font-serif text-2xl font-bold text-boutique-900">{activeImage.title}</h3>
              {activeImage.description && <p className="text-sm text-gray-600">{activeImage.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
