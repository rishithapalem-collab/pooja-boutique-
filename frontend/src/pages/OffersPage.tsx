import React, { useEffect, useState } from 'react';
import { Offer } from '../types';
import { api } from '../services/api';
import { Tag, Calendar, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OffersPage: React.FC = () => {
  const { getWhatsAppLink } = useShop();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.getOffers();
        setOffers(res.offers || []);
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-gold-600 font-extrabold text-xs uppercase tracking-widest">Exclusive Savings</span>
        <h1 className="font-serif text-4xl font-extrabold text-boutique-900">
          Special Boutique & Wholesale Offers
        </h1>
        <p className="text-gray-600 text-sm">
          Discover current promotional discounts on fabric rolls, saree collections, readymade blouses, and matching sets.
        </p>
      </div>

      {/* Offers Cards List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-gray-500">No active promotional offers right now. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col sm:flex-row group hover:shadow-2xl transition-all"
            >
              {/* Offer Image */}
              <div className="sm:w-1/2 relative overflow-hidden bg-boutique-900 aspect-[4/3] sm:aspect-auto">
                <img
                  src={offer.image || '/images/default_offer.jpg'}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {offer.discount_tag && (
                  <div className="absolute top-4 left-4 bg-gold-500 text-boutique-900 font-black text-xs px-3 py-1.5 rounded-full shadow">
                    {offer.discount_tag}
                  </div>
                )}
              </div>

              {/* Offer Details */}
              <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gold-600 font-bold">
                    <Sparkles className="w-4 h-4" /> Boutique Special
                  </div>
                  <h3 className="font-serif font-bold text-xl text-boutique-900 leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  {offer.valid_until && (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Valid till: {offer.valid_until}
                    </span>
                  )}
                  <a
                    href={getWhatsAppLink(`Offer: ${offer.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 shadow"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Claim Offer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
