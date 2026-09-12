import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import {
  Sparkles,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Phone,
  MapPin,
  LogOut,
  ShieldCheck,
  Send
} from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string, categoryFilter?: string) => void;
  onOpenProductModal?: (product: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const { wishlist, cart, settings, removeFromWishlist, removeFromCart, clearCart, showToast, getWhatsAppLink } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'collections', label: 'Collections' },
    { id: 'collections_fabrics', label: 'Fabrics', category: 'Fabrics' },
    { id: 'collections_matching', label: 'Matching Centre', category: 'Matching Materials' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'offers', label: 'Offers' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleInquirySubmitAll = async () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(i => `${i.product.name} (Qty: ${i.quantity})`).join(', ');
    const msg = `Hello Pooja Boutique! I would like to submit a combined inquiry for these items: ${itemsList}`;
    const waUrl = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    clearCart();
    setCartOpen(false);
    showToast('Inquiry request sent to WhatsApp!', 'success');
  };

  return (
    <>
      {/* Top Banner Info Bar */}
      <div className="bg-boutique-900 text-boutique-100 text-xs py-2 px-4 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clothes & Fabric Wholesaler in Hyderabad</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span>Buddha Nagar Colony, Hyderabad</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-gold-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>{settings.phone}</span>
            </a>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="flex items-center gap-1 bg-gold-500 text-boutique-900 px-2 py-0.5 rounded font-bold hover:bg-gold-400 transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 glass-nav border-b border-boutique-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Business Brand & Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="w-11 h-11 rounded-full bg-maroon-gradient flex items-center justify-center text-gold-400 shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-boutique-900 leading-tight">
                  Pooja Boutique
                </h1>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-gold-600">
                  & Matching Centre
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.category) {
                        onNavigate('collections', item.category);
                      } else {
                        onNavigate(item.id);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-boutique-700 font-bold bg-boutique-100/80 shadow-sm'
                        : 'text-gray-700 hover:text-boutique-700 hover:bg-white/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Header Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-gray-700 hover:text-boutique-700 hover:bg-boutique-100 transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Drawer Toggle */}
              <button
                onClick={() => setWishlistOpen(true)}
                className="relative p-2.5 rounded-full text-gray-700 hover:text-boutique-700 hover:bg-boutique-100 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-boutique-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart / Inquiry Toggle */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full text-gray-700 hover:text-boutique-700 hover:bg-boutique-100 transition-colors"
                title="Inquiry Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-boutique-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User Account Button */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-boutique-100 border border-boutique-200 text-boutique-900 text-sm font-semibold hover:bg-boutique-200 transition-colors">
                    <UserIcon className="w-4 h-4 text-boutique-700" />
                    <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                  </button>
                  {/* Account Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b text-xs text-gray-500">
                      Signed in as <strong className="text-gray-900 block truncate">{user.email}</strong>
                    </div>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => onNavigate('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-boutique-700 font-semibold hover:bg-boutique-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex items-center gap-1.5 bg-boutique-700 hover:bg-boutique-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-boutique-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.category) {
                    onNavigate('collections', item.category);
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-boutique-50 hover:text-boutique-700"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              {!user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('login');
                  }}
                  className="w-full bg-boutique-700 text-white py-2.5 rounded-lg font-semibold text-center"
                >
                  Customer Login / Register
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full bg-red-50 text-red-600 py-2.5 rounded-lg font-semibold text-center"
                >
                  Logout ({user.name})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-serif text-xl font-bold text-boutique-900 mb-4">
              Search Pooja Boutique Catalogue
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search Sarees, Fabrics, Kurtis, Blouses, Lace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-boutique-700 text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="bg-boutique-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-boutique-800 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-boutique-50">
              <h3 className="font-serif font-bold text-lg text-boutique-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-boutique-700 fill-boutique-700" /> My Wishlist ({wishlist.length})
              </h3>
              <button onClick={() => setWishlistOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Your wishlist is currently empty.</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center p-3 border rounded-xl hover:border-boutique-300">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gold-600 font-bold">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart / Inquiry Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center bg-boutique-50">
              <h3 className="font-serif font-bold text-lg text-boutique-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-boutique-700" /> Inquiry Cart ({cart.length})
              </h3>
              <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No products added for inquiry yet.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center p-3 border rounded-xl">
                    <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-gold-600 font-bold">₹{item.product.price}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-2">
                <button
                  onClick={handleInquirySubmitAll}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Enquire via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
