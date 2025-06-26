const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: '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',
  organization: 'org-yrIRGqRGjK6G9jvQw4jDJ5J0'
});

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  console.log("🔍 User description:", query);

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Suggest 3 movies based on this description: "${query}"`
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: 'asst_nlWegWGg7C1YPcF6Tvg2BmDQ'
    });

    let result;
    while (true) {
      result = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (result.status === "completed") break;
      if (["failed", "cancelled", "expired"].includes(result.status)) {
        throw new Error(`Assistant run failed with status: ${result.status}`);
      }
      await new Promise((res) => setTimeout(res, 1000));
    }

    const messages = await openai.beta.threads.messages.list(thread.id);
    const rawText = messages.data[0].content[0].text.value;
    console.log("🧠 Assistant response:", rawText);

    let movies;
    try {
      movies = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ JSON parse failed. Raw text:", rawText);
      movies = [];
    }

    const withLinks = movies.map(movie => ({
      ...movie,
      affiliateLink: `https://www.amazon.com/s?k=${encodeURIComponent(movie.title)}&tag=yourtag-20`
    }));

    res.json({ movies: withLinks });
  } catch (err) {
    console.error("🔥 OpenAI Assistants API error:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Assistant AI search failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 AI Movie Search backend running at http://localhost:${port}`);
});