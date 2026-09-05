import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import productsRouter from './routes/products.js';
import aiRouter from './routes/ai.js';
import cartRouter from './routes/cart.js';
import paymentRouter from './routes/payment.js';
import ordersRouter from './routes/orders.js';
import auditRouter from './routes/audit.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));
app.use(express.json());

// Optional MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB database successfully.'))
    .catch((err) => console.warn('MongoDB connection warning (using in-memory store fallback):', err.message));
} else {
  console.log('No MONGODB_URI provided. Running with fast in-memory store persistence.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ShopPilot AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    mongoConfigured: Boolean(process.env.MONGODB_URI)
  });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/audit', auditRouter);
app.use('/api/analytics', analyticsRouter);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 ShopPilot AI Backend Server running on http://localhost:${PORT}`);
});
