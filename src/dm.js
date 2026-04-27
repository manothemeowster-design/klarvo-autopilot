import fetch from 'node-fetch';
import fs from 'fs';

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID  = process.env.IG_ACCOUNT_ID;
const PROCESSED_FILE = 'data/processed_comments.json';

// ─── DM Templates — swap these URLs for your real booking links ───────────────
const DM_REPLIES = {
  AUDIT:  `Hey! 👋 You asked about the free lead loss audit — here's your link to book it: https://cal.com/klarvo/audit`,
  DEMO:   `Hey! 👋 You asked about the demo — grab a 2-min slot here: https://cal.com/klarvo/demo`,
  AI:     `Hey! 👋 Here's your free custom AI roadmap for your business: https://cal.com/klarvo/ai-map`,
  SYSTEM: `Hey! 👋 Here's the exact AI system setup we use for local businesses: https://cal.com/klarvo/system`,
  COST:   `Hey! 👋 Here's our full pricing breakdown: https://cal.com/klarvo/pricing`,
};

// ─── State helpers ─────────────────────────────────────────────────────────────
function loadProcessed() {
  if (!fs.existsSync(PROCESSED_FILE)) return new Set();
  return new Set(JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8')));
}

function saveProcessed(set) {
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(PROCESSED_FILE, JSON.stringify([...set], null, 2));
}

// ─── Meta API helpers ──────────────────────────────────────────────────────────
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

async function sendPrivateReply(commentId, message) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${IG_ACCOUNT_ID}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient:      { comment_id: commentId },
      message:        { text: message },
      access_token:   IG_ACCESS_TOKEN,
    }),
  });
  return res.json();
}

// ─── Keyword detection ─────────────────────────────────────────────────────────
function detectKeyword(text = '') {
  const upper = text.toUpperCase();
  return Object.keys(DM_REPLIES).find(k => upper.includes(k)) || null;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
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
      // Skip already handled
      if (processed.has(comment.id)) continue;

      // Always mark processed first — even if no keyword — so we don't re-check
      processed.add(comment.id);

      const keyword = detectKeyword(comment.text);
      if (!keyword) continue;

      const username = comment.from?.username || 'unknown';
      console.log(`  🎯 "${keyword}" by @${username} → sending DM…`);

      const result = await sendPrivateReply(comment.id, DM_REPLIES[keyword]);

      if (result.message_id || result.recipient_id) {
        console.log(`  ✅ DM sent`);
        sent++;
      } else {
        console.warn(`  ⚠️  DM response:`, JSON.stringify(result));
      }

      // Tiny delay to avoid rate limit bursts
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
