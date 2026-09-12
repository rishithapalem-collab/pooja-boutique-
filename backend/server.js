const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./database/db');
const seed = require('./database/seed');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const galleryRoutes = require('./routes/gallery.routes');
const offerRoutes = require('./routes/offer.routes');
const settingsRoutes = require('./routes/settings.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Static Asset Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve generated images directly from the artifact directory if requested
const BRAIN_DIR = path.resolve(__dirname, '../../../brain/21d17eaf-a70a-4809-8848-2fd306f2dfb1');
app.use('/images/gen', express.static(BRAIN_DIR));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', store: 'Pooja Boutique and Matching Centre', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

// Run auto-seed and start server
seed().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Pooja Boutique & Matching Centre REST API Server `);
    console.log(` Running at: http://localhost:${PORT}`);
    console.log(` Admin Portal API: http://localhost:${PORT}/api/auth/login`);
    console.log(`=======================================================`);
  });
});
