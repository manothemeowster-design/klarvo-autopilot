import fetch from 'node-fetch';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { slide1, slide2, slide3, slide4, slide5 } from './slides.js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const IG_ACCESS_TOKEN  = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID    = process.env.IG_ACCOUNT_ID;
const FB_ACCESS_TOKEN  = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID       = process.env.FB_PAGE_ID;

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';

const MEMORY_FILE = './memory.json';

// ─── HUMAN-LIKE TIMING ─────────────────────────────
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── NICHE LOCK (IMPORTANT) ───────────────────────
const industry = 'roofing';

// ─── STRUCTURE VARIATION ──────────────────────────
const STRUCTURES = ['story_first','stat_first','question_first','contrarian_first'];
const structureMode = STRUCTURES[Math.floor(Math.random() * STRUCTURES.length)];

// ─── CTA LOGIC ────────────────────────────────────
function getCTA() {
  const CTAS = ['AUDIT','DEMO','SYSTEM','LOSS'];
  return CTAS[Math.floor(Math.random() * CTAS.length)];
}
const CTA = getCTA();

// ─── MEMORY SYSTEM ────────────────────────────────
function getMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE));
}

function saveMemory(hook) {
  const data = getMemory();
  data.push({ hook, time: Date.now() });
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
}

const lastHooks = getMemory().slice(-5).map(x => x.hook).join('\n');

// ─── PROMPT ───────────────────────────────────────
const SYSTEM_PROMPT = `
You write HIGH-CONVERTING carousel content.

RULES:
- Extremely specific
- Feels real
- No generic AI tone
- Create curiosity gaps
- Add one pattern-breaking slide (very short emotional hit)

STRUCTURE MODE: ${structureMode}

Recent hooks (DO NOT repeat style):
${lastHooks}
`;

const USER_PROMPT = `
Target: ${industry}

Create 5-slide carousel.

Make it feel like a real business scenario.

CTA word: ${CTA}
`;

// ─── GENERATE CONTENT ─────────────────────────────
async function generateContent() {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 1.1,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT }
      ]
    })
  });

  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  saveMemory(parsed.slide1_hook);

  parsed.caption = `
${parsed.slide1_hook}

Comment "${CTA}" and I’ll send a real example from a ${industry} business.
`;

  return parsed;
}

// ─── RENDER ───────────────────────────────────────
async function renderSlides(content) {
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    args: ['--no-sandbox'],
    headless: true,
  });

  const generators = [
    slide1, slide2, slide3, slide4, slide5
  ];

  const urls = [];

  for (let i = 0; i < generators.length; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });

    const html = generators[i](content);
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 1500));

    const buffer = await page.screenshot({ type: 'png' });
    await page.close();

    const url = await upload(buffer, i);
    urls.push(url);
  }

  await browser.close();
  return urls;
}

// ─── UPLOAD ───────────────────────────────────────
async function upload(buffer, i) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPOSITORY;

  const path = `slides/${Date.now()}_${i}.png`;

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "upload",
      content: buffer.toString("base64")
    })
  });

  const data = await res.json();
  return `https://raw.githubusercontent.com/${REPO}/main/${path}`;
}

// ─── POST TO IG ───────────────────────────────────
async function postToIG(images, caption) {
  const children = [];

  for (let img of images) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
      method: 'POST',
      body: JSON.stringify({
        image_url: img,
        is_carousel_item: true,
        access_token: IG_ACCESS_TOKEN
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const d = await res.json();
    children.push(d.id);
    await new Promise(r => setTimeout(r, randomDelay(1000,3000)));
  }

  const car = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children,
      caption,
      access_token: IG_ACCESS_TOKEN
    })
  });

  const c = await car.json();

  await new Promise(r => setTimeout(r, randomDelay(5000,9000)));

  await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`, {
    method: 'POST',
    body: JSON.stringify({
      creation_id: c.id,
      access_token: IG_ACCESS_TOKEN
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}

// ─── MAIN ─────────────────────────────────────────
async function main() {
  const content = await generateContent();
  const images = await renderSlides(content);
  await postToIG(images, content.caption);
}

main();
