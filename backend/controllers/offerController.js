const db = require('../database/db');

// List Offers
const getOffers = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    let sql = 'SELECT * FROM offers';
    if (!includeInactive || includeInactive !== 'true') {
      sql += " WHERE status = 'active'";
    }
    sql += ' ORDER BY id DESC';

    const offers = await db.all(sql);
    res.json({ offers });
  } catch (err) {
    next(err);
  }
};

// Create Offer (Admin)
const createOffer = async (req, res, next) => {
  try {
    const { title, description, discount_tag, image, status, valid_until } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await db.run(
      'INSERT INTO offers (title, description, discount_tag, image, status, valid_until) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || '', discount_tag || '', image || '/images/default_offer.jpg', status || 'active', valid_until || '']
    );

    const offer = await db.get('SELECT * FROM offers WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (err) {
    next(err);
  }
};

// Update Offer (Admin)
const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, discount_tag, image, status, valid_until } = req.body;

    await db.run(
      'UPDATE offers SET title = ?, description = ?, discount_tag = ?, image = ?, status = ?, valid_until = ? WHERE id = ?',
      [title, description, discount_tag, image, status, valid_until, id]
    );

    const updated = await db.get('SELECT * FROM offers WHERE id = ?', [id]);
    res.json({ message: 'Offer updated successfully', offer: updated });
  } catch (err) {
    next(err);
  }
};

// Delete Offer (Admin)
const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM offers WHERE id = ?', [id]);
    res.json({ message: 'Offer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer
};
