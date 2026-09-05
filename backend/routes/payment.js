import express from 'express';
import { createOrder, verifyPayment, isRazorpayConfigured } from '../services/paymentService.js';

const router = express.Router();

// GET /api/payment/config
router.get('/config', (req, res) => {
  res.json({
    success: true,
    isRazorpayConfigured: isRazorpayConfigured(),
    keyId: process.env.RAZORPAY_KEY_ID || null,
    maxOrderValue: 100000
  });
});

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { items, customer } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart cannot be empty" });
    }

    const orderResult = await createOrder(items, customer || {});
    res.json({ success: true, ...orderResult });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const verificationResult = await verifyPayment(req.body);
    if (verificationResult.success) {
      res.json({ success: true, ...verificationResult });
    } else {
      res.status(400).json({ success: false, ...verificationResult });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
