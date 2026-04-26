import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID = process.env.IG_ACCOUNT_ID;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID;

const hour = new Date().getUTCHours();
const pillars = ['PAIN', 'PROOF', 'FOMO', 'EDUCATION'];
const pillar = pillars[Math.floor(hour / 6) % 4];

const systemPrompt = `You are a viral social media content strategist for Klarvo.ai — 
an AI automation agency that sells AI receptionists, AI agents, automations, 
AI websites, and SEO to local businesses (HVAC, plumbers, electricians, dentists, 
roofers, lawyers, restaurants — ALL local businesses).

Your ONLY goal: create content so good that local business owners stop scrolling, 
engage, and DM you for a free demo.

Return ONLY valid JSON, no markdown, no explanation:
{
  "hook": "scroll-stopping first line MAX 10 words, shocking or curiosity-based",
  "slide2_headline": "THE PROBLEM headline max 8 words",
  "slide2_body": "agitate the pain, 2-3 punchy sentences",
  "slide3_headline": "THE INSIGHT headline max 8 words", 
  "slide3_body": "the thing they don't know, 2-3 sentences",
  "slide4_stat": "one big shocking number or % or $",
  "slide4_context": "what that stat means in one sentence",
  "cta_action": "one word like AUDIT or DEMO or AI or SYSTEM",
  "cta_line": "full CTA sentence telling them to comment that word",
  "caption": "full Instagram caption 150-200 words with emojis, hooks them, tells the story, ends with CTA to comment the cta_action word",
  "hashtags": "#AIAutomation #LocalBusiness #KlarvoAI #BusinessGrowth #AIAgents #SmallBusiness #AutomationTools #BusinessOwner #LeadGeneration #DigitalMarketing"
}`;

const userPrompt = `Today's content pillar: ${pillar}

PAIN = local business owners losing leads from missed calls, no follow-up, manual work
PROOF = shocking stats about AI adoption, revenue impact, competitor advantage  
FOMO = their competitors are already using AI, they're falling behind
EDUCATION = explain simply how one specific AI tool works and what it does for them

Make it VIRAL. Make business owners feel it in their gut. Be specific with numbers.
This content must make someone want to DM us for a demo TODAY.`;

async function generateContent() {
  console.log(`Generating ${pillar} content...`);
  
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 1500,
      temperature: 0.9,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const data = await res.json();
  const raw = data.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function buildImageUrl(text, bgColor = '1A0808', textColor = 'F2E4C4') {
  const prompt = encodeURIComponent(
    `Dark red background #${bgColor}, bold typography, ${text}, 
    professional social media post, gold accent color, 
    modern minimalist design, 1080x1080`
  );
  return `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1080&nologo=true&seed=${Date.now()}`;
}

async function postToInstagram(content) {
  console.log('Posting to Instagram...');
  
  const caption = `${content.hook}\n\n${content.caption}\n\n💬 Comment "${content.cta_action}" below\n\n${content.hashtags}`;
  const imageUrl = buildImageUrl(content.hook);

  // Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: IG_ACCESS_TOKEN
      })
    }
  );

  const container = await containerRes.json();
  console.log('IG Container:', container);

  if (!container.id) throw new Error('IG container creation failed: ' + JSON.stringify(container));

  // Wait for processing
  await new Promise(r => setTimeout(r, 8000));

  // Publish
  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: IG_ACCESS_TOKEN
      })
    }
  );

  const published = await publishRes.json();
  console.log('IG Published:', published);
  return published;
}

async function postToFacebook(content) {
  console.log('Posting to Facebook...');
  
  const message = `${content.hook}\n\n${content.caption}\n\n💬 Comment "${content.cta_action}" and I'll send you the details!\n\n${content.hashtags}`;
  const imageUrl = buildImageUrl(content.hook);

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        message: message,
        access_token: FB_ACCESS_TOKEN
      })
    }
  );

  const result = await res.json();
  console.log('FB Published:', result);
  return result;
}

async function main() {
  try {
    const content = await generateContent();
    console.log('Content generated:', content.hook);
    
    await postToInstagram(content);
    await postToFacebook(content);
    
    console.log('✅ Posted successfully to IG + FB!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
