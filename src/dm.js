import fetch from 'node-fetch';
import fs from 'fs';

const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT_ID  = process.env.IG_ACCOUNT_ID;
const PROCESSED_FILE = 'data/processed_comments.json';

const REPLIES = {
  AUDIT:  `Hey! 👋 We'd love to show you exactly where you're losing leads — book your free audit via the link in our bio 🔗`,
  DEMO:   `Hey! 👋 Grab a 2-min demo slot via the link in our bio 🔗`,
  AI:     `Hey! 👋 Your free custom AI roadmap is one click away — link in bio 🔗`,
  SYSTEM: `Hey! 👋 We'll walk you through the exact setup — book via the link in our bio 🔗`,
  COST:   `Hey! 👋 Full pricing breakdown on a quick call — link in our bio 🔗`,
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

async function replyToComment(commentId, username, message) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message:      `@${username} ${message}`,
      access_token: IG_ACCESS_TOKEN,
    }),
  });
  return res.json();
}

function detectKeyword(text = '') {
  const upper = text.trim().toUpperCase();
  return Object.keys(REPLIES).find(k => upper.includes(k)) || null;
}

async function main() {
  console.log('🤖 Auto-reply starting…');

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

      const username = comment.from?.username || 'there';
      console.log(`  🎯 "${keyword}" by @${username} → replying…`);

      const result = await replyToComment(comment.id, username, REPLIES[keyword]);

      if (result.id) {
        console.log(`  ✅ Reply posted`);
        sent++;
      } else {
        console.warn(`  ⚠️  Reply failed:`, JSON.stringify(result));
      }

      await new Promise(r => setTimeout(r, 500));
    }
  }

  saveProcessed(processed);
  console.log(`\n✅ Done — ${sent} reply/replies sent, ${processed.size} comments tracked total`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
