import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

// GET /api/audit
router.get('/', (req, res) => {
  try {
    const auditLogs = store.getAuditLogs();
    res.json({ success: true, count: auditLogs.length, logs: auditLogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
