import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, getWhatsAppLink, showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.submitInquiry({ name, email, phone, message });
      showToast('Thank you! Your message has been sent to Pooja Boutique.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-gold-600 font-extrabold text-xs uppercase tracking-widest">Store Location & Inquiry</span>
        <h1 className="font-serif text-4xl font-extrabold text-boutique-900">
          Contact Pooja Boutique
        </h1>
        <p className="text-gray-600 text-sm">
          Have questions about saree availability, fabric bulk prices, or blouse matching? Reach out or visit our showroom in Hyderabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Business Details & Action Buttons */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-serif font-bold text-2xl text-boutique-900 border-b pb-4 border-gray-100">
              Pooja Boutique & Matching Centre
            </h2>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-boutique-100 text-boutique-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Showroom Address</h4>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-boutique-100 text-boutique-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone Number</h4>
                  <p className="text-gray-600 mt-0.5">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-boutique-100 text-boutique-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Address</h4>
                  <p className="text-gray-600 mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-boutique-100 text-boutique-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Business Hours</h4>
                  <p className="text-gray-600 mt-0.5">{settings.business_hours}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <a
                href={`tel:${settings.phone}`}
                className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                <Phone className="w-4 h-4" /> Call Store Now
              </a>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="font-serif font-bold text-2xl text-boutique-900">
            Send Us an Inquiry
          </h2>
          <p className="text-xs text-gray-500">
            Fill out the form below and our team will get back to you with price details or fabric stock information.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sravanthi Sharma"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="088859 13999"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message / Requirements *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify fabrics, sarees, or matching requirements..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-boutique-700 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending Message...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Location Embed Section */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-boutique-900">
              Find Pooja Boutique on Google Maps
            </h3>
            <p className="text-xs text-gray-500">Buddha Nagar Colony, Hyderabad, Telangana – 500092</p>
          </div>
          <a
            href="https://maps.google.com/?q=Buddha+Nagar+Colony+Hyderabad"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold-500 text-boutique-900 hover:bg-gold-400 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow"
          >
            Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 border">
          <iframe
            title="Pooja Boutique Hyderabad Location Map"
            src={settings.google_maps_embed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
