import express from 'express';
import { processAIChat } from '../services/aiService.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: "Valid prompt required" });
    }

    const result = await processAIChat(prompt);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await processAIChat(prompt || "best recommended products");
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
