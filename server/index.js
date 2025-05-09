const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  console.log("🔍 User description:", query);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that recommends real, well-known movies based on vague plot descriptions. Respond with only a JSON array of 3 movie objects. Each object should have: title, summary, and year."
        },
        {
          role: "user",
          content: `Suggest 3 movies based on this description: "${query}"`
        }
      ],
      temperature: 0.7
    });

    const rawText = response.choices[0].message.content;
    console.log("🧠 GPT response:", rawText);

    let movies;
    try {
      movies = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ JSON parse failed. Raw text:", rawText);
      movies = [];
    }

    // Add Amazon affiliate links
    const withLinks = movies.map(movie => ({
      ...movie,
      affiliateLink: `https://www.amazon.com/s?k=${encodeURIComponent(movie.title)}&tag=yourtag-20`
    }));

    res.json({ movies: withLinks });

  } catch (err) {
    console.error("🔥 OpenAI error:", err.message);
    res.status(500).json({ error: 'AI search failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 AI Movie Search backend running at http://localhost:${port}`);
});