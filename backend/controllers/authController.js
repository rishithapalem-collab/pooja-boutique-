const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pooja_boutique_secret_jwt_key_2026_hyderabad_wholesaler';

// Customer Registration
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), phone || '', password_hash, 'customer']
    );

    const token = jwt.sign(
      { id: result.id, email: email.toLowerCase().trim(), role: 'customer', name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.id, name: name.trim(), email: email.toLowerCase().trim(), phone: phone || '', role: 'customer' }
    });
  } catch (err) {
    next(err);
  }
};

// Login (Customer or Admin)
const login = async (req, res, next) => {
  try {
    const { email, password, targetRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Role check if admin login is specifically targetted
    if (targetRole === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please enter your registered email address.' });
    }

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    
    // Security: standard success response to avoid email enumeration
    const standardMessage = 'If your email is registered in our system, you will receive password reset instructions shortly.';

    if (!user) {
      return res.json({ message: standardMessage });
    }

    // Rate limiting check: check if a reset token was requested in the last 2 minutes
    const recentToken = await db.get(
      `SELECT id FROM password_reset_tokens WHERE user_id = ? AND created_at > datetime('now', '-2 minutes')`,
      [user.id]
    );

    if (recentToken) {
      return res.status(429).json({ error: 'Password reset already requested recently. Please wait a few minutes before trying again.' });
    }

    // Generate random secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    await db.run(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    console.log(`[PASS RESET] Token generated for ${user.email}: ${resetToken}`);

    // In dev mode, return the token so it can be used directly for seamless testing
    res.json({
      message: standardMessage,
      devResetLink: `/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`,
      devToken: resetToken
    });
  } catch (err) {
    next(err);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
      return res.status(400).json({ error: 'Token, email, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const user = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset link.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await db.get(
      `SELECT * FROM password_reset_tokens 
       WHERE user_id = ? AND token_hash = ? AND used_at IS NULL AND expires_at > datetime('now')`,
      [user.id, tokenHash]
    );

    if (!resetRecord) {
      return res.status(400).json({ error: 'Your password reset link is invalid or has expired.' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, user.id]);

    // Mark token as used
    await db.run(`UPDATE password_reset_tokens SET used_at = datetime('now') WHERE id = ?`, [resetRecord.id]);

    res.json({ message: 'Your password has been successfully reset. You may now log in with your new password.' });
  } catch (err) {
    next(err);
  }
};

// Get Current User Profile
const getProfile = async (req, res, next) => {
  try {
    const user = await db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all customers with inquiry counts
const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await db.all(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
             COUNT(i.id) as inquiry_count
      FROM users u
      LEFT JOIN inquiries i ON u.id = i.customer_id OR u.email = i.email
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ customers });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  getAllCustomers
};
