const axios = require('axios');
const cheerio = require('cheerio');
const { YoutubeTranscript } = require('youtube-transcript');

async function getTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    return transcript.map(t => t.text).join('\n');
  } catch (err) {
    console.error('[Transcript Error]', videoId, err.message); // Log the cause
    return null;
  }
}

async function getVideoMetadata(videoId) {
  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const title = $('title').text().replace(' - YouTube', '').trim();
    const match = res.data.match(/"ownerChannelName":"(.*?)"/);
    const channel = match ? match[1] : 'Unknown Channel';

    return { title, channel };
  } catch (err) {
    return { title: 'Unknown Title', channel: 'Unknown Channel' };
  }
}

module.exports = { getTranscript, getVideoMetadata };

