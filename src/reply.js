import fetch from 'node-fetch';
import fs from 'fs';

const IG_ID = process.env.IG_ACCOUNT_ID;
const TOKEN = process.env.IG_ACCESS_TOKEN;

// Track replied comments so we don't double-reply
const REPLIED_FILE = 'replied.json';
let replied = fs.existsSync(REPLIED_FILE)
  ? JSON.parse(fs.readFileSync(REPLIED_FILE))
  : [];

const KEYWORDS = {
  // Lead capture
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

// Step 1 — get recent posts
async function getPosts() {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${IG_ID}/media?fields=id&limit=10&access_token=${TOKEN}`
  );
  const data = await res.json();
  return data.data || [];
}

// Step 2 — get comments on a post
async function getComments(postId) {
  const res = await fetch(
    `https://graph.facebook.com/v19.0/${postId}/comments?fields=id,text,username&access_token=${TOKEN}`
  );
  const data = await res.json();
  return data.data || [];
}

// Step 3 — reply to a comment
async function replyToComment(commentId, message) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: TOKEN })
  });
  const data = await res.json();
  if (data.error) console.error('Reply error:', data.error);
  return data;
}

// Main
const posts = await getPosts();

for (const post of posts) {
  const comments = await getComments(post.id);

  for (const comment of comments) {
    if (replied.includes(comment.id)) continue; // already handled

    const commentUpper = comment.text?.toUpperCase() || '';

    const keyword = Object.keys(KEYWORDS).find(k =>
      commentUpper.includes(k.toUpperCase())
    );

    if (keyword) {
      console.log(`Replying to @${comment.username} — keyword: ${keyword}`);
      await replyToComment(comment.id, KEYWORDS[keyword]);
      replied.push(comment.id);
    }
  }
}

// Save replied list
fs.writeFileSync(REPLIED_FILE, JSON.stringify(replied));
console.log('Done. Total replied comments tracked:', replied.length);
