import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sparkles, MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, categoryFilter?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, getWhatsAppLink } = useShop();

  return (
    <footer className="bg-boutique-900 text-cream pt-16 pb-8 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-boutique-900 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                  Pooja Boutique
                </h3>
                <p className="text-xs text-gold-400 font-semibold tracking-wider uppercase">
                  & Matching Centre
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Hyderabad's premier wholesale and retail boutique for luxury sarees, pure cotton fabrics, designer blouses, and complete matching material solutions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-boutique-800 hover:bg-gold-500 hover:text-boutique-900 text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-boutique-800 hover:bg-gold-500 hover:text-boutique-900 text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold-400 mb-4 pb-2 border-b border-boutique-800">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-gold-400 transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-gold-400 transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-gold-400 transition-colors">All Collections</button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections', 'Fabrics')} className="hover:text-gold-400 transition-colors">Fabrics Wholesale</button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections', 'Matching Materials')} className="hover:text-gold-400 transition-colors">Matching Centre</button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-gold-400 transition-colors">Showroom Gallery</button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="hover:text-gold-400 transition-colors">Special Offers</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-gold-400 transition-colors">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold-400 mb-4 pb-2 border-b border-boutique-800">
              Customer Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-gold-400 transition-colors">Customer Login</button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-gold-400 transition-colors">Register Account</button>
              </li>
              <li>
                <button onClick={() => onNavigate('forgot-password')} className="hover:text-gold-400 transition-colors">Forgot Password</button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-gold-400 transition-colors">Admin Portal Login</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-lg text-gold-400 mb-4 pb-2 border-b border-boutique-800">
              Visit Our Store
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-gold-400 transition-colors">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.business_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-boutique-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Pooja Boutique and Matching Centre. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> in Hyderabad, Telangana
          </p>
        </div>
      </div>
    </footer>
  );
};
