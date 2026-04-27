import fetch from 'node-fetch';
import puppeteer from 'puppeteer-core';
import { slide1, slide2, slide3, slide4, slide5 } from './slides.js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const IG_ACCESS_TOKEN  = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID    = process.env.IG_ACCOUNT_ID;
const FB_ACCESS_TOKEN  = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID       = process.env.FB_PAGE_ID;

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';

// ─── TIME SLOT ─────────────────────────────────────────
const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours();
const postSlot = hour < 7 ? 0 : hour < 11 ? 0 : hour < 15 ? 1 : hour < 19 ? 2 : 3;

// ─── SIMPLE CONTENT CONFIG (shortened for clarity) ─────
const slot = {
  pillar: 'PAIN',
  angle: 'you missed calls and lost leads',
  industry: 'local business',
  hookStyle: 'SHOCKING_STAT'
};

// ─── CTA ───────────────────────────────────────────────
const CTAS = [
  { word:'AUDIT', desc:"I'll show you lost leads." },
  { word:'DEMO', desc:"I'll send a quick demo." },
  { word:'AI', desc:"I'll map your automation." }
];
const cta = CTAS[(day + postSlot) % CTAS.length];

// ─── PROMPTS ───────────────────────────────────────────
const SYSTEM_PROMPT = `
Return ONLY valid JSON.
If you include ANY text outside JSON, response will be rejected.

{
  "slide1_hook": "hook",
  "slide1_pills": ["a","b","c","d"],
  "slide2_label": "x",
  "slide2_headline": "x",
  "slide2_body": "x",
  "slide3_label": "x",
  "slide3_headline": "x",
  "slide3_body": "x",
  "slide4_label": "x",
  "slide4_stat": "x",
  "slide4_context": "x",
  "slide4_sub": "x",
  "slide5_headline": "x",
  "slide5_cta_word": "${cta.word}",
  "slide5_cta_desc": "${cta.desc}",
  "caption_line": "x"
}
`;

const USER_PROMPT = `
Make viral carousel content about:
${slot.angle}
`;

// ─── JSON EXTRACTOR (CRITICAL FIX) ─────────────────────
function extractJSON(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No JSON found:\n' + text);
  }
  return text.slice(start, end + 1);
}

// ─── GENERATE CONTENT ─────────────────────────────────
async function generateContent() {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT }
      ]
    })
  });

  const data = await res.json();
  if (!data.choices) throw new Error(JSON.stringify(data));

  const raw = data.choices[0].message.content.trim();

  const jsonString = extractJSON(raw);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error('RAW RESPONSE:\n', raw);
    throw err;
  }

  parsed.slide5_cta_word = cta.word;
  parsed.slide5_cta_desc = cta.desc;

  parsed.full_caption = [
    parsed.caption_line || parsed.slide1_hook,
    '',
    `Comment "${cta.word}" to get it.`,
  ].join('\n');

  return parsed;
}

// ─── RETRY WRAPPER ────────────────────────────────────
async function generateWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateContent();
    } catch (err) {
      console.log(`Retry ${i + 1}...`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Failed after retries');
}

// ─── RENDER ───────────────────────────────────────────
async function renderSlides(content) {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    args: ['--no-sandbox'],
    headless: true,
  });

  const slides = [slide1, slide2, slide3, slide4, slide5];
  const urls = [];

  for (let i = 0; i < slides.length; i++) {
    const html = slides[i](content);
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1080 });
    await page.setContent(html);

    const buffer = await page.screenshot({ type: 'png' });
    await page.close();

    const url = await uploadToGithub(buffer);
    urls.push(url);
  }

  await browser.close();
  return urls;
}

// ─── UPLOAD ───────────────────────────────────────────
async function uploadToGithub(buffer) {
  const fileName = `slides/${Date.now()}.png`;
  const base64 = buffer.toString("base64");

  const res = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/contents/${fileName}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "upload",
      content: base64
    })
  });

  const data = await res.json();
  return `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/main/${fileName}`;
}

// ─── INSTAGRAM POST ───────────────────────────────────
async function postToInstagram(images, caption) {
  const ids = [];

  for (const url of images) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
      method: 'POST',
      body: JSON.stringify({
        image_url: url,
        is_carousel_item: true,
        access_token: IG_ACCESS_TOKEN
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const d = await res.json();
    ids.push(d.id);
  }

  const car = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
    method: 'POST',
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: ids,
      caption,
      access_token: IG_ACCESS_TOKEN
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const carData = await car.json();

  await new Promise(r => setTimeout(r, 5000));

  await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`, {
    method: 'POST',
    body: JSON.stringify({
      creation_id: carData.id,
      access_token: IG_ACCESS_TOKEN
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}

// ─── MAIN ─────────────────────────────────────────────
async function main() {
  try {
    console.log("RUNNING...");

    const content = await generateWithRetry();
    const images = await renderSlides(content);

    await postToInstagram(images, content.full_caption);

    console.log("DONE");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
