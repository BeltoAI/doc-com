const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { fetch } = require('undici');

const app = express();

// List of allowed domains
const allowedOrigins = [
  'https://belto.world',
  'https://website-4tbxmnzk06-beltos-projects.vercel.app',
  'https://website-mm7t14b4e-beltos-projects.vercel.app/'
];

app.use(cors({
  origin: allowedOrigins,  // Allow the frontend domains listed above
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  credentials: true,  // Allow cookies and credentials
}));

// Preflight OPTIONS request
app.options('/chat', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Allow-Credentials': 'true',  // Allow cookies
  });
  res.sendStatus(204);  // Send a successful response
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
