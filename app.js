require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { getTranscript, getVideoMetadata } = require('./transcriptUtils');
const { OpenAI } = require('openai');
const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'https://www.narrify.cloud', 'https://narrify.cloud'];

const app = express();
app.use(cors({
  origin: ['https://narrify.cloud', 'https://www.narrify.cloud'],
  methods: ['GET'],
  allowedHeaders: ['ngrok-skip-browser-warning']
}));

const PORT = process.env.PORT || 5050;
const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10;
const SECRET_TOKEN = process.env.API_SECRET_TOKEN;

// Set up OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rate limiting: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429, // 🔴 HTTP 429 Too Many Requests
  message: {
    error: 'Capacity reached. Please try again shortly.',
    code: 'TOO_MANY_REQUESTS',
    retry_after_seconds: 60
  }
});

app.get('/summarize', limiter, async (req, res) => {
  const videoId = req.query.video_id;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing video_id parameter' });
  }

  const transcript = await getTranscript(videoId);
  if (!transcript) {
    return res.status(401).json({ error: 'Transcript not available for this video' });
  }

  const { title, channel } = await getVideoMetadata(videoId);

  const prompt = `This is the transcript of a YouTube video. Please give a short, clear explanation of what the video is about:\n\n${transcript.slice(0, 3000)}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that summarizes YouTube videos in a structured, clear, and insightful way. 
    Your tone should be concise and intelligent, occasionally using emojis as visual markers. 
    When the video is argumentative or analytical, extract and format the content like this:
    
    🎯 Main Argument:
    <1–2 sentence core idea>
    
    🔍 Key Takeaways & Themes:
    - Use bold subheadings and emojis for categories
    - Provide brief but complete bullets (each with its own short explanation)
    - Add names, events, or facts when relevant
    
    📌 Conclusion:
    <Wrap-up of core takeaway or what this means going forward>
    
    If the video is a tutorial or guide, instead focus on:
    - 🎓 Purpose
    - 🔧 Steps / Instructions
    - ✅ Final Outcome
    
    Avoid unnecessary fluff. Focus on clarity and high-level insight.`
        },
        {
          role: 'user',
          content: `Summarize this video transcript in the format above:\n\n${transcript.slice(0, 3000)}`
        }
      ],
      max_tokens: 500
    });

    const summary = response.choices[0].message.content.trim();
    res.json({ video_id: videoId, title, channel, summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

