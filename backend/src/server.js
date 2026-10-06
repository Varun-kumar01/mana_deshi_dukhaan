import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDb, isPgActive } from './config/db.js';
import { seedDatabase } from './db/seed.js';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import pincodeRoutes from './routes/pincodeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'ManaDeshi Dukaan by Swathi',
    location: 'Manikonda, Hyderabad',
    database: isPgActive() ? 'PostgreSQL (Connected)' : 'Local High-Performance Store (Ready)',
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>ManaDeshi Dukaan API</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #faf7f2; color: #1e3a27;">
        <h1>🌿 ManaDeshi Dukaan by Swathi - API Server</h1>
        <p>Switch to a healthier lifestyle with our Natural and Organic Products.</p>
        <p>Manikonda, Hyderabad - 500089 | Phone: +91 9951118687</p>
        <p><strong>Status:</strong> Active on port ${PORT}</p>
        <p><strong>Database:</strong> ${isPgActive() ? 'PostgreSQL Active' : 'Zero-Setup Store Active'}</p>
        <hr/>
        <h3>Key API Endpoints:</h3>
        <ul>
          <li><a href="/api/health">/api/health</a> - Server health & DB mode</li>
          <li><a href="/api/products">/api/products</a> - Products catalog</li>
          <li><a href="/api/categories">/api/categories</a> - Product categories</li>
          <li><a href="/api/orders">/api/orders</a> - Orders</li>
          <li><a href="/api/admin/stats">/api/admin/stats</a> - Admin dashboard stats</li>
        </ul>
      </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  await initDb();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🌿 ManaDeshi Dukaan by Swathi - Backend Online`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏪 Location: Manikonda, Hyderabad (Pincode: 500089)`);
    console.log(`📞 Store Support: +91 9951118687`);
    console.log(`======================================================\n`);
  });
}

startServer();
