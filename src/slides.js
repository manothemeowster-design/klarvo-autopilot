// ─── SLIDE HTML TEMPLATE GENERATOR ──────────────────────────────────────────
// Generates pixel-perfect 1080x1080 HTML for each carousel slide
// Design: Dark red/gold, Anton headlines, DM Sans body, grid overlay

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@300;400;600;700;900&family=DM+Mono:wght@400;500&display=swap');`;

const BASE_STYLES = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; height: 1080px; overflow: hidden; }
  body {
    background: linear-gradient(145deg, #130606 0%, #240c0c 45%, #1a0808 100%);
    color: #F2E4C4;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(201,168,76,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.045) 1px, transparent 1px);
    background-size: 54px 54px;
  }
  .edge-top {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, #C9A84C 40%, #8B1A1A 70%, transparent 100%);
  }
  .edge-bottom {
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent 0%, #8B1A1A 30%, #C9A84C 60%, transparent 100%);
  }
  .top-bar {
    position: absolute; top: 42px; left: 60px; right: 60px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .agency {
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: #C9A84C; letter-spacing: 0.2em; text-transform: uppercase;
  }
  .cat-label {
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: rgba(201,168,76,0.5); letter-spacing: 0.14em; text-transform: uppercase;
  }
  .bottom-bar {
    position: absolute; bottom: 38px; left: 60px; right: 60px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .handle {
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: rgba(242,228,196,0.3); letter-spacing: 0.08em;
  }
  .counter {
    font-family: 'DM Mono', monospace; font-size: 13px;
    color: rgba(201,168,76,0.45); letter-spacing: 0.08em;
  }
  .content {
    position: absolute; top: 118px; bottom: 96px;
    left: 60px; right: 60px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .sec-label {
    font-family: 'DM Mono', monospace; font-size: 12px;
    color: #C9A84C; letter-spacing: 0.22em;
    text-transform: uppercase; margin-bottom: 22px;
  }
  .gold-bar { width: 56px; height: 2px; background: #C9A84C; margin: 26px 0; }
  .gold-rule {
    width: 100%; height: 1px; margin: 22px 0;
    background: linear-gradient(90deg, #C9A84C 0%, rgba(201,168,76,0.2) 70%, transparent 100%);
  }
`;

function shell(slideNum, total, category, innerCSS, innerHTML) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
${FONTS}
${BASE_STYLES}
${innerCSS}
</style></head><body>
<div class="grid"></div>
<div class="edge-top"></div>
<div class="edge-bottom"></div>
<div class="top-bar">
  <span class="agency">KLARVO.AI</span>
  <span class="cat-label">${category}</span>
</div>
<div class="bottom-bar">
  <span class="handle">@klarvo.ai</span>
  <span class="counter">0${slideNum} / 0${total}</span>
</div>
${innerHTML}
</body></html>`;
}

// ── SLIDE 1: HOOK ─────────────────────────────────────────────────────────────
export function slide1(data, category) {
  const len = (data.slide1_hook || '').length;
  const fs = len > 35 ? '82px' : len > 25 ? '96px' : len > 18 ? '110px' : '124px';

  const css = `
    .hook {
      font-family: 'Anton', sans-serif;
      font-size: ${fs}; line-height: 1.0;
      color: #F2E4C4; text-transform: uppercase;
      letter-spacing: -0.01em; margin-bottom: 38px;
    }
    .hook em { color: #C9A84C; font-style: normal; }
    .swipe {
      display: flex; align-items: center; gap: 12px;
      font-family: 'DM Mono', monospace; font-size: 16px;
      color: rgba(201,168,76,0.65); letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .swipe-arrow { font-size: 20px; }
    .corner-deco {
      position: absolute; bottom: 96px; right: 0;
      width: 220px; height: 220px;
      border-top: 1px solid rgba(201,168,76,0.12);
      border-left: 1px solid rgba(201,168,76,0.12);
      pointer-events: none;
    }
  `;

  const html = `
    <div class="corner-deco"></div>
    <div class="content">
      <div class="sec-label">AI AUTOMATION FOR LOCAL BUSINESS</div>
      <div class="hook">${data.slide1_hook}</div>
      <div class="gold-bar"></div>
      <div class="swipe">SWIPE TO SEE WHY <span class="swipe-arrow">→</span></div>
    </div>
  `;

  return shell(1, 5, category, css, html);
}

// ── SLIDE 2: PROBLEM ──────────────────────────────────────────────────────────
export function slide2(data, category) {
  const len = (data.slide2_headline || '').length;
  const fs = len > 30 ? '60px' : len > 22 ? '72px' : '84px';

  const css = `
    .bg-num {
      position: absolute; font-family: 'Anton', sans-serif;
      font-size: 340px; color: rgba(139,26,26,0.28);
      right: 30px; top: 50%; transform: translateY(-50%);
      line-height: 1; user-select: none; pointer-events: none;
    }
    .left-accent {
      position: absolute; left: 0; top: 130px; bottom: 110px;
      width: 3px;
      background: linear-gradient(180deg, transparent, #C9A84C 30%, #8B1A1A 70%, transparent);
    }
    .headline {
      font-family: 'Anton', sans-serif; font-size: ${fs};
      line-height: 1.04; color: #F2E4C4;
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 24px; max-width: 800px;
    }
    .body-text {
      font-family: 'DM Sans', sans-serif; font-size: 23px;
      line-height: 1.68; color: rgba(242,228,196,0.72);
      font-weight: 400; max-width: 680px;
    }
  `;

  const html = `
    <div class="bg-num">01</div>
    <div class="left-accent"></div>
    <div class="content" style="padding-left: 16px;">
      <div class="sec-label">${data.slide2_label || 'THE PROBLEM'}</div>
      <div class="headline">${data.slide2_headline}</div>
      <div class="gold-bar"></div>
      <div class="body-text">${data.slide2_body}</div>
    </div>
  `;

  return shell(2, 5, category, css, html);
}

// ── SLIDE 3: INSIGHT ──────────────────────────────────────────────────────────
export function slide3(data, category) {
  const len = (data.slide3_headline || '').length;
  const fs = len > 30 ? '60px' : len > 22 ? '72px' : '84px';

  const css = `
    .bg-num {
      position: absolute; font-family: 'Anton', sans-serif;
      font-size: 340px; color: rgba(139,26,26,0.28);
      right: 30px; top: 50%; transform: translateY(-50%);
      line-height: 1; user-select: none; pointer-events: none;
    }
    .headline {
      font-family: 'Anton', sans-serif; font-size: ${fs};
      line-height: 1.04; color: #C9A84C;
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 24px; max-width: 800px;
    }
    .body-text {
      font-family: 'DM Sans', sans-serif; font-size: 23px;
      line-height: 1.68; color: rgba(242,228,196,0.72);
      font-weight: 400; max-width: 680px;
    }
    .top-deco {
      position: absolute; top: 118px; right: 60px;
      width: 80px; height: 80px;
      border-bottom: 1px solid rgba(201,168,76,0.2);
      border-left: 1px solid rgba(201,168,76,0.2);
    }
  `;

  const html = `
    <div class="bg-num">02</div>
    <div class="top-deco"></div>
    <div class="content">
      <div class="sec-label">${data.slide3_label || 'THE TRUTH'}</div>
      <div class="headline">${data.slide3_headline}</div>
      <div class="gold-bar"></div>
      <div class="body-text">${data.slide3_body}</div>
    </div>
  `;

  return shell(3, 5, category, css, html);
}

// ── SLIDE 4: THE STAT ─────────────────────────────────────────────────────────
export function slide4(data, category) {
  const statLen = (data.slide4_stat || '').length;
  const statFS = statLen > 8 ? '110px' : statLen > 5 ? '138px' : '160px';

  const css = `
    .bg-num {
      position: absolute; font-family: 'Anton', sans-serif;
      font-size: 340px; color: rgba(139,26,26,0.28);
      right: 30px; top: 50%; transform: translateY(-50%);
      line-height: 1; user-select: none; pointer-events: none;
    }
    .stat {
      font-family: 'Anton', sans-serif; font-size: ${statFS};
      line-height: 1.0; color: #C9A84C;
      letter-spacing: -0.03em; margin-bottom: 6px;
    }
    .stat-context {
      font-family: 'DM Sans', sans-serif; font-size: 28px;
      line-height: 1.45; color: #F2E4C4;
      font-weight: 700; max-width: 620px; margin-bottom: 18px;
    }
    .stat-sub {
      font-family: 'DM Sans', sans-serif; font-size: 20px;
      line-height: 1.5; color: rgba(242,228,196,0.55);
      font-weight: 400; max-width: 620px;
    }
  `;

  const html = `
    <div class="bg-num">03</div>
    <div class="content">
      <div class="sec-label">${data.slide4_label || 'THE NUMBERS'}</div>
      <div class="stat">${data.slide4_stat}</div>
      <div class="gold-rule"></div>
      <div class="stat-context">${data.slide4_context}</div>
      <div class="stat-sub">${data.slide4_sub || ''}</div>
    </div>
  `;

  return shell(4, 5, category, css, html);
}

// ── SLIDE 5: CTA ──────────────────────────────────────────────────────────────
export function slide5(data, category) {
  const len = (data.slide5_headline || '').length;
  const fs = len > 30 ? '62px' : len > 22 ? '72px' : '82px';

  const css = `
    .cta-headline {
      font-family: 'Anton', sans-serif; font-size: ${fs};
      line-height: 1.04; color: #F2E4C4;
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 36px;
    }
    .comment-pill {
      display: inline-flex; align-items: center; gap: 18px;
      background: rgba(201,168,76,0.1);
      border: 1px solid rgba(201,168,76,0.35);
      border-radius: 8px; padding: 18px 30px;
      margin-bottom: 28px;
    }
    .pill-icon { font-size: 26px; }
    .pill-text {
      font-family: 'DM Sans', sans-serif; font-size: 20px;
      color: rgba(242,228,196,0.7); line-height: 1.3;
    }
    .pill-word {
      font-family: 'Anton', sans-serif; font-size: 40px;
      color: #C9A84C; letter-spacing: 0.04em;
    }
    .cta-desc {
      font-family: 'DM Sans', sans-serif; font-size: 21px;
      line-height: 1.55; color: rgba(242,228,196,0.55);
      max-width: 680px;
    }
    .right-deco {
      position: absolute; bottom: 96px; right: 0;
      width: 160px; height: 160px;
      border-top: 1px solid rgba(201,168,76,0.15);
      border-left: 1px solid rgba(201,168,76,0.15);
    }
  `;

  const html = `
    <div class="right-deco"></div>
    <div class="content">
      <div class="sec-label">WHAT'S NEXT</div>
      <div class="cta-headline">${data.slide5_headline}</div>
      <div class="comment-pill">
        <span class="pill-icon">💬</span>
        <div>
          <div class="pill-text">Comment</div>
          <div class="pill-word">"${data.slide5_cta_word}"</div>
        </div>
      </div>
      <div class="cta-desc">${data.slide5_cta_desc}</div>
    </div>
  `;

  return shell(5, 5, category, css, html);
}
