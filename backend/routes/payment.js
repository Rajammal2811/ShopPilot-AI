import express from 'express';
import { createOrder, verifyPayment, isRazorpayConfigured } from '../services/paymentService.js';

const router = express.Router();

// GET /api/payment/config
router.get('/config', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    isRazorpayConfigured: isRazorpayConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID || null,
    maxOrderValue: 100000
  });
});

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const { items, customer } = req.body || {};
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart cannot be empty" });
    }

    const orderResult = await createOrder(items, customer || {});
    return res.status(200).json({ success: true, ...orderResult });
  } catch (err) {
    console.error("Order creation error:", err.message);
    return res.status(400).json({ success: false, message: err.message || "Failed to create payment order" });
  }
});

// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    const payload = req.body || {};
    const verificationResult = await verifyPayment(payload);
    if (verificationResult.success) {
      return res.status(200).json({ success: true, ...verificationResult });
    } else {
      return res.status(200).json({ success: false, ...verificationResult });
    }
  } catch (err) {
    console.error("Payment verification error:", err.message);
    return res.status(500).json({ success: false, message: err.message || "Payment verification failed" });
  }
});

export default router;
