const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const requiredEnv = ['OPENAI_API_KEY', 'OPENAI_ORG_ID'];
const missing = requiredEnv.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(
    `Missing required environment variables: ${missing.join(', ')}`
  );
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;



app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

// basic health check route
app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

// legacy search route used by tests
app.post('/api/search', (req, res) => {
  const { query } = req.body;
  if (typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ error: 'Query must be a non-empty string' });
  }
  res.json({ movies: [] });
});

// conversational chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, file } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages must be an array' });
  }

  const chatMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const systemPrompt =
    'You are a helpful assistant that identifies movies from descriptions or images. ' +
    'If you are at least 80% certain of a single movie, respond with JSON like ' +
    '{"title":"Movie title","imdb":"https://www.imdb.com/title/tt1234567/"}. ' +
    'Otherwise ask a short clarifying question.';

  chatMessages.unshift({ role: 'system', content: systemPrompt });

  if (file && file.data && file.name) {
    chatMessages.push({
      role: 'user',
      content: [
        { type: 'text', text: messages[messages.length - 1].content || '' },
        {
          type: 'image_url',
          image_url: { url: `data:application/octet-stream;base64,${file.data}` },
        },
      ],
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: chatMessages,
    });

    const text = completion.choices[0].message.content.trim();
    let message = { role: 'assistant', content: text };
    try {
      const parsed = JSON.parse(text);
      if (parsed.imdb) {
        message = {
          role: 'assistant',
          content: `I think the movie is ${parsed.title}.`,
          imdb: parsed.imdb,
        };
      }
    } catch (_) {}

    res.json({ message });
  } catch (err) {
    console.error('OpenAI chat error:', err);
    res.status(500).json({ error: 'Assistant failure' });
  }
});


if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 AI Movie Search backend running at http://localhost:${port}`);
  });
}

module.exports = app;

