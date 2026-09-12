const db = require('../database/db');

// List Gallery Items
const getGallery = async (req, res, next) => {
  try {
    const gallery = await db.all('SELECT * FROM gallery ORDER BY id DESC');
    res.json({ gallery });
  } catch (err) {
    next(err);
  }
};

// Add Gallery Item (Admin)
const createGalleryItem = async (req, res, next) => {
  try {
    const { image_url, title, description, category } = req.body;
    if (!image_url || !title) {
      return res.status(400).json({ error: 'Image URL and Title are required' });
    }

    const result = await db.run(
      'INSERT INTO gallery (image_url, title, description, category) VALUES (?, ?, ?, ?)',
      [image_url, title, description || '', category || 'Store']
    );

    const item = await db.get('SELECT * FROM gallery WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Gallery item added', item });
  } catch (err) {
    next(err);
  }
};

// Delete Gallery Item (Admin)
const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  deleteGalleryItem
};
