const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Allow frontend origins
app.use(cors({
  origin: '*', // or ['https://belto.world'] if you want to restrict it
  methods: ['POST']
}));

app.use(express.json());

// This is the only endpoint your frontend will call
app.post('/chat', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:11434/completion', req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy failed' });
  }
});

app.listen(3001, () => console.log('✅ Belto Proxy running on http://localhost:3001'));
