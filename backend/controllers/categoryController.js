const db = require('../database/db');

// List Categories
const getCategories = async (req, res, next) => {
  try {
    const { includeHidden } = req.query;
    let sql = `SELECT c.*, COUNT(p.id) as product_count 
               FROM categories c 
               LEFT JOIN products p ON c.id = p.category_id AND p.status != 'hidden'`;
    
    if (!includeHidden || includeHidden !== 'true') {
      sql += ` WHERE c.status = 'active'`;
    }
    
    sql += ` GROUP BY c.id ORDER BY c.name ASC`;
    
    const categories = await db.all(sql);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

// Create Category (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existing = await db.get('SELECT id FROM categories WHERE name = ?', [name.trim()]);
    if (existing) {
      return res.status(409).json({ error: 'Category with this name already exists' });
    }

    const result = await db.run(
      'INSERT INTO categories (name, description, image, status) VALUES (?, ?, ?, ?)',
      [name.trim(), description || '', image || '/images/default_category.jpg', status || 'active']
    );

    const created = await db.get('SELECT * FROM categories WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Category created successfully', category: created });
  } catch (err) {
    next(err);
  }
};

// Update Category (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, status } = req.body;

    await db.run(
      'UPDATE categories SET name = ?, description = ?, image = ?, status = ? WHERE id = ?',
      [name, description, image, status, id]
    );

    const updated = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category updated successfully', category: updated });
  } catch (err) {
    next(err);
  }
};

// Delete Category (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
