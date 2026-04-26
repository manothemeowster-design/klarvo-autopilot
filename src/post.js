import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID;

// ─── CONTENT CALENDAR ────────────────────────────────────────────────────────
// 7 days × 4 slots. Every slot has a unique angle, industry, hook style.
// No two posts in the same week hit the same angle twice.

const now = new Date();
const day = now.getUTCDay();
const hour = now.getUTCHours();
const postSlot = hour < 7 ? 0 : hour < 11 ? 0 : hour < 15 ? 1 : hour < 19 ? 2 : 3;

const CALENDAR = {
  0: [ // Sunday — planning mindset, evening scroll
    { pillar: 'FOMO',      angle: 'your competitors planned their week with AI while you rested', industry: 'general local business', hookStyle: 'QUESTION' },
    { pillar: 'EDUCATION', angle: 'how AI handles scheduling and bookings on weekends automatically', industry: 'home services', hookStyle: 'HOW_IT_WORKS' },
    { pillar: 'PAIN',      angle: 'Sunday leads that went to voicemail got answered by a competitor Monday', industry: 'HVAC', hookStyle: 'STORY' },
    { pillar: 'FOMO',      angle: 'the business owner who never misses a Sunday evening inquiry', industry: 'plumbing', hookStyle: 'SHOCKING_STAT' },
  ],
  1: [ // Monday — fresh week energy
    { pillar: 'PAIN',      angle: 'you started Monday with 3 missed calls from the weekend sitting in voicemail', industry: 'roofing', hookStyle: 'SHOCKING_STAT' },
    { pillar: 'EDUCATION', angle: 'what an AI receptionist actually does from 8am to 8pm in one day', industry: 'HVAC', hookStyle: 'HOW_IT_WORKS' },
    { pillar: 'PROOF',     angle: 'businesses that added AI in January closed 40% more jobs by March', industry: 'electrical', hookStyle: 'BEFORE_AFTER' },
    { pillar: 'FOMO',      angle: 'Monday 9am: your competitor\'s AI already booked 2 installs. Did yours?', industry: 'general local business', hookStyle: 'CONTRARIAN' },
  ],
  2: [ // Tuesday — deep work, education performs well
    { pillar: 'EDUCATION', angle: 'the 3am call that books a $4000 AC job — here\'s who answers it', industry: 'HVAC', hookStyle: 'STORY' },
    { pillar: 'PAIN',      angle: 'your follow-up delay is costing you 40% of the leads you paid for', industry: 'general local business', hookStyle: 'SHOCKING_STAT' },
    { pillar: 'PROOF',     angle: 'AI receptionist vs hiring a front desk: real cost breakdown', industry: 'dental', hookStyle: 'BEFORE_AFTER' },
    { pillar: 'EDUCATION', angle: 'how AI websites rank on Google without you writing a single word', industry: 'home services', hookStyle: 'HOW_IT_WORKS' },
  ],
  3: [ // Wednesday — peak engagement day
    { pillar: 'PROOF',     angle: '$78,000 in recovered jobs from missed calls in 90 days with AI', industry: 'plumbing', hookStyle: 'SHOCKING_STAT' },
    { pillar: 'FOMO',      angle: 'the local HVAC company outranking you on Google is using AI SEO right now', industry: 'HVAC', hookStyle: 'CONTRARIAN' },
    { pillar: 'PAIN',      angle: 'you spent $1,200 on ads. The lead called. Nobody answered for 4 hours.', industry: 'roofing', hookStyle: 'STORY' },
    { pillar: 'EDUCATION', angle: 'the AI agent that texts back every missed call in under 60 seconds', industry: 'general local business', hookStyle: 'HOW_IT_WORKS' },
  ],
  4: [ // Thursday — end-of-week pressure, FOMO hits hard
    { pillar: 'FOMO',      angle: '3 businesses in your city quietly switched to AI agents this month', industry: 'general local business', hookStyle: 'SHOCKING_STAT' },
    { pillar: 'PAIN',      angle: 'you lost 11 leads to voicemail this week. Here\'s the math on what that cost.', industry: 'HVAC', hookStyle: 'PROOF' },
    { pillar: 'PROOF',     angle: 'AI booked 14 service appointments while this owner was on a job site', industry: 'electrical', hookStyle: 'STORY' },
    { pillar: 'FOMO',      angle: 'the businesses winning in 2025 all share one thing you don\'t have yet', industry: 'home services', hookStyle: 'CONTRARIAN' },
  ],
  5: [ // Friday — casual scroll, story content wins
    { pillar: 'PROOF',     angle: 'from 4 missed calls a day to zero — this plumber\'s story', industry: 'plumbing', hookStyle: 'BEFORE_AFTER' },
    { pillar: 'PAIN',      angle: 'you grind all week. Your AI works every second you don\'t.', industry: 'HVAC', hookStyle: 'CONTRARIAN' },
    { pillar: 'EDUCATION', angle: 'what changes in the first 48 hours after setting up AI automation', industry: 'general local business', hookStyle: 'HOW_IT_WORKS' },
    { pillar: 'FOMO',      angle: 'your Friday night. Their AI: 3 jobs booked, 2 follow-ups sent.', industry: 'roofing', hookStyle: 'SHOCKING_STAT' },
  ],
  6: [ // Saturday — leisure scroll, must entertain
    { pillar: 'PAIN',      angle: 'on a job site Saturday. Phone dies. 2 leads gone forever.', industry: 'HVAC', hookStyle: 'STORY' },
    { pillar: 'PROOF',     angle: 'how this plumber made an extra $23k his first month with AI', industry: 'plumbing', hookStyle: 'BEFORE_AFTER' },
    { pillar: 'FOMO',      angle: 'every contractor you know is looking into AI. Most won\'t act. Will you?', industry: 'general local business', hookStyle: 'CONTRARIAN' },
    { pillar: 'EDUCATION', angle: 'what actually happens when a customer calls after hours — live breakdown', industry: 'home services', hookStyle: 'HOW_IT_WORKS' },
  ],
};

const slot = CALENDAR[day][postSlot] || CALENDAR[1][0];
const { pillar, angle, industry, hookStyle } = slot;

// ─── HOOK STYLE GUIDES ────────────────────────────────────────────────────────
const HOOK_GUIDES = {
  SHOCKING_STAT: `Open with one specific shocking number, dollar amount, or percentage. No preamble.
    Pattern: "[Specific number or $amount]. [What it means in 4 words]."
    Examples: "78% of missed calls never call back." | "$4,200. Gone. One missed call."`,

  QUESTION: `Ask the question that makes them whisper "wait... is that me?"
    Pattern: Direct uncomfortable question or "What if" scenario. Under 10 words.
    Examples: "What if your phone answered itself at 2am?" | "How many calls did you miss today?"`,

  STORY: `One or two sentences. Drop them into a scene mid-action. Create tension immediately.
    Pattern: Set the scene fast, create a problem, leave them needing resolution.
    Examples: "He was on a roof. His phone rang 4 times. He missed all of them."`,

  HOW_IT_WORKS: `Curiosity gap — they don't know this exists and now they need to.
    Pattern: "Here's how [specific thing] actually works" or "Nobody explains this."
    Examples: "Here's exactly how AI answers your calls when you physically can't." | "Nobody tells plumbers this about AI."`,

  BEFORE_AFTER: `Brutal contrast in one line. Before state vs after state. Short. Sharp.
    Pattern: "Before: [bad thing]. After: [good thing]."
    Examples: "Before: 6 missed calls a week. After: zero." | "Before: $0 at 2am. After: 3 jobs booked."`,

  CONTRARIAN: `Say the thing everyone thinks is wrong but isn't. Challenge their assumption immediately.
    Pattern: "Stop [common thing]. [Truth that surprises them]."
    Examples: "Stop hiring another receptionist." | "The hustle advice is the reason you're losing leads."`,

  PROOF: `Lead with a real-feeling specific result as the hook. Make it undeniable.
    Pattern: "[Specific result] in [specific timeframe]. Here's how."
    Examples: "14 jobs booked. Zero calls answered by a human. One week."`,
};

// ─── CTA ROTATION ─────────────────────────────────────────────────────────────
const CTA_OPTIONS = [
  { word: 'AUDIT',  line: 'Comment "AUDIT" ↓ I\'ll personally show you exactly how many leads you\'re losing each week — for free.' },
  { word: 'DEMO',   line: 'Comment "DEMO" ↓ I\'ll send you a 2-minute live demo of this working for a business just like yours.' },
  { word: 'AI',     line: 'Comment "AI" ↓ I\'ll build you a free custom AI automation map for your specific business.' },
  { word: 'SYSTEM', line: 'Comment "SYSTEM" ↓ I\'ll send you the exact setup this business used to stop losing jobs to voicemail.' },
  { word: 'COST',   line: 'Comment "COST" ↓ I\'ll DM you the exact numbers: what this costs vs what you\'re bleeding without it.' },
];
const cta = CTA_OPTIONS[(day + postSlot) % CTA_OPTIONS.length];

// ─── HASHTAG ROTATION (avoids shadowban from repetition) ─────────────────────
const HASHTAG_SETS = [
  '#AIAutomation #LocalBusiness #KlarvoAI #BusinessGrowth #AIAgents #SmallBusiness #AutomationTools #BusinessOwner #LeadGeneration #DigitalMarketing',
  '#AIReceptionist #LocalBusinessOwner #BusinessAutomation #KlarvoAI #MissedCalls #SmallBusinessOwner #AIForBusiness #ScaleYourBusiness #HVACBusiness #ContractorLife',
  '#ArtificialIntelligence #LocalServiceBusiness #KlarvoAI #AutomateEverything #BusinessIntelligence #EntrepreneurMindset #GrowYourBusiness #AITools #MarketingAutomation #PlumbingBusiness',
  '#SmallBusinessMarketing #AIRevolution #KlarvoAI #LocalMarketing #BusinessStrategy #NeverMissACall #AIWebsite #SEO #AutomatedFollowUp #RoofingContractor',
];
const hashtags = HASHTAG_SETS[(day + postSlot) % HASHTAG_SETS.length];

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const systemPrompt = `You are the best viral social media copywriter alive.
You write for Klarvo.ai — an AI automation agency that sells AI receptionists, AI agents, 
automated follow-ups, AI websites, and SEO to local service businesses.

WRITING RULES — follow every single one:
1. Short sentences only. Maximum 12 words per sentence. Break it up.
2. Specific beats vague ALWAYS. "$4,200 lost" destroys "a lot of money lost"
3. Sound like a real business owner talking to another business owner — not a marketer
4. Contractions make it human. "you're" not "you are". "it's" not "it is"
5. One idea per sentence. Never cram two thoughts together.
6. Every line must make them read the next line. No filler.
7. Never use: "utilize" / "leverage" / "game-changer" / "cutting-edge" / "innovative"
8. Write for the gut first. The brain second.
9. The CTA should feel urgent, not salesy.

Return ONLY valid JSON. No markdown. No backticks. No explanation:
{
  "hook": "The scroll-stopping first line. MAX 10 words. Matches the hookStyle exactly.",
  "caption_block1": "3-4 sentences. Pure pain, curiosity, or story setup. Human voice. No intro fluff.",
  "caption_block2": "3-4 sentences. Deepen it. Get specific with numbers, scenarios, or insight.",
  "caption_block3": "2-3 sentences. Introduce the solution naturally — AI automation. Keep conversational.",
  "caption_block4": "2 sentences of urgency. Why this matters RIGHT NOW. Then the CTA line word for word.",
  "image_mood": "One of exactly: INTENSE | DRAMATIC | CLEAN | URGENT"
}`;

const userPrompt = `
CONTENT BRIEF:
- Pillar: ${pillar}
- Angle: ${angle}
- Target industry: ${industry}
- Hook style: ${hookStyle}
- Hook guide: ${HOOK_GUIDES[hookStyle]}
- CTA to end with (use word for word): "${cta.line}"
- CTA keyword: ${cta.word}

PILLAR INSTRUCTIONS:
${pillar === 'PAIN' ? `Make them feel the exact gut-punch of losing a real lead. Use a specific micro-scenario.
The reader must think "that is literally me right now." 
End the content showing the pain continues unless they change.` : ''}
${pillar === 'PROOF' ? `Lead with a real-feeling specific result. Numbers must feel real and achievable.
Show the before and after transformation clearly. Make it feel like a case study from their industry.
End with: this result is available to them too.` : ''}
${pillar === 'FOMO' ? `Their competitor is winning RIGHT NOW with AI. Create genuine urgency — not fake hype.
Make them feel like they're watching a race they're already losing.
End: they can still catch up but the window is closing.` : ''}
${pillar === 'EDUCATION' ? `Explain ONE specific AI thing simply. Like explaining it to a friend at lunch — no jargon.
Cover: what it does, how it works in plain English, what immediately changes for the business owner.
End: this is easier to get started with than they think.` : ''}

Write the hook in "${hookStyle}" style using the hook guide above.
Caption blocks together = 170-210 words total.
Make every word earn its place. Cut anything that doesn't hit hard.
`;

// ─── GENERATE CONTENT ─────────────────────────────────────────────────────────
async function generateContent() {
  console.log(`\n📅 ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]} | Slot ${postSlot} | ${pillar} | ${hookStyle}`);
  console.log(`🎯 ${angle}`);
  console.log(`🏢 ${industry}\n`);

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 2000,
      temperature: 1.1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const data = await res.json();
  if (!data.choices) throw new Error('DeepSeek API error: ' + JSON.stringify(data));

  const raw = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(clean);

  // Build full caption from blocks
  parsed.full_caption = [
    parsed.hook,
    '',
    parsed.caption_block1,
    '',
    parsed.caption_block2,
    '',
    parsed.caption_block3,
    '',
    parsed.caption_block4,
    '',
    `💬 Comment "${cta.word}" below ↓`,
  ].join('\n');

  console.log(`✍️  Hook: ${parsed.hook}`);
  console.log(`🖼️  Mood: ${parsed.image_mood}`);
  return parsed;
}

// ─── IMAGE GENERATION ─────────────────────────────────────────────────────────
function buildImageUrl(mood) {
  const moodMap = {
    INTENSE:  'dark crimson red background dramatic swirling gold geometric patterns luxury abstract art no text no words no letters professional social media cinematic moody lighting 4k',
    DRAMATIC: 'deep dark red background glowing gold particles light rays explosive energy no text no words no letters dramatic cinematic premium quality 4k',
    CLEAN:    'rich dark burgundy background clean minimal gold grid lines geometric shapes elegant no text no words no letters modern professional premium 4k',
    URGENT:   'dark red background bright gold glowing edges high contrast urgent atmosphere no text no words no letters dramatic sharp lighting 4k',
  };
  const prompt = encodeURIComponent(moodMap[mood] || moodMap.INTENSE);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1080&nologo=true&seed=${Date.now()}`;
}

// ─── POST TO INSTAGRAM ────────────────────────────────────────────────────────
async function postToInstagram(content) {
  console.log('\n📸 Posting to Instagram...');
  const caption = `${content.full_caption}\n\n${hashtags}`;
  const imageUrl = buildImageUrl(content.image_mood);

  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: IG_ACCESS_TOKEN })
    }
  );

  const container = await containerRes.json();
  console.log('Container:', container);
  if (!container.id) throw new Error('IG container failed: ' + JSON.stringify(container));

  console.log('⏳ Processing...');
  await new Promise(r => setTimeout(r, 10000));

  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: IG_ACCESS_TOKEN })
    }
  );

  const published = await publishRes.json();
  console.log('✅ IG done:', published);
  return published;
}

// ─── POST TO FACEBOOK ─────────────────────────────────────────────────────────
async function postToFacebook(content) {
  console.log('\n📘 Posting to Facebook...');
  const message = `${content.full_caption}\n\n${hashtags}`;
  const imageUrl = buildImageUrl(content.image_mood);

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: imageUrl, message, access_token: FB_ACCESS_TOKEN })
    }
  );

  const result = await res.json();
  console.log('✅ FB done:', result);
  return result;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🚀 Klarvo Autopilot — Phase A');
    const content = await generateContent();
    await postToInstagram(content);
    await postToFacebook(content);
    console.log(`\n🎉 Done! Pillar: ${pillar} | CTA: ${cta.word} | Industry: ${industry}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
