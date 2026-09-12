import React, { useEffect, useState } from 'react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake, Truck, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface HomePageProps {
  onNavigate: (page: string, categoryFilter?: string) => void;
  onViewProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onViewProduct }) => {
  const { settings, getWhatsAppLink } = useShop();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ featured: 'true' })
        ]);
        setCategories(catRes.categories || []);
        setFeaturedProducts(prodRes.products || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-boutique-100/70 via-cream to-cream pt-10 pb-16 lg:py-20 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-boutique-100 border border-gold-500/30 text-boutique-700 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-sm">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Hyderabad's Trusted Clothes & Fabric Wholesaler</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-boutique-900 leading-tight">
                Discover Your Perfect Style at <span className="text-gold-gradient block">Pooja Boutique</span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Quality fabrics, beautiful collections, and perfect matching solutions for every occasion. Serving retail customers and wholesale bulk buyers across Telangana.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('collections')}
                  className="w-full sm:w-auto bg-boutique-700 hover:bg-boutique-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Explore Collections <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto bg-white border-2 border-boutique-700 text-boutique-700 hover:bg-boutique-50 font-bold px-8 py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Contact Store
                </button>
              </div>

              {/* Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-boutique-200/60 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <h4 className="font-bold text-boutique-900 text-lg sm:text-xl">100%</h4>
                  <p className="text-xs text-gray-600">Pure Quality Fabrics</p>
                </div>
                <div>
                  <h4 className="font-bold text-boutique-900 text-lg sm:text-xl">Wholesale</h4>
                  <p className="text-xs text-gray-600">Bulk Rates Available</p>
                </div>
                <div>
                  <h4 className="font-bold text-boutique-900 text-lg sm:text-xl">Matching</h4>
                  <p className="text-xs text-gray-600">Expert Assistance</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] lg:aspect-square">
                <img
                  src="/images/gen/boutique_hero_1789196227098.jpg"
                  alt="Pooja Boutique Luxury Showroom"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-boutique-900/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white">
                    <span className="bg-gold-500 text-boutique-900 text-[10px] uppercase font-extrabold px-3 py-1 rounded-full mb-2 inline-block">
                      Showroom Preview
                    </span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl">
                      Pooja Boutique & Matching Centre
                    </h3>
                    <p className="text-xs text-gray-200 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" />
                      Buddha Nagar Colony, Hyderabad
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-white p-4 rounded-2xl shadow-xl border border-gold-500/20 max-w-xs animate-bounce-slow">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-gray-900">Instant WhatsApp Inquiry</h5>
                  <p className="text-[11px] text-gray-500">Ask for colors, stock & pricing directly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-600 font-bold text-xs uppercase tracking-widest">Explore By Category</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-boutique-900 mt-1">
            Our Signature Collections
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Browse through our wide variety of premium sarees, dress materials, readymade blouses, and wholesale fabric rolls.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('collections', cat.name)}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                <img
                  src={cat.image || '/images/default_category.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-boutique-900/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base sm:text-lg group-hover:text-gold-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <div className="p-3 bg-white text-center border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">View Products</span>
                <ArrowRight className="w-4 h-4 text-boutique-700 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel/Grid */}
      <section className="bg-boutique-50/60 py-16 border-y border-boutique-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <span className="text-gold-600 font-bold text-xs uppercase tracking-widest">Handpicked Selection</span>
              <h2 className="font-serif text-3xl font-extrabold text-boutique-900 mt-1">
                Trending Arrivals & Best Sellers
              </h2>
            </div>
            <button
              onClick={() => onNavigate('collections')}
              className="text-boutique-700 font-bold text-sm hover:text-boutique-900 flex items-center gap-1"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewProduct}
                onEnquireNow={onViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-maroon-gradient text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-gold-400 text-xs font-extrabold uppercase tracking-widest">Why Customers Choose Us</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold mt-2 mb-6">
              The Preferred Fashion & Wholesale Destination in Hyderabad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 text-gold-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Pure Quality Assurance</h4>
                  <p className="text-gray-300 text-xs mt-1">Carefully selected silk, cotton, and designer fabrics with strict quality standards.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 text-gold-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Wholesale Availability</h4>
                  <p className="text-gray-300 text-xs mt-1">Bulk fabric orders and wholesale pricing available for boutiques and tailors.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 text-gold-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Personalized Matching</h4>
                  <p className="text-gray-300 text-xs mt-1">Expert in-store assistance for exact blouse, dupatta, and lining matching.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 text-gold-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Trust & Variety</h4>
                  <p className="text-gray-300 text-xs mt-1">Hundreds of modern designs and affordable prices loved by customers in Buddha Nagar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
