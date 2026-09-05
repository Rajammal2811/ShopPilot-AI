import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/cart
router.get('/', (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default';
    const cart = store.getCart(sessionId);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/cart
router.post('/', (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'default';
    const { items } = req.body;

    let subtotal = 0;
    let upsellTotal = 0;

    (items || []).forEach(item => {
      const itemPrice = item.price || 0;
      const qty = item.quantity || 1;
      subtotal += itemPrice * qty;
      if (item.isUpsell) {
        upsellTotal += itemPrice * qty;
      }
    });

    const cartData = {
      items: items || [],
      subtotal,
      upsellTotal,
      total: subtotal
    };

    store.updateCart(sessionId, cartData);
    res.json({ success: true, cart: cartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
