const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { fetch } = require('undici');

const app = express();

// Allow specific domains for CORS
const allowedOrigins = [
  'https://belto.world', // Frontend domain
  'https://website-3xprmt1x3-beltos-projects.vercel.app', // Vercel deployment domain
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true, // Allow cookies and credentials
}));

// Preflight OPTIONS request
app.options('/chat', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Credentials': 'true' // Allow credentials
  });
  res.sendStatus(204); // No content, just acknowledgment
});

app.use(express.json());

const API_KEY = process.env.API_KEY;
const LLAMA_URL = process.env.LLAMA_URL;

app.post('/chat', async (req, res) => {
  const incomingKey = req.headers['x-api-key'];
  if (incomingKey !== API_KEY) {
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

app.listen(3001, () => console.log('✅ Proxy running on port 3001'));
