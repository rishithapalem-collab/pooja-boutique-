import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, SiteSettings } from '../types';
import { api } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  wishlist: Product[];
  cart: CartItem[];
  settings: SiteSettings;
  toasts: ToastMessage[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshSettings: () => Promise<void>;
  getWhatsAppLink: (productName?: string) => string;
}

const defaultSettings: SiteSettings = {
  business_name: 'Pooja Boutique and Matching Centre',
  business_type: 'Clothes and Fabric Wholesaler',
  address: 'GS9, 4-100, Buddha Nagar Colony, Mallikarjuna Nagar, Buddha Nagar, Hyderabad, Telangana – 500092',
  phone: '088859 13999',
  whatsapp_number: '918885913999',
  email: 'info@poojaboutique.com',
  business_hours: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM',
  instagram_url: 'https://instagram.com/pooja_boutique_hyd',
  facebook_url: 'https://facebook.com/poojaboutiquehyd',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.574488812683!2d78.5524!3d17.3837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb98a123456789%3A0x123456789abcdef!2sBuddha%20Nagar%20Colony%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pooja_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('pooja_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pooja_cart', JSON.stringify(cart));
  }, [cart]);

  const refreshSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.warn('Using default settings fallback:', err);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to wishlist`, 'success');
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color || product.color, selectedSize: size || product.size }];
    });
    showToast(`Added "${product.name}" to inquiry cart`, 'success');
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getWhatsAppLink = (productName?: string) => {
    const num = settings.whatsapp_number || '918885913999';
    const cleanNum = num.replace(/[^0-9]/g, '');
    let msg = `Hello Pooja Boutique and Matching Centre! I am visiting your website and would like to inquire about your collections.`;
    if (productName) {
      msg = `Hello! I am interested in [${productName}]. Please share price, colors, and availability details.`;
    }
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        wishlist,
        cart,
        settings,
        toasts,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addToCart,
        removeFromCart,
        clearCart,
        showToast,
        removeToast,
        refreshSettings,
        getWhatsAppLink
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
