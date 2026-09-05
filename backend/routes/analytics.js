import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/analytics
router.get('/', (req, res) => {
  try {
    const analytics = store.getAnalytics();
    res.json({ success: true, analytics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
