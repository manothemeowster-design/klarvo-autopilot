import fetch from 'node-fetch';
import fs from 'fs';

const IG_ID  = process.env.IG_ACCOUNT_ID;
const TOKEN  = process.env.IG_ACCESS_TOKEN;

// ─── State file (persisted via GitHub Actions Cache, zero git conflicts) ─────
const STATE_FILE = 'replied.json';
let replied = new Set(
  fs.existsSync(STATE_FILE)
    ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
    : []
);

// ─── Keywords (case-insensitive) ──────────────────────────────────────────────
const KEYWORDS = {
  AUDIT:      "Sent! 📩 Check your DMs for your free lead loss audit.",
  DEMO:       "Sent! 📩 Your 2-min demo link is in your DMs.",
  AI:         "Sent! 📩 Your custom AI map is in your DMs.",
  SYSTEM:     "Sent! 📩 Full system breakdown is in your DMs.",
  COST:       "Sent! 📩 Pricing breakdown is in your DMs.",
  PRICE:      "Sent! 📩 Pricing breakdown is in your DMs.",
  PRICING:    "Sent! 📩 Pricing breakdown is in your DMs.",
  INFO:       "Sent! 📩 All the details are in your DMs.",
  DETAILS:    "Sent! 📩 Check your DMs for the full details.",
  HOW:        "Sent! 📩 Sent you the breakdown in your DMs.",
  HELP:       "Sent! 📩 Check your DMs — we got you covered.",
  YES:        "Sent! 📩 Details are on their way to your DMs.",
  SEND:       "Sent! 📩 Check your DMs right now.",
  ME:         "Sent! 📩 Just dropped it in your DMs.",
  WANT:       "Sent! 📩 Sent it over to your DMs.",
  NEED:       "Sent! 📩 Check your DMs, we've got you.",
  BOOK:       "Sent! 📩 Booking link is in your DMs.",
  CALL:       "Sent! 📩 Call link is waiting in your DMs.",
  CHAT:       "Sent! 📩 Drop us a DM and let's talk.",
  QUOTE:      "Sent! 📩 Your custom quote details are in your DMs.",
  FREE:       "Sent! 📩 Your free resource is in your DMs.",
  SETUP:      "Sent! 📩 Full setup guide is in your DMs.",
  BUILD:      "Sent! 📩 Check your DMs for the build breakdown.",
  START:      "Sent! 📩 Everything you need to start is in your DMs.",
  READY:      "Sent! 📩 Let's go — check your DMs.",
  ASAP:       "Sent! 📩 On it — check your DMs now.",
  NOW:        "Sent! 📩 Check your DMs right now.",
  INTERESTED: "Sent! 📩 Details are in your DMs.",
  FIRE:       "Sent! 🔥 Check your DMs.",
  LFG:        "Sent! 🚀 Check your DMs, let's go.",
};

// ─── API helpers ──────────────────────────────────────────────────────────────
async function getPosts() {
  const res  = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ID}/media?fields=id&limit=10&access_token=${TOKEN}`
  );
  const data = await res.json();
  if (data.error) { console.error('getPosts error:', data.error); return []; }
  return data.data || [];
}

async function getComments(postId) {
  const res  = await fetch(
    `https://graph.facebook.com/v19.0/${postId}/comments?fields=id,text,username,timestamp&limit=50&access_token=${TOKEN}`
  );
  const data = await res.json();
  if (data.error) { console.error('getComments error:', data.error); return []; }
  return data.data || [];
}

async function replyToComment(commentId, message) {
  const res  = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ message, access_token: TOKEN })
  });
  const data = await res.json();
  if (data.error) { console.error('replyToComment error:', data.error); return null; }
  return data;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('🤖 Klarvo reply bot — checking comments...');

const posts = await getPosts();
console.log(`📄 Found ${posts.length} recent posts`);

let repliedCount = 0;

for (const post of posts) {
  const comments = await getComments(post.id);

  for (const comment of comments) {
    // Skip if already handled
    if (replied.has(comment.id)) continue;

    // Only process comments from the last 2 hours (fresh ones)
    const age = Date.now() - new Date(comment.timestamp).getTime();
    if (age > 1000 * 60 * 60 * 2) {
      replied.add(comment.id); // mark old ones so we skip faster next time
      continue;
    }

    const commentUpper = (comment.text || '').toUpperCase();
    const keyword = Object.keys(KEYWORDS).find(k =>
      commentUpper.includes(k.toUpperCase())
    );

    if (keyword) {
      console.log(`💬 @${comment.username}: "${comment.text}" → [${keyword}]`);
      const result = await replyToComment(comment.id, KEYWORDS[keyword]);

      if (result) {
        console.log(`  ✅ Replied successfully`);
        repliedCount++;
      } else {
        console.log(`  ❌ Reply failed — will retry next run`);
        continue; // don't mark as replied so we retry
      }
    }

    replied.add(comment.id); // mark as processed
  }
}

// ─── Save state (picked up by Actions Cache on next run) ─────────────────────
// Keep only last 500 IDs to prevent file growing forever
const repliedArray = [...replied].slice(-500);
fs.writeFileSync(STATE_FILE, JSON.stringify(repliedArray));

console.log(`\n✅ Done. Replied to ${repliedCount} comments this run.`);
console.log(`📦 Tracking ${repliedArray.length} comment IDs in cache.`);
