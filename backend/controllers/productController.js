const db = require('../database/db');

// List Products with Filters
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      fabric,
      color,
      search,
      featured,
      newArrival,
      minPrice,
      maxPrice,
      sort,
      includeHidden
    } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by visibility (unless admin explicitly includes hidden)
    if (!includeHidden || includeHidden !== 'true') {
      query += ` AND p.status != 'hidden'`;
    }

    if (category) {
      query += ` AND (c.name = ? OR p.category_id = ?)`;
      params.push(category, category);
    }

    if (fabric) {
      query += ` AND p.fabric LIKE ?`;
      params.push(`%${fabric}%`);
    }

    if (color) {
      query += ` AND p.color LIKE ?`;
      params.push(`%${color}%`);
    }

    if (featured === 'true') {
      query += ` AND p.featured = 1`;
    }

    if (newArrival === 'true') {
      query += ` AND p.new_arrival = 1`;
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.fabric LIKE ? OR c.name LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY p.price DESC`;
    } else if (sort === 'newest') {
      query += ` ORDER BY p.created_at DESC`;
    } else if (sort === 'popular') {
      query += ` ORDER BY p.featured DESC, p.id DESC`;
    } else {
      query += ` ORDER BY p.id DESC`;
    }

    const products = await db.all(query, params);
    res.json({ count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// Get single product
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await db.get(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Fetch related images
    const extraImages = await db.all('SELECT * FROM product_images WHERE product_id = ?', [id]);
    
    // Fetch related products from same category
    const relatedProducts = await db.all(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = ? AND p.id != ? AND p.status != 'hidden'
       LIMIT 4`,
      [product.category_id, id]
    );

    res.json({ product, extraImages, relatedProducts });
  } catch (err) {
    next(err);
  }
};

// Create product (Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category_id,
      description,
      price,
      discount_price,
      fabric,
      color,
      size,
      stock,
      status,
      featured,
      new_arrival,
      image_url
    } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({ error: 'Product name and category are required.' });
    }

    const result = await db.run(
      `INSERT INTO products 
       (name, category_id, description, price, discount_price, fabric, color, size, stock, status, featured, new_arrival, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        category_id,
        description || '',
        price || 0,
        discount_price || 0,
        fabric || '',
        color || '',
        size || '',
        stock !== undefined ? parseInt(stock) : 10,
        status || 'active',
        featured ? 1 : 0,
        new_arrival ? 1 : 0,
        image_url || '/images/default_product.jpg'
      ]
    );

    const createdProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Product created successfully', product: createdProduct });
  } catch (err) {
    next(err);
  }
};

// Update product (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      description,
      price,
      discount_price,
      fabric,
      color,
      size,
      stock,
      status,
      featured,
      new_arrival,
      image_url
    } = req.body;

    const existing = await db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await db.run(
      `UPDATE products 
       SET name = ?, category_id = ?, description = ?, price = ?, discount_price = ?, 
           fabric = ?, color = ?, size = ?, stock = ?, status = ?, featured = ?, new_arrival = ?, image_url = ?
       WHERE id = ?`,
      [
        name,
        category_id,
        description,
        price,
        discount_price,
        fabric,
        color,
        size,
        stock,
        status,
        featured ? 1 : 0,
        new_arrival ? 1 : 0,
        image_url,
        id
      ]
    );

    const updated = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product updated successfully', product: updated });
  } catch (err) {
    next(err);
  }
};

// Delete product (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
