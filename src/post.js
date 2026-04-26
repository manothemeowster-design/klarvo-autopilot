import fetch from 'node-fetch';
import puppeteer from 'puppeteer-core';
import { slide1, slide2, slide3, slide4, slide5 } from './slides.js';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const IG_ACCESS_TOKEN  = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID    = process.env.IG_ACCOUNT_ID;
const FB_ACCESS_TOKEN  = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID       = process.env.FB_PAGE_ID;

const CHROMIUM_PATH    = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';

// ─── CONTENT CALENDAR ────────────────────────────────────────────────────────
const now      = new Date();
const day      = now.getUTCDay();
const hour     = now.getUTCHours();
const postSlot = hour < 7 ? 0 : hour < 11 ? 0 : hour < 15 ? 1 : hour < 19 ? 2 : 3;

const CALENDAR = {
  0: [
    { pillar:'FOMO',      angle:'competitors planned their week with AI while you rested',            industry:'general local business', hookStyle:'QUESTION'      },
    { pillar:'EDUCATION', angle:'how AI handles scheduling and bookings automatically on weekends',    industry:'home services',          hookStyle:'HOW_IT_WORKS'  },
    { pillar:'PAIN',      angle:'Sunday leads that hit voicemail got taken by a competitor by Monday', industry:'HVAC',                   hookStyle:'STORY'         },
    { pillar:'FOMO',      angle:'the business owner who never misses a Sunday evening inquiry',        industry:'plumbing',               hookStyle:'SHOCKING_STAT' },
  ],
  1: [
    { pillar:'PAIN',      angle:'you started Monday with 3 missed calls sitting in voicemail',        industry:'roofing',                hookStyle:'SHOCKING_STAT' },
    { pillar:'EDUCATION', angle:'what an AI receptionist does from 8am to 8pm in one day',            industry:'HVAC',                   hookStyle:'HOW_IT_WORKS'  },
    { pillar:'PROOF',     angle:'businesses that added AI in Jan closed 40% more jobs by March',      industry:'electrical',             hookStyle:'BEFORE_AFTER'  },
    { pillar:'FOMO',      angle:"Monday 9am: competitor's AI already booked 2 installs. Did yours?",  industry:'general local business', hookStyle:'CONTRARIAN'    },
  ],
  2: [
    { pillar:'EDUCATION', angle:'the 3am call that books a $4000 AC job — here\'s who answers it',   industry:'HVAC',                   hookStyle:'STORY'         },
    { pillar:'PAIN',      angle:'your follow-up delay is costing you 40% of leads you paid for',      industry:'general local business', hookStyle:'SHOCKING_STAT' },
    { pillar:'PROOF',     angle:'AI receptionist vs hiring a front desk: real cost breakdown',         industry:'dental',                 hookStyle:'BEFORE_AFTER'  },
    { pillar:'EDUCATION', angle:'how AI websites rank on Google without you writing a single word',    industry:'home services',          hookStyle:'HOW_IT_WORKS'  },
  ],
  3: [
    { pillar:'PROOF',     angle:'$78,000 in recovered jobs from missed calls in 90 days with AI',     industry:'plumbing',               hookStyle:'SHOCKING_STAT' },
    { pillar:'FOMO',      angle:'the local HVAC company outranking you on Google uses AI SEO now',    industry:'HVAC',                   hookStyle:'CONTRARIAN'    },
    { pillar:'PAIN',      angle:'you spent $1,200 on ads. The lead called. Nobody answered 4 hours.', industry:'roofing',                hookStyle:'STORY'         },
    { pillar:'EDUCATION', angle:'the AI agent that texts back every missed call in under 60 seconds', industry:'general local business', hookStyle:'HOW_IT_WORKS'  },
  ],
  4: [
    { pillar:'FOMO',      angle:'3 businesses in your city quietly switched to AI agents this month', industry:'general local business', hookStyle:'SHOCKING_STAT' },
    { pillar:'PAIN',      angle:"you lost 11 leads to voicemail this week. Here's the math.",         industry:'HVAC',                   hookStyle:'PROOF'         },
    { pillar:'PROOF',     angle:'AI booked 14 service calls while owner was on a job site',           industry:'electrical',             hookStyle:'STORY'         },
    { pillar:'FOMO',      angle:"the businesses winning in 2025 all share one thing you don't have",  industry:'home services',          hookStyle:'CONTRARIAN'    },
  ],
  5: [
    { pillar:'PROOF',     angle:"from 4 missed calls a day to zero — this plumber's story",           industry:'plumbing',               hookStyle:'BEFORE_AFTER'  },
    { pillar:'PAIN',      angle:"you grind all week. Your AI works every second you don't.",          industry:'HVAC',                   hookStyle:'CONTRARIAN'    },
    { pillar:'EDUCATION', angle:'what changes in the first 48 hours after setting up AI automation',  industry:'general local business', hookStyle:'HOW_IT_WORKS'  },
    { pillar:'FOMO',      angle:'your Friday night. Their AI: 3 jobs booked, 2 follow-ups sent.',     industry:'roofing',                hookStyle:'SHOCKING_STAT' },
  ],
  6: [
    { pillar:'PAIN',      angle:'on a job site Saturday. Phone dies. 2 leads gone forever.',          industry:'HVAC',                   hookStyle:'STORY'         },
    { pillar:'PROOF',     angle:'how this plumber made an extra $23k his first month with AI',        industry:'plumbing',               hookStyle:'BEFORE_AFTER'  },
    { pillar:'FOMO',      angle:"every contractor you know is looking into AI. Most won't act.",      industry:'general local business', hookStyle:'CONTRARIAN'    },
    { pillar:'EDUCATION', angle:'what actually happens when a customer calls after hours',            industry:'home services',          hookStyle:'HOW_IT_WORKS'  },
  ],
};

const slot     = CALENDAR[day]?.[postSlot] || CALENDAR[1][0];
const { pillar, angle, industry, hookStyle } = slot;

// ─── HOOK GUIDES ─────────────────────────────────────────────────────────────
const HOOK_GUIDES = {
  SHOCKING_STAT: `One specific shocking number, dollar amount, or percentage. No preamble.
    Pattern: "[Specific $amount or %]. [4-word consequence]."
    Examples: "78% of missed calls never call back." | "$4,200. Gone. One missed call."`,
  QUESTION: `Question that makes them whisper "wait... is that me?" Under 10 words.
    Examples: "What if your phone answered itself at 2am?" | "How many calls did you miss today?"`,
  STORY: `Drop them into a scene mid-action. Tension immediately.
    Examples: "He was on a roof. Four calls. All missed." | "She almost lost her business over a voicemail."`,
  HOW_IT_WORKS: `Curiosity gap — they don't know this exists and now they need to.
    Examples: "Here's exactly how AI answers calls when you physically can't." | "Nobody tells plumbers this about AI."`,
  BEFORE_AFTER: `Brutal contrast in one line. Short. Sharp.
    Examples: "Before: 6 missed calls a week. After: zero." | "Before: $0 at 2am. After: 3 jobs booked."`,
  CONTRARIAN: `Say the thing everyone thinks is wrong but isn't.
    Examples: "Stop hiring another receptionist." | "The hustle advice is why you're losing leads."`,
  PROOF: `Lead with a specific result as the hook.
    Examples: "14 jobs booked. Zero calls answered by a human. One week."`,
};

// ─── CTA ROTATION ─────────────────────────────────────────────────────────────
const CTAS = [
  { word:'AUDIT',  desc:"I'll personally show you exactly how many leads you're losing each week — for free." },
  { word:'DEMO',   desc:"I'll send you a 2-minute live demo of this working for a business just like yours." },
  { word:'AI',     desc:"I'll build you a free custom AI automation map for your specific business." },
  { word:'SYSTEM', desc:"I'll send you the exact setup this business used to stop losing jobs to voicemail." },
  { word:'COST',   desc:"I'll DM you the exact numbers: what this costs vs what you're bleeding without it." },
];
const cta = CTAS[(day + postSlot) % CTAS.length];

// ─── HASHTAG ROTATION ─────────────────────────────────────────────────────────
const HASHTAGS = [
  '#AIAutomation #LocalBusiness #KlarvoAI #BusinessGrowth #AIAgents #SmallBusiness #AutomationTools #BusinessOwner #LeadGeneration #DigitalMarketing',
  '#AIReceptionist #LocalBusinessOwner #BusinessAutomation #KlarvoAI #MissedCalls #SmallBusinessOwner #AIForBusiness #ScaleYourBusiness #HVACBusiness #ContractorLife',
  '#ArtificialIntelligence #LocalServiceBusiness #KlarvoAI #AutomateEverything #BusinessIntelligence #EntrepreneurMindset #GrowYourBusiness #AITools #MarketingAutomation #PlumbingBusiness',
  '#SmallBusinessMarketing #AIRevolution #KlarvoAI #LocalMarketing #BusinessStrategy #NeverMissACall #AIWebsite #SEO #AutomatedFollowUp #RoofingContractor',
];
const hashtags = HASHTAGS[(day + postSlot) % HASHTAGS.length];

// ─── CATEGORY LABEL (top right of slides) ────────────────────────────────────
const CATEGORY_MAP = {
  PAIN: 'LEAD LOSS  •  WAKE UP CALL',
  PROOF: 'REAL RESULTS  •  CASE STUDY',
  FOMO: 'THE RACE  •  ARE YOU BEHIND?',
  EDUCATION: 'HOW IT WORKS  •  AI EXPLAINED',
};
const category = CATEGORY_MAP[pillar];

// ─── DEEPSEEK PROMPT ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the world's best viral social media copywriter.
You write carousel posts for Klarvo.ai — an AI automation agency for local service businesses.

RULES:
- Short sentences. Max 12 words each. Break it up.
- Specific beats vague: "$4,200 lost" > "a lot of money lost"
- Sound like a real business owner, not a marketer
- Use contractions: "you're" not "you are"
- Never use: utilize / leverage / game-changer / cutting-edge / innovative
- Every word must earn its place

Return ONLY valid JSON. No markdown. No backticks. No extra text:
{
  "slide1_hook": "The hook. MAX 10 words. Uppercase looks great here. Matches hookStyle exactly.",
  "slide2_label": "THE PROBLEM",
  "slide2_headline": "Headline 4-7 words uppercase",
  "slide2_body": "2-3 punchy sentences. Pain or problem. Specific.",
  "slide3_label": "THE TRUTH",
  "slide3_headline": "Insight headline 4-7 words uppercase",
  "slide3_body": "2-3 sentences. The insight or revelation. Human voice.",
  "slide4_label": "THE NUMBERS",
  "slide4_stat": "One big number like $4200 or 78% or 14 JOBS",
  "slide4_context": "What this stat means. Bold. 8-12 words.",
  "slide4_sub": "One supporting fact or comparison. 10-15 words.",
  "slide5_headline": "CTA headline. 4-6 words. Urgent. Uppercase.",
  "slide5_cta_word": "${cta.word}",
  "slide5_cta_desc": "${cta.desc}",
  "caption": "Full IG caption 170-210 words. Emojis. Hook them. Story. Ends with: Comment ${cta.word} below.",
  "hashtags": "${hashtags}"
}`;

const USER_PROMPT = `
BRIEF:
- Pillar: ${pillar}
- Angle: ${angle}
- Target industry: ${industry}
- Hook style: ${hookStyle}
- Hook guide: ${HOOK_GUIDES[hookStyle]}
- CTA word: ${cta.word}

PILLAR:
${pillar === 'PAIN'      ? 'Make them feel the gut-punch of losing a real lead. Specific micro-scenario. Reader must think "that is literally me right now."' : ''}
${pillar === 'PROOF'     ? 'Lead with a real-feeling specific result. Numbers must feel real. Show the before and after clearly. Make it feel like a case study.' : ''}
${pillar === 'FOMO'      ? "Their competitor is winning RIGHT NOW with AI. Genuine urgency. Make them feel like they're watching a race they're already losing." : ''}
${pillar === 'EDUCATION' ? "Explain ONE specific AI thing simply — like explaining to a friend at lunch. No jargon. What it does, how it works, what changes." : ''}

Slide 1 hook: use ${hookStyle} style.
Make every word hit hard. Cut anything that doesn't.
`;

// ─── GENERATE CONTENT ─────────────────────────────────────────────────────────
async function generateContent() {
  console.log(`\n📅 ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]} | Slot ${postSlot} | ${pillar} | ${hookStyle}`);
  console.log(`🎯 ${angle} | 🏢 ${industry}\n`);

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 2200,
      temperature: 1.1,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: USER_PROMPT   },
      ]
    })
  });

  const data = await res.json();
  if (!data.choices) throw new Error('DeepSeek error: ' + JSON.stringify(data));

  const raw   = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  // ensure cta word is correct
  parsed.slide5_cta_word = cta.word;
  parsed.slide5_cta_desc = cta.desc;

  // build full caption
  parsed.full_caption = [
    parsed.slide1_hook, '',
    parsed.caption, '',
    `💬 Comment "${cta.word}" below ↓`, '',
    parsed.hashtags,
  ].join('\n');

  console.log(`✍️  Hook: ${parsed.slide1_hook}`);
  return parsed;
}

// ─── RENDER SLIDES ────────────────────────────────────────────────────────────
async function renderAndUploadSlides(content) {
  console.log('\n🖥️  Launching Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });

  const slideGenerators = [
    () => slide1(content, category),
    () => slide2(content, category),
    () => slide3(content, category),
    () => slide4(content, category),
    () => slide5(content, category),
  ];

  const urls = [];

  try {
    for (let i = 0; i < slideGenerators.length; i++) {
      const html = slideGenerators[i]();
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      await page.evaluateHandle('document.fonts.ready');
      await new Promise(r => setTimeout(r, 2000)); // font render buffer

      const buffer = await page.screenshot({ type: 'png' });
      await page.close();

      const url = await uploadToImgbb(buffer, `klarvo_slide_${i + 1}`);
      urls.push(url);
      console.log(`✅ Slide ${i + 1}/5 → ${url}`);
    }
  } finally {
    await browser.close();
  }

  return urls;
}

// ─── UPLOAD IMAGE (0x0.st) ───────────────────────────────────────────────────
async function uploadToImgbb(buffer, name) {
  const { FormData, Blob } = await import("node-fetch");
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "image/png" }), `${name || "slide"}.png`);
  const res = await fetch("https://0x0.st", { method: "POST", body: form });
  const url = (await res.text()).trim();
  if (!url.startsWith("http")) throw new Error("0x0.st upload failed: " + url);
  return url;
}

// ─── POST CAROUSEL TO INSTAGRAM ───────────────────────────────────────────────
async function postCarouselToInstagram(imageUrls, caption) {
  console.log('\n📸 Creating IG carousel...');

  // Step 1: Create item containers
  const childIds = [];
  for (const url of imageUrls) {
    const r = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: url,
        is_carousel_item: true,
        access_token: IG_ACCESS_TOKEN,
      })
    });
    const d = await r.json();
    if (!d.id) throw new Error('Carousel item failed: ' + JSON.stringify(d));
    childIds.push(d.id);
    console.log(`  → Item ${childIds.length}: ${d.id}`);
    await new Promise(r => setTimeout(r, 2000));
  }

  // Step 2: Create carousel container
  const carRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: 'CAROUSEL',
      children: childIds,
      caption: caption,
      access_token: IG_ACCESS_TOKEN,
    })
  });
  const carousel = await carRes.json();
  if (!carousel.id) throw new Error('Carousel container failed: ' + JSON.stringify(carousel));
  console.log('  → Carousel container:', carousel.id);

  // Step 3: Wait then publish
  console.log('⏳ Processing...');
  await new Promise(r => setTimeout(r, 8000));

  const pubRes = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: carousel.id, access_token: IG_ACCESS_TOKEN })
  });
  const pub = await pubRes.json();
  console.log('✅ IG Carousel live:', pub);
  return pub;
}

// ─── POST TO FACEBOOK ─────────────────────────────────────────────────────────
async function postToFacebook(imageUrls, message) {
  console.log('\n📘 Posting to Facebook...');
  // FB gets the hook slide as the image
  const res = await fetch(`https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: imageUrls[0], message, access_token: FB_ACCESS_TOKEN })
  });
  const result = await res.json();
  console.log('✅ FB live:', result);
  return result;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🚀 Klarvo Autopilot — Phase B (Carousel)\n');

    const content   = await generateContent();
    const imageUrls = await renderAndUploadSlides(content);

    await postCarouselToInstagram(imageUrls, content.full_caption);
    await postToFacebook(imageUrls, content.full_caption);

    console.log(`\n🎉 Done! ${pillar} | ${cta.word} | ${industry}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
