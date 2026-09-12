import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { Category, Product, Inquiry, GalleryItem, Offer, SiteSettings, User } from '../types';
import {
  LayoutDashboard,
  Package,
  Layers,
  Inbox,
  Users,
  Image as ImageIcon,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  MessageCircle,
  LogOut,
  X,
  Save,
  Eye
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const { showToast, refreshSettings } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'inquiries' | 'customers' | 'gallery' | 'offers' | 'settings'>('overview');

  // Stats & Data State
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({
    business_name: '',
    business_type: '',
    address: '',
    phone: '',
    whatsapp_number: '',
    email: '',
    business_hours: '',
    instagram_url: '',
    facebook_url: '',
    google_maps_embed: ''
  });

  const [loading, setLoading] = useState(true);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<any>({
    name: '',
    category_id: 1,
    description: '',
    price: 0,
    discount_price: 0,
    fabric: '',
    color: '',
    size: '',
    stock: 10,
    status: 'active',
    featured: 0,
    new_arrival: 0,
    image_url: '/images/gen/sarees_cat_1789196241255.jpg'
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<any>({
    name: '',
    description: '',
    image: '/images/gen/fabrics_cat_1789196257500.jpg',
    status: 'active'
  });

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<any>({
    title: '',
    description: '',
    category: 'Showroom',
    image_url: '/images/gen/store_interior_1789196445718.jpg'
  });

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState<any>({
    title: '',
    description: '',
    discount_tag: '',
    image: '/images/gen/fabrics_cat_1789196257500.jpg',
    status: 'active',
    valid_until: ''
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        prodRes,
        catRes,
        inqRes,
        custRes,
        galRes,
        offRes,
        settRes
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getProducts({ includeHidden: 'true' }),
        api.getCategories(true),
        api.getInquiries(),
        api.getCustomers(),
        api.getGallery(),
        api.getOffers(true),
        api.getSettings()
      ]);

      setStats(statsRes.stats);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setInquiries(inqRes.inquiries || []);
      setCustomers(custRes.customers || []);
      setGallery(galRes.gallery || []);
      setOffers(offRes.offers || []);
      if (settRes.settings) {
        setSettingsForm(settRes.settings);
      }
    } catch (err: any) {
      console.error('Error loading admin dashboard:', err);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-serif font-bold text-2xl text-red-600">Admin Privileges Required</h2>
        <p className="text-sm text-gray-600">Please log in as an administrator to access the store console.</p>
        <button
          onClick={() => onNavigate('admin-login')}
          className="bg-boutique-700 text-white font-bold px-6 py-2 rounded-xl text-sm"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        showToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(productForm);
        showToast('New product added to catalog!', 'success');
      }
      setProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        showToast('Product deleted', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryForm);
        showToast('Category updated!', 'success');
      } else {
        await api.createCategory(categoryForm);
        showToast('Category created!', 'success');
      }
      setCategoryModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        showToast('Category deleted', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete category', 'error');
      }
    }
  };

  // Handle Inquiry Status
  const handleInquiryStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      showToast(`Inquiry status updated to ${newStatus}`, 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Handle Gallery
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createGalleryItem(galleryForm);
      showToast('Gallery item added', 'success');
      setGalleryModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add gallery item', 'error');
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (window.confirm('Delete this gallery photo?')) {
      try {
        await api.deleteGalleryItem(id);
        showToast('Gallery photo deleted', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete photo', 'error');
      }
    }
  };

  // Handle Offers
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await api.updateOffer(editingOffer.id, offerForm);
        showToast('Offer updated', 'success');
      } else {
        await api.createOffer(offerForm);
        showToast('Offer created', 'success');
      }
      setOfferModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save offer', 'error');
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (window.confirm('Delete this promotional offer?')) {
      try {
        await api.deleteOffer(id);
        showToast('Offer deleted', 'info');
        loadDashboardData();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete offer', 'error');
      }
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      await refreshSettings();
      showToast('Store business settings updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Top Header */}
      <div className="bg-boutique-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl border-2 border-gold-500">
        <div>
          <span className="text-gold-400 text-xs uppercase font-extrabold tracking-widest">Management Console</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Pooja Boutique Control Center
          </h1>
          <p className="text-xs text-gray-300 mt-1">Logged in as Administrator: <strong>{user?.name}</strong> ({user?.email})</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="bg-boutique-800 hover:bg-boutique-700 text-gold-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-boutique-700"
          >
            <Eye className="w-4 h-4" /> View Main Website
          </button>
          <button
            onClick={() => {
              logout();
              onNavigate('admin-login');
            }}
            className="bg-red-800 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'offers', label: 'Offers', icon: Tag },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-boutique-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-boutique-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Products</span>
              <h3 className="text-2xl font-extrabold text-boutique-900">{stats?.totalProducts || products.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Categories</span>
              <h3 className="text-2xl font-extrabold text-boutique-900">{stats?.totalCategories || categories.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-amber-200 bg-amber-50/50 space-y-1">
              <span className="text-xs text-amber-800 font-medium">New Inquiries</span>
              <h3 className="text-2xl font-extrabold text-amber-700">{stats?.newInquiries || inquiries.filter(i => i.status === 'new').length}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Customer Accounts</span>
              <h3 className="text-2xl font-extrabold text-boutique-900">{stats?.customerAccounts || customers.length}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 bg-red-50/50 space-y-1">
              <span className="text-xs text-red-800 font-medium">Low Stock Items</span>
              <h3 className="text-2xl font-extrabold text-red-700">{stats?.lowStockProducts || products.filter(p => p.stock <= 5).length}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Inquiries</span>
              <h3 className="text-2xl font-extrabold text-boutique-900">{stats?.totalInquiries || inquiries.length}</h3>
            </div>
          </div>

          {/* Recent Inquiries List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-serif font-bold text-lg text-boutique-900">Recent Customer Inquiries</h3>
              <button onClick={() => setActiveTab('inquiries')} className="text-xs font-bold text-boutique-700">View All</button>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No customer inquiries submitted yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <strong className="text-gray-900 text-sm block">{inq.name}</strong>
                      <span className="text-gray-500">{inq.phone} • {inq.email}</span>
                      {inq.product_name && (
                        <p className="text-gold-700 font-semibold mt-0.5">Item: {inq.product_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-boutique-900">Product Management</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  category_id: categories[0]?.id || 1,
                  description: '',
                  price: 0,
                  discount_price: 0,
                  fabric: '',
                  color: '',
                  size: '',
                  stock: 10,
                  status: 'active',
                  featured: 0,
                  new_arrival: 0,
                  image_url: '/images/gen/sarees_cat_1789196241255.jpg'
                });
                setProductModalOpen(true);
              }}
              className="bg-boutique-700 hover:bg-boutique-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-boutique-50 border-b border-boutique-100 text-boutique-900 font-bold uppercase tracking-wider">
                  <th className="p-4">Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="p-4">
                      <strong className="text-gray-900 block text-sm">{p.name}</strong>
                      <span className="text-gray-500">{p.fabric || 'Fabric'} • {p.color || 'Multi'}</span>
                    </td>
                    <td className="p-4 font-semibold text-gray-700">{p.category_name || 'Category'}</td>
                    <td className="p-4 font-bold text-boutique-900">₹{p.price}</td>
                    <td className="p-4">
                      <span className={`font-bold ${p.stock <= 5 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        p.status === 'out_of_stock' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setProductForm({
                            name: p.name,
                            category_id: p.category_id,
                            description: p.description,
                            price: p.price,
                            discount_price: p.discount_price,
                            fabric: p.fabric || '',
                            color: p.color || '',
                            size: p.size || '',
                            stock: p.stock,
                            status: p.status,
                            featured: p.featured,
                            new_arrival: p.new_arrival,
                            image_url: p.image_url
                          });
                          setProductModalOpen(true);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-boutique-900">Category Management</h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '', image: '/images/gen/fabrics_cat_1789196257500.jpg', status: 'active' });
                setCategoryModalOpen(true);
              }}
              className="bg-boutique-700 hover:bg-boutique-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4 space-y-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="w-14 h-14 object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.product_count || 0} products</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ name: c.name, description: c.description || '', image: c.image || '', status: c.status || 'active' });
                      setCategoryModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-boutique-900">Customer Inquiries</h2>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-boutique-50 border-b border-boutique-100 text-boutique-900 font-bold uppercase tracking-wider">
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Product Requested</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <strong className="text-gray-900 block text-sm">{inq.name}</strong>
                      <span className="text-gray-500 block">{inq.phone}</span>
                      <span className="text-gray-400">{inq.email}</span>
                    </td>
                    <td className="p-4 font-semibold text-gold-700">
                      {inq.product_name || 'General Inquiry'}
                    </td>
                    <td className="p-4 text-gray-700 max-w-xs">{inq.message}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        inq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        inq.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleInquiryStatusChange(inq.id, 'contacted')}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold"
                      >
                        Mark Contacted
                      </button>
                      <button
                        onClick={() => handleInquiryStatusChange(inq.id, 'completed')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold"
                      >
                        Mark Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-boutique-900">Registered Customer Accounts</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-boutique-50 border-b border-boutique-100 text-boutique-900 font-bold uppercase tracking-wider">
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-bold text-gray-900">{c.name}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 text-gray-600">{c.phone || 'N/A'}</td>
                    <td className="p-4 text-gray-400">{c.created_at || 'Recent'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-boutique-900">Gallery Image Management</h2>
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="bg-boutique-700 hover:bg-boutique-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add Gallery Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4 space-y-3">
                <img src={g.image_url} alt={g.title} className="w-full h-40 object-cover rounded-xl" />
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{g.title}</h4>
                    <span className="text-xs text-gold-600">{g.category}</span>
                  </div>
                  <button onClick={() => handleDeleteGallery(g.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif font-bold text-xl text-boutique-900">Promotional Offers Management</h2>
            <button
              onClick={() => {
                setEditingOffer(null);
                setOfferForm({ title: '', description: '', discount_tag: '', image: '/images/gen/fabrics_cat_1789196257500.jpg', status: 'active', valid_until: '' });
                setOfferModalOpen(true);
              }}
              className="bg-boutique-700 hover:bg-boutique-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Create Offer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {offers.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3 flex justify-between">
                <div className="space-y-1">
                  <span className="bg-gold-500/20 text-gold-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {o.discount_tag || 'Special'}
                  </span>
                  <h4 className="font-serif font-bold text-base text-gray-900">{o.title}</h4>
                  <p className="text-xs text-gray-600">{o.description}</p>
                </div>
                <button onClick={() => handleDeleteOffer(o.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg self-start">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 max-w-3xl">
          <h2 className="font-serif font-bold text-xl text-boutique-900 border-b pb-4">
            Store Business Settings
          </h2>
          <p className="text-xs text-gray-500">
            Update store contact information, phone numbers, location address, and social links displayed across the website.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={settingsForm.business_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, business_name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">WhatsApp Number (with country code)</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp_number}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Store Email Address</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Physical Address</label>
              <textarea
                rows={2}
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Business Hours</label>
              <input
                type="text"
                value={settingsForm.business_hours}
                onChange={(e) => setSettingsForm({ ...settingsForm, business_hours: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={settingsForm.instagram_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={settingsForm.facebook_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebook_url: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Google Maps Embed Link</label>
              <input
                type="text"
                value={settingsForm.google_maps_embed}
                onChange={(e) => setSettingsForm({ ...settingsForm, google_maps_embed: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-boutique-700"
              />
            </div>

            <button
              type="submit"
              className="bg-boutique-700 hover:bg-boutique-800 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" /> Save Business Settings
            </button>
          </form>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <button onClick={() => setProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif font-bold text-xl text-boutique-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: parseInt(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Fabric Type</label>
                  <input
                    type="text"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    placeholder="e.g. Pure Silk, Cotton"
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({ ...productForm, discount_price: parseFloat(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Size / Length</label>
                  <input
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured === 1}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked ? 1 : 0 })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.new_arrival === 1}
                    onChange={(e) => setProductForm({ ...productForm, new_arrival: e.target.checked ? 1 : 0 })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-boutique-700 text-white font-bold py-3 rounded-xl text-sm shadow"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
