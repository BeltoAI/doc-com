const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { fetch } = require('undici');

const app = express();

const allowedOrigins = [
  'https://belto.world',
  'https://website-3xprmt1x3-beltos-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.options('/chat', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
  });
  res.sendStatus(204);
});

app.use(express.json());

const API_KEY = process.env.API_KEY;
const LLAMA_URL = process.env.LLAMA_URL;

app.post('/chat', async (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const response = await fetch(`${LLAMA_URL}/completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

app.listen(3001, () => console.log('✅ Proxy running on http://localhost:3001'));
