const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { fetch } = require('undici');

const app = express();

// ✅ Adjust this list based on actual frontend domains (Vercel + custom)
const allowedOrigins = [
  'https://belto.world',
  'https://website-3xprmt1x3-beltos-projects.vercel.app' // <-- Add your Vercel deployment domain
];

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin)) {
    callback(null, {
      origin: origin,
      methods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-api-key'],
      credentials: false
    });
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptionsDelegate)); // CORS setup

app.use(express.json());

const API_KEY = process.env.API_KEY;
const LLAMA_URL = process.env.LLAMA_URL;

// CORS pre-flight request handling
app.options('/chat', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
  });
  res.sendStatus(204);
});

// Handle chat request
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

// Start the server
app.listen(3001, () => {
  console.log('✅ Proxy running on port 3001');
});

