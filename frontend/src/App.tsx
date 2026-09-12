import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ToastContainer } from './components/common/Toast';
import { ProductDetailModal } from './components/products/ProductDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { OffersPage } from './pages/OffersPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminForgotPasswordPage } from './pages/AdminForgotPasswordPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Product } from './types';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Extra state for password reset token
  const [resetToken, setResetToken] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');

  const handleNavigate = (page: string, extraFilter?: string) => {
    // If page string includes query parameters (e.g. collections?search=...)
    if (page.startsWith('collections?search=')) {
      const q = decodeURIComponent(page.split('=')[1]);
      setSearchQuery(q);
      setCategoryFilter('');
      setActivePage('collections');
    } else {
      setActivePage(page);
      if (extraFilter) {
        setCategoryFilter(extraFilter);
      } else if (page === 'collections') {
        setCategoryFilter('');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResetPassword = (page: string, token?: string, email?: string) => {
    if (token) setResetToken(token);
    if (email) setResetEmail(email);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream text-gray-900 font-sans selection:bg-boutique-700 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenProductModal={setSelectedProduct}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewProduct={setSelectedProduct}
          />
        )}

        {activePage === 'about' && (
          <AboutPage />
        )}

        {activePage === 'collections' && (
          <CollectionsPage
            initialCategory={categoryFilter}
            initialSearch={searchQuery}
            onViewProduct={setSelectedProduct}
          />
        )}

        {activePage === 'gallery' && (
          <GalleryPage />
        )}

        {activePage === 'offers' && (
          <OffersPage />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {activePage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}

        {activePage === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleOpenResetPassword} />
        )}

        {activePage === 'reset-password' && (
          <ResetPasswordPage
            token={resetToken}
            email={resetEmail}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'admin-login' && (
          <AdminLoginPage onNavigate={handleNavigate} />
        )}

        {activePage === 'admin-forgot-password' && (
          <AdminForgotPasswordPage onNavigate={handleOpenResetPassword} />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectRelated={setSelectedProduct}
        />
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
};

export default App;
