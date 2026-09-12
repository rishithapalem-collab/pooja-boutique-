import React from 'react';
import { Sparkles, CheckCircle2, Award, HeartHandshake, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { settings } = useShop();

  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-gold-600 font-extrabold text-xs uppercase tracking-widest">About Our Boutique</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-boutique-900">
          Pooja Boutique & Matching Centre
        </h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Your premier local destination in Hyderabad for luxury sarees, high-grade fabrics, custom blouse matching, and wholesale ethnic wear.
        </p>
      </div>

      {/* Main Story & Image Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-gold-500" /> Our Story & Tradition
          </div>

          <h2 className="font-serif text-3xl font-bold text-boutique-900 leading-snug">
            Delivering Premium Fabrics and Authentic Craftsmanship Since Inception
          </h2>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Located in Buddha Nagar Colony, Hyderabad, <strong>Pooja Boutique and Matching Centre</strong> was founded to provide women with a complete one-stop shop for all their clothing and fabric requirements. Whether you are looking for an exclusive Kanchipuram silk saree for a grand wedding, pure cotton unstitched dress materials for daily elegance, or precise matching blouse linings, we deliver uncompromised quality.
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            As a established <strong>Clothes and Fabric Wholesaler</strong>, we cater to both individual retail shoppers and boutique owners across Telangana seeking premium fabric bolts, embroidery laces, and readymade blouses at wholesale competitive prices.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-boutique-50 border border-boutique-100">
              <h4 className="font-serif font-bold text-lg text-boutique-900">Wholesale & Retail</h4>
              <p className="text-xs text-gray-600 mt-1">Bulk discounts for tailors and boutique owners.</p>
            </div>
            <div className="p-4 rounded-2xl bg-boutique-50 border border-boutique-100">
              <h4 className="font-serif font-bold text-lg text-boutique-900">Matching Experts</h4>
              <p className="text-xs text-gray-600 mt-1">In-house staff for exact fabric and border matching.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
            <img
              src="/images/gen/store_interior_1789196445718.jpg"
              alt="Pooja Boutique Store Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-boutique-900 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block border-2 border-gold-500">
            <h4 className="font-serif font-bold text-base text-gold-400">Visit Our Store</h4>
            <p className="text-xs text-gray-300 mt-1">{settings.address}</p>
            <p className="text-xs text-gold-400 font-bold mt-2">Phone: {settings.phone}</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-boutique-900">Why Choose Pooja Boutique?</h2>
          <p className="text-gray-600 text-sm mt-2">We prioritize customer satisfaction, superior fabric quality, and personalized assistance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-boutique-100 text-boutique-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-boutique-900">Wide Variety of Designs</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              From traditional silk sarees to modern digital print cotton fabrics and heavy maggam work blouses, our inventory is constantly updated with seasonal trends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-boutique-100 text-boutique-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-boutique-900">Guaranteed Fabric Quality</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              We source fabrics directly from authentic weavers and textile hubs, guaranteeing color fastness, soft feel, and durable stitching quality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-boutique-100 text-boutique-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-boutique-900">Affordable Wholesale Rates</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              Transparent pricing with special wholesale slab discounts for bulk meters, dress materials, and matching accessories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
