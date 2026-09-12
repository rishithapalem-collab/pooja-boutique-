const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const db = require('./db');

// Ensure image paths exist or use generated image paths
const BRAIN_DIR = path.resolve(__dirname, '../../../../brain/21d17eaf-a70a-4809-8848-2fd306f2dfb1');

function getBrainImg(filename) {
  const full = path.join(BRAIN_DIR, filename);
  if (fs.existsSync(full)) {
    return `/images/gen/${filename}`;
  }
  return '/images/placeholder.jpg';
}

const seed = async () => {
  try {
    console.log('Seeding initial data for Pooja Boutique database...');

    // Wait 500ms for sqlite schema init if needed
    await new Promise(r => setTimeout(r, 500));

    // 1. Seed Admin & Initial Users
    const adminPasswordHash = await bcrypt.hash('AdminPooja2026!', 10);
    const customerPasswordHash = await bcrypt.hash('Password123!', 10);

    const existingAdmin = await db.get("SELECT id FROM users WHERE email = 'admin@poojaboutique.com'");
    if (!existingAdmin) {
      await db.run(
        "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        ['Pooja Admin', 'admin@poojaboutique.com', '08885913999', adminPasswordHash, 'admin']
      );
      console.log('Seeded Admin account: admin@poojaboutique.com');
    }

    const existingCustomer = await db.get("SELECT id FROM users WHERE email = 'customer@gmail.com'");
    if (!existingCustomer) {
      await db.run(
        "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        ['Anitha Reddy', 'customer@gmail.com', '09876543210', customerPasswordHash, 'customer']
      );
      console.log('Seeded Customer account: customer@gmail.com');
    }

    // 2. Seed Categories
    const categoriesData = [
      { name: "Sarees", description: "Royal Kanchipuram, Banarasi, Cotton, and Designer Sarees", image: "/images/gen/sarees_cat_1789196241255.jpg" },
      { name: "Dress Materials", description: "Unstitched suit sets, salwar materials, and cotton prints", image: "/images/gen/kurtis_cat_1789196424442.jpg" },
      { name: "Kurtis", description: "Anarkali, straight cut, and festive designer kurtis", image: "/images/gen/kurtis_cat_1789196424442.jpg" },
      { name: "Blouses", description: "Readymade heavily embroidered designer blouse pieces", image: "/images/gen/matching_cat_1789196282304.jpg" },
      { name: "Fabrics", description: "Wholesale cotton, silk, georgette, chiffon, linen & embroidered rolls", image: "/images/gen/fabrics_cat_1789196257500.jpg" },
      { name: "Matching Materials", description: "Blouse matching, lining materials, lace, borders & dupattas", image: "/images/gen/matching_cat_1789196282304.jpg" },
      { name: "Lehengas", description: "Bridal and festive partywear designer lehengas", image: "/images/gen/boutique_hero_1789196227098.jpg" },
      { name: "Accessories", description: "Fashion tassels, latkans, borders and saree covers", image: "/images/gen/matching_cat_1789196282304.jpg" }
    ];

    for (const cat of categoriesData) {
      const exists = await db.get("SELECT id FROM categories WHERE name = ?", [cat.name]);
      if (!exists) {
        await db.run(
          "INSERT INTO categories (name, description, image, status) VALUES (?, ?, ?, 'active')",
          [cat.name, cat.description, cat.image]
        );
      }
    }
    console.log('Seeded Categories');

    // Get Category Map
    const cats = await db.all("SELECT id, name FROM categories");
    const catMap = {};
    cats.forEach(c => { catMap[c.name] = c.id; });

    // 3. Seed Products
    const productsData = [
      {
        name: "Royal Kanchipuram Silk Saree",
        category_name: "Sarees",
        description: "Heavy woven pure silk Kanchipuram saree featuring intricate golden zari peacocks and rich contrast pallu. Includes unstitched blouse piece.",
        price: 4850,
        discount_price: 3999,
        fabric: "Pure Silk",
        color: "Maroon & Gold",
        size: "Free Size (6.3m with Blouse)",
        stock: 15,
        status: "active",
        featured: 1,
        new_arrival: 1,
        image_url: "/images/gen/sarees_cat_1789196241255.jpg"
      },
      {
        name: "Designer Floral Printed Cotton Fabric",
        category_name: "Fabrics",
        description: "Premium 100% breathable pure South cotton fabric with handblock floral motifs. Ideal for kurtis, blouses, and designer suits.",
        price: 280,
        discount_price: 220,
        fabric: "Pure Cotton",
        color: "Blush Pink",
        size: "Sold per meter",
        stock: 120,
        status: "active",
        featured: 1,
        new_arrival: 0,
        image_url: "/images/gen/fabrics_cat_1789196257500.jpg"
      },
      {
        name: "Embroidered Georgette Dress Material",
        category_name: "Dress Materials",
        description: "3-piece unstitched designer suit set in soft georgette with heavy threadwork top, santoon bottom & chiffon dupatta.",
        price: 2450,
        discount_price: 1899,
        fabric: "Georgette",
        color: "Emerald Green",
        size: "Unstitched 3 Piece Set",
        stock: 25,
        status: "active",
        featured: 1,
        new_arrival: 1,
        image_url: "/images/gen/kurtis_cat_1789196424442.jpg"
      },
      {
        name: "Heavy Maggam Work Readymade Blouse",
        category_name: "Blouses",
        description: "Raw silk padded readymade blouse with intricate maggam stone and pearl hand embroidery. Padded with inner margin extensions.",
        price: 1650,
        discount_price: 1350,
        fabric: "Raw Silk",
        color: "Royal Blue & Gold",
        size: "Size 38 (Alterable 34-42)",
        stock: 8,
        status: "active",
        featured: 0,
        new_arrival: 1,
        image_url: "/images/gen/matching_cat_1789196282304.jpg"
      },
      {
        name: "Chanderi Silk Lining & Matching Fabric",
        category_name: "Matching Materials",
        description: "Premium smooth lining fabric roll for heavy sarees and silk blouses. Shrink-resistant and color-fast matching material.",
        price: 95,
        discount_price: 80,
        fabric: "Cotton Silk",
        color: "Multiple Colors Available",
        size: "Sold per meter",
        stock: 300,
        status: "active",
        featured: 0,
        new_arrival: 0,
        image_url: "/images/gen/matching_cat_1789196282304.jpg"
      },
      {
        name: "Festive Velvet Zari Border Lace (9 Meters)",
        category_name: "Accessories",
        description: "9-meter roll of luxury velvet border lace with dense zari wire embroidery for customizing dupattas, blouses & sarees.",
        price: 650,
        discount_price: 499,
        fabric: "Velvet Zari",
        color: "Gold & Maroon",
        size: "9 Meters Pack",
        stock: 40,
        status: "active",
        featured: 0,
        new_arrival: 1,
        image_url: "/images/gen/matching_cat_1789196282304.jpg"
      },
      {
        name: "Anarkali Embroidered Flared Kurti",
        category_name: "Kurtis",
        description: "Floor-length rayonne Anarkali kurti with intricate neck thread embroidery and printed flare. Perfect for boutique retail.",
        price: 1850,
        discount_price: 1499,
        fabric: "Rayon",
        color: "Teal Blue",
        size: "M, L, XL, XXL",
        stock: 18,
        status: "active",
        featured: 1,
        new_arrival: 1,
        image_url: "/images/gen/kurtis_cat_1789196424442.jpg"
      },
      {
        name: "Bridal Semi-Stitched Silk Lehenga Set",
        category_name: "Lehengas",
        description: "Grand wedding lehenga in heavy raw silk with dori, sequin, and zari work. Paired with heavy net dupatta.",
        price: 8900,
        discount_price: 7499,
        fabric: "Raw Silk & Net",
        color: "Deep Maroon",
        size: "Semi-Stitched (Up to 44 waist)",
        stock: 5,
        status: "active",
        featured: 1,
        new_arrival: 0,
        image_url: "/images/gen/boutique_hero_1789196227098.jpg"
      }
    ];

    for (const p of productsData) {
      const catId = catMap[p.category_name];
      if (catId) {
        const exists = await db.get("SELECT id FROM products WHERE name = ?", [p.name]);
        if (!exists) {
          await db.run(
            `INSERT INTO products 
             (name, category_id, description, price, discount_price, fabric, color, size, stock, status, featured, new_arrival, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.name,
              catId,
              p.description,
              p.price,
              p.discount_price,
              p.fabric,
              p.color,
              p.size,
              p.stock,
              p.status,
              p.featured,
              p.new_arrival,
              p.image_url
            ]
          );
        }
      }
    }
    console.log('Seeded Products');

    // 4. Seed Gallery Images
    const galleryCount = await db.get("SELECT COUNT(id) as count FROM gallery");
    if (galleryCount.count === 0) {
      const galleryData = [
        { title: "Pooja Boutique Showroom View", image_url: "/images/gen/store_interior_1789196445718.jpg", description: "Our main boutique matching & fabric counter in Hyderabad", category: "Showroom" },
        { title: "Kanchipuram Silk Collection", image_url: "/images/gen/sarees_cat_1789196241255.jpg", description: "Premium wedding & festival silk sarees", category: "Sarees" },
        { title: "Wholesale Fabric Rolls Display", image_url: "/images/gen/fabrics_cat_1789196257500.jpg", description: "Cotton, Georgette, and Chiffon bulk fabric bolts", category: "Fabrics" },
        { title: "Blouse Matching & Lace Borders", image_url: "/images/gen/matching_cat_1789196282304.jpg", description: "Comprehensive matching material & accessory counter", category: "Matching Centre" },
        { title: "Designer Kurtis & Suit Sets", image_url: "/images/gen/kurtis_cat_1789196424442.jpg", description: "Latest seasonal designer women wear collection", category: "Kurtis" },
        { title: "Boutique Main Interior", image_url: "/images/gen/boutique_hero_1789196227098.jpg", description: "Warm gold & maroon boutique decor ambiance", category: "Showroom" }
      ];

      for (const g of galleryData) {
        await db.run(
          "INSERT INTO gallery (title, image_url, description, category) VALUES (?, ?, ?, ?)",
          [g.title, g.image_url, g.description, g.category]
        );
      }
      console.log('Seeded Gallery');
    }

    // 5. Seed Promotional Offers
    const offersCount = await db.get("SELECT COUNT(id) as count FROM offers");
    if (offersCount.count === 0) {
      const offersData = [
        {
          title: "Wholesale Fabric Bulk Discount",
          description: "Get up to 25% OFF on orders over 50 meters of cotton, georgette, or silk fabric rolls. Perfect for boutique owners & tailors.",
          discount_tag: "25% OFF BULK",
          image: "/images/gen/fabrics_cat_1789196257500.jpg",
          status: "active",
          valid_until: "2026-12-31"
        },
        {
          title: "Festive Saree Collection Arrival",
          description: "Exclusive festive launch of authentic Kanchipuram and Banarasi silk sarees with complimentary blouse matching assistance.",
          discount_tag: "SPECIAL FESTIVE OFFER",
          image: "/images/gen/sarees_cat_1789196241255.jpg",
          status: "active",
          valid_until: "2026-11-15"
        },
        {
          title: "Designer Blouse & Lining Combo",
          description: "Buy any readymade Maggam blouse and get 2 meters of premium cotton silk lining material at 50% discount.",
          discount_tag: "50% OFF LINING",
          image: "/images/gen/matching_cat_1789196282304.jpg",
          status: "active",
          valid_until: "2026-10-31"
        }
      ];

      for (const o of offersData) {
        await db.run(
          "INSERT INTO offers (title, description, discount_tag, image, status, valid_until) VALUES (?, ?, ?, ?, ?, ?)",
          [o.title, o.description, o.discount_tag, o.image, o.status, o.valid_until]
        );
      }
      console.log('Seeded Offers');
    }

    // 6. Seed Site Settings
    const defaultSettings = [
      { key: 'business_name', value: 'Pooja Boutique and Matching Centre' },
      { key: 'business_type', value: 'Clothes and Fabric Wholesaler' },
      { key: 'address', value: 'GS9, 4-100, Buddha Nagar Colony, Mallikarjuna Nagar, Buddha Nagar, Hyderabad, Telangana – 500092' },
      { key: 'phone', value: '088859 13999' },
      { key: 'whatsapp_number', value: '918885913999' },
      { key: 'email', value: 'info@poojaboutique.com' },
      { key: 'business_hours', value: 'Monday - Saturday: 10:00 AM - 9:00 PM | Sunday: 11:00 AM - 7:00 PM' },
      { key: 'instagram_url', value: 'https://instagram.com/pooja_boutique_hyd' },
      { key: 'facebook_url', value: 'https://facebook.com/poojaboutiquehyd' },
      { key: 'google_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.574488812683!2d78.5524!3d17.3837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb98a123456789%3A0x123456789abcdef!2sBuddha%20Nagar%20Colony%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin' }
    ];

    for (const s of defaultSettings) {
      const exists = await db.get("SELECT key FROM settings WHERE key = ?", [s.key]);
      if (!exists) {
        await db.run("INSERT INTO settings (key, value) VALUES (?, ?)", [s.key, s.value]);
      }
    }
    console.log('Seeded Settings');

    // 7. Seed Sample Inquiry
    const inqCount = await db.get("SELECT COUNT(id) as count FROM inquiries");
    if (inqCount.count === 0) {
      await db.run(
        `INSERT INTO inquiries (customer_id, product_id, name, email, phone, message, status)
         VALUES (2, 1, 'Anitha Reddy', 'customer@gmail.com', '09876543210', 'Hi, I am interested in ordering 5 sarees for a family function. Do you provide wholesale discount?', 'new')`
      );
      console.log('Seeded Sample Inquiry');
    }

    console.log('Database seeding complete successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = seed;
