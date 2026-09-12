const db = require('../database/db');

// Submit Inquiry (Customer)
const createInquiry = async (req, res, next) => {
  try {
    const { product_id, name, email, phone, message } = req.body;
    const customer_id = req.user ? req.user.id : null;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Name, email, phone number, and message are required.' });
    }

    const result = await db.run(
      `INSERT INTO inquiries (customer_id, product_id, name, email, phone, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [customer_id, product_id || null, name.trim(), email.trim(), phone.trim(), message.trim()]
    );

    const inquiry = await db.get('SELECT * FROM inquiries WHERE id = ?', [result.id]);
    res.status(201).json({ message: 'Thank you! Your inquiry has been submitted. We will contact you soon.', inquiry });
  } catch (err) {
    next(err);
  }
};

// List Inquiries (Admin)
const getInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT i.*, p.name as product_name, p.image_url as product_image 
      FROM inquiries i 
      LEFT JOIN products p ON i.product_id = p.id
    `;
    const params = [];

    if (status) {
      sql += ` WHERE i.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY i.created_at DESC`;

    const inquiries = await db.all(sql, params);
    res.json({ inquiries });
  } catch (err) {
    next(err);
  }
};

// Update Inquiry Status (Admin: new -> contacted -> completed)
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    const updated = await db.get('SELECT * FROM inquiries WHERE id = ?', [id]);
    res.json({ message: 'Inquiry status updated', inquiry: updated });
  } catch (err) {
    next(err);
  }
};

// Delete Inquiry (Admin)
const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM inquiries WHERE id = ?', [id]);
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
};
