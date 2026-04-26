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
// category handled inside slides.js by scheme

// ─── DEEPSEEK PROMPT ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the world's best viral carousel copywriter.
You create scroll-stopping carousel posts for Klarvo.ai — an AI automation agency for local businesses.

CURIOSITY-GAP RULES (most important):
- Every slide must make them NEED to see the next slide
- Never answer the question fully until slide 4 or 5
- Create open loops: raise a question on slide 2, tease the answer on slide 3, reveal on slide 4
- Slide 1 hook = stops the scroll. Slide 2 = opens the loop. Slide 3 = deepens it. Slide 4 = the payoff. Slide 5 = CTA
- Use "But here's the thing..." / "And it gets worse..." / "Nobody talks about this..." to pull them forward

WRITING RULES:
- Short sentences ONLY. Max 10 words. Seriously.
- Specific beats vague always: "$4,200" not "a lot"
- Sound human. Like a friend who runs a business.
- Contractions only: "you're" "it's" "they're"
- NEVER use: utilize / leverage / game-changer / cutting-edge / innovative / empower
- Every single word must earn its place. Cut ruthlessly.
- The hook should feel so personal that the reader thinks you wrote it FOR them

Return ONLY valid JSON. No markdown. No backticks. No extra text:
{
  "slide1_hook": "STOP-SCROLL hook. MAX 10 words. ALL CAPS works great. So specific it feels personal.",
  "slide2_label": "short label like THE PROBLEM or THE REAL COST or WAKE UP",
  "slide2_headline": "4-7 words. Opens a loop. Raises a question. Doesn't answer it yet.",
  "slide2_body": "2-3 sentences. Agitate the problem. End with a cliffhanger that makes them swipe.",
  "slide3_label": "short label like THE TRUTH or WHAT NOBODY SAYS or HERE'S WHY",
  "slide3_headline": "4-7 words. Partial reveal. Teases the answer. Still building tension.",
  "slide3_body": "2-3 sentences. Deepen the insight. Say something surprising. End by teasing the stat coming next.",
  "slide4_label": "THE NUMBERS or THE PROOF or THE REALITY",
  "slide4_stat": "One big jaw-dropping number. $amount or X% or X JOBS. Max 3 tokens.",
  "slide4_context": "What this stat means. 8-12 words. Make it hit hard.",
  "slide4_sub": "One supporting fact that makes slide 4 stat even more shocking. 10-15 words.",
  "slide5_headline": "4-6 words. The payoff promise. What they GET by commenting.",
  "slide5_cta_word": "${cta.word}",
  "slide5_cta_desc": "${cta.desc}",
  "caption_line": "ONE punchy sentence max 12 words. The gut-punch hook of this carousel. No emojis. No fluff."
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

  // build ultra-short caption (1 hook line + 1 CTA line)
  const keywords = `AI automation local business ${industry} AI receptionist missed calls lead generation`;
  parsed.full_caption = [
    parsed.caption_line || parsed.slide1_hook,
    '',
    `💬 Comment "${cta.word}" and I'll send it to you.`,
    '',
    keywords,
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
    () => slide1(content),
    () => slide2(content),
    () => slide3(content),
    () => slide4(content),
    () => slide5(content),
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

// ─── UPLOAD TO GITHUB (no external service needed) ───────────────────────────
async function uploadToImgbb(buffer, name) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPOSITORY; // auto-set by Actions
  const fileName = `slides/${Date.now()}_${name || "slide"}.png`;
  const base64 = buffer.toString("base64");

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${fileName}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    body: JSON.stringify({
      message: `slide: ${fileName}`,
      content: base64,
    })
  });

  const data = await res.json();
  if (!data.content) throw new Error("GitHub upload failed: " + JSON.stringify(data));
  // Use raw URL — publicly accessible even from private repos via token
  const rawUrl = `https://raw.githubusercontent.com/${REPO}/main/${fileName}`;
  return rawUrl;
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
