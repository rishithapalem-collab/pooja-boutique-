import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { X, Heart, MessageCircle, ShoppingBag, CheckCircle, Tag, ShieldCheck, Send } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectRelated?: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectRelated
}) => {
  const { addToWishlist, isInWishlist, addToCart, getWhatsAppLink, showToast } = useShop();

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  if (!product) return null;

  const isWished = isInWishlist(product.id);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone || !inquiryMessage) {
      showToast('Please fill out all inquiry fields', 'error');
      return;
    }

    try {
      setSubmittingInquiry(true);
      await api.submitInquiry({
        product_id: product.id,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: inquiryMessage
      });
      showToast('Your inquiry has been submitted! Our team will contact you shortly.', 'success');
      setInquiryModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full text-gray-700 hover:text-gray-900 shadow transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Product Gallery Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => addToWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg backdrop-blur-md transition-colors ${
                  isWished ? 'bg-boutique-700 text-white' : 'bg-white/90 text-gray-700 hover:text-boutique-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Product Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gold-500/20 text-gold-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category_name || 'Boutique Collection'}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl md:text-3xl text-boutique-900 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mt-3 mb-4">
                <span className="text-3xl font-extrabold text-boutique-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.discount_price > 0 && product.discount_price < product.price && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.discount_price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Product Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-boutique-50/60 border border-boutique-100 text-xs mb-6">
                {product.fabric && (
                  <div>
                    <span className="text-gray-500 block">Fabric Type</span>
                    <strong className="text-gray-900">{product.fabric}</strong>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="text-gray-500 block">Color</span>
                    <strong className="text-gray-900">{product.color}</strong>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="text-gray-500 block">Size / Length</span>
                    <strong className="text-gray-900">{product.size}</strong>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block">Wholesale Availability</span>
                  <strong className="text-emerald-700">Bulk Quantities Available</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={getWhatsAppLink(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                WhatsApp Direct Inquiry
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => {
                    setInquiryMessage(`Hi, I am interested in inquiring about ${product.name} (₹${product.price}). Please share more details.`);
                    setInquiryModalOpen(true);
                  }}
                  className="w-full bg-white border border-boutique-700 text-boutique-700 hover:bg-boutique-50 font-bold py-3 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Form Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Form Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-boutique-900 mb-1">
              Inquire about {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Submit your inquiry and our team at Pooja Boutique will contact you.
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                  placeholder="e.g. Anitha Reddy"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                    placeholder="09876543210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message / Requirements *</label>
                <textarea
                  rows={3}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow"
              >
                {submittingInquiry ? 'Submitting...' : 'Send Inquiry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
