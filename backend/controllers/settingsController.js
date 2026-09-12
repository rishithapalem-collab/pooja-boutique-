const db = require('../database/db');

// Get All Site Settings
const getSettings = async (req, res, next) => {
  try {
    const rows = await db.all('SELECT * FROM settings');
    const settingsMap = {};
    rows.forEach(r => {
      settingsMap[r.key] = r.value;
    });

    // Provide default fallback values if empty
    const defaultSettings = {
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

    res.json({ settings: { ...defaultSettings, ...settingsMap } });
  } catch (err) {
    next(err);
  }
};

// Update Site Settings (Admin)
const updateSettings = async (req, res, next) => {
  try {
    const newSettings = req.body; // Key-value pairs
    for (const key of Object.keys(newSettings)) {
      const val = String(newSettings[key]);
      const existing = await db.get('SELECT key FROM settings WHERE key = ?', [key]);
      if (existing) {
        await db.run('UPDATE settings SET value = ? WHERE key = ?', [val, key]);
      } else {
        await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, val]);
      }
    }
    res.json({ message: 'Store settings updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Admin Dashboard Summary Statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await db.get('SELECT COUNT(id) as count FROM products');
    const totalCategories = await db.get('SELECT COUNT(id) as count FROM categories');
    const newInquiries = await db.get(`SELECT COUNT(id) as count FROM inquiries WHERE status = 'new'`);
    const totalInquiries = await db.get('SELECT COUNT(id) as count FROM inquiries');
    const customerAccounts = await db.get(`SELECT COUNT(id) as count FROM users WHERE role = 'customer'`);
    const lowStockProducts = await db.get('SELECT COUNT(id) as count FROM products WHERE stock <= 5 AND status != "hidden"');

    const recentInquiries = await db.all(`
      SELECT i.*, p.name as product_name 
      FROM inquiries i 
      LEFT JOIN products p ON i.product_id = p.id 
      ORDER BY i.created_at DESC LIMIT 5
    `);

    const recentProducts = await db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.id DESC LIMIT 5
    `);

    res.json({
      stats: {
        totalProducts: totalProducts.count,
        totalCategories: totalCategories.count,
        newInquiries: newInquiries.count,
        totalInquiries: totalInquiries.count,
        customerAccounts: customerAccounts.count,
        lowStockProducts: lowStockProducts.count
      },
      recentInquiries,
      recentProducts
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getDashboardStats
};
