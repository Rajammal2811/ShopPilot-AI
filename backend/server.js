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
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id', 'Accept']
}));
app.options('*', cors());
app.use(express.json());

// Optional MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB database successfully.'))
    .catch((err) => console.warn('MongoDB connection warning (using in-memory store fallback):', err.message));
} else {
  console.log('No MONGODB_URI provided. Running with fast in-memory store persistence.');
}

// Health check handler (always returns JSON)
const healthHandler = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    status: 'online',
    app: 'ShopPilot AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    mongoConfigured: Boolean(process.env.MONGODB_URI)
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// API Routes - Register on both /api and root '' so serverless rewrites and proxies never 404
const registerRoutes = (prefix = '/api') => {
  app.use(`${prefix}/products`, productsRouter);
  app.use(`${prefix}/ai`, aiRouter);
  app.use(`${prefix}/cart`, cartRouter);
  app.use(`${prefix}/payment`, paymentRouter);
  app.use(`${prefix}/orders`, ordersRouter);
  app.use(`${prefix}/audit`, auditRouter);
  app.use(`${prefix}/analytics`, analyticsRouter);
};

registerRoutes('/api');
registerRoutes('');

// 404 Route handler - Always return strict JSON, never HTML
app.use((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler - Always return strict JSON, never HTML
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message 
  });
});

// Start listener for standalone/local dev execution
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ShopPilot AI Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
