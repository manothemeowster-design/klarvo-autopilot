import fetch from 'node-fetch';
import fs from 'fs';

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID  = process.env.IG_ACCOUNT_ID;
const PROCESSED_FILE = 'data/processed_comments.json';

const CALENDLY = 'https://calendly.com/klarvoai/30min';

const DM_REPLIES = {
  AUDIT:  `Hey! 👋 Here's your free lead loss audit — book a quick call and I'll show you exactly where you're losing leads: ${CALENDLY}`,
  DEMO:   `Hey! 👋 Here's the link to see a 2-min live demo of the AI system: ${CALENDLY}`,
  AI:     `Hey! 👋 Here's where you can get your free custom AI roadmap for your business: ${CALENDLY}`,
  SYSTEM: `Hey! 👋 I'll walk you through the exact AI setup on a quick call — book here: ${CALENDLY}`,
  COST:   `Hey! 👋 Full pricing breakdown is easier to walk through live — grab a slot here: ${CALENDLY}`,
};

function loadProcessed() {
  if (!fs.existsSync(PROCESSED_FILE)) return new Set();
  return new Set(JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8')));
}

function saveProcessed(set) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify([...set], null, 2));
}

async function getRecentMedia() {
  const url = `https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/media`
    + `?fields=id,timestamp&limit=10&access_token=${IG_ACCESS_TOKEN}`;
  const data = await fetch(url).then(r => r.json());
  if (data.error) throw new Error(`getRecentMedia: ${JSON.stringify(data.error)}`);
  return data.data || [];
}

async function getComments(mediaId) {
  const url = `https://graph.facebook.com/v19.0/${mediaId}/comments`
    + `?fields=id,text,from,timestamp&limit=50&access_token=${IG_ACCESS_TOKEN}`;
  const data = await fetch(url).then(r => r.json());
  if (data.error) {
    console.warn(`  ⚠️  Comments fetch failed for ${mediaId}:`, data.error.message);
    return [];
  }
  return data.data || [];
}

async function sendDM(commentId, message) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient:    { comment_id: commentId },
      message:      { text: message },
      access_token: IG_ACCESS_TOKEN,
    }),
  });
  return res.json();
}

// Works for: AUDIT, audit, Audit, "comment AUDIT", "I want audit" etc.
function detectKeyword(text = '') {
  const upper = text.trim().toUpperCase();
  return Object.keys(DM_REPLIES).find(k => upper.includes(k)) || null;
}

async function main() {
  console.log('🤖 Auto-DM starting…');

  const processed = loadProcessed();
  let sent = 0;

  const media = await getRecentMedia();
  console.log(`📸 Checking ${media.length} recent posts`);

  for (const post of media) {
    const comments = await getComments(post.id);
    if (!comments.length) continue;
    console.log(`  💬 Post ${post.id}: ${comments.length} comment(s)`);

    for (const comment of comments) {
      if (processed.has(comment.id)) continue;
      processed.add(comment.id);

      const keyword = detectKeyword(comment.text);
      if (!keyword) continue;

      const username = comment.from?.username || 'unknown';
      console.log(`  🎯 "${keyword}" by @${username} → sending DM…`);

      const result = await sendDM(comment.id, DM_REPLIES[keyword]);

      if (result.message_id || result.recipient_id) {
        console.log(`  ✅ DM sent to @${username}`);
        sent++;
      } else {
        console.warn(`  ⚠️  DM failed:`, JSON.stringify(result));
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  saveProcessed(processed);
  console.log(`\n✅ Done — ${sent} DM(s) sent, ${processed.size} comments tracked total`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
