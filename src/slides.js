// ─── COLOR SCHEMES ────────────────────────────────────────────────────────────
const SCHEMES = {
  RED_GOLD: {
    bg:        'linear-gradient(145deg, #130606 0%, #240c0c 45%, #1a0808 100%)',
    card:      '#8B1A1A',
    headline:  '#F2E4C4',
    body:      'rgba(242,228,196,0.72)',
    accent:    '#C9A84C',
    accentDim: 'rgba(201,168,76,0.45)',
    grid:      'rgba(201,168,76,0.045)',
    edgeA:     '#C9A84C',
    edgeB:     '#8B1A1A',
    bgNum:     'rgba(139,26,26,0.28)',
    label:     '#C9A84C',
  },
  BLACK_WHITE: {
    bg:        'linear-gradient(145deg, #080808 0%, #111111 50%, #0a0a0a 100%)',
    card:      '#1a1a1a',
    headline:  '#FFFFFF',
    body:      'rgba(255,255,255,0.65)',
    accent:    '#FFFFFF',
    accentDim: 'rgba(255,255,255,0.35)',
    grid:      'rgba(255,255,255,0.04)',
    edgeA:     '#FFFFFF',
    edgeB:     '#444444',
    bgNum:     'rgba(255,255,255,0.06)',
    label:     'rgba(255,255,255,0.5)',
  },
  GREEN_LIME: {
    bg:        'linear-gradient(145deg, #020f05 0%, #061a09 50%, #030d05 100%)',
    card:      '#0a2e10',
    headline:  '#E8FFE8',
    body:      'rgba(200,255,180,0.7)',
    accent:    '#7FFF00',
    accentDim: 'rgba(127,255,0,0.4)',
    grid:      'rgba(127,255,0,0.04)',
    edgeA:     '#7FFF00',
    edgeB:     '#1a5c20',
    bgNum:     'rgba(10,60,15,0.5)',
    label:     '#7FFF00',
  },
  NAVY_BLUE: {
    bg:        'linear-gradient(145deg, #020612 0%, #050d24 50%, #020810 100%)',
    card:      '#0a1640',
    headline:  '#E8F0FF',
    body:      'rgba(180,210,255,0.7)',
    accent:    '#4D9FFF',
    accentDim: 'rgba(77,159,255,0.4)',
    grid:      'rgba(77,159,255,0.045)',
    edgeA:     '#4D9FFF',
    edgeB:     '#1a3a8a',
    bgNum:     'rgba(10,22,64,0.6)',
    label:     '#4D9FFF',
  },
  CHARCOAL_ORANGE: {
    bg:        'linear-gradient(145deg, #0e0a06 0%, #1a1208 50%, #0e0a06 100%)',
    card:      '#2a1a08',
    headline:  '#FFF8F0',
    body:      'rgba(255,235,200,0.7)',
    accent:    '#FF6B00',
    accentDim: 'rgba(255,107,0,0.4)',
    grid:      'rgba(255,107,0,0.045)',
    edgeA:     '#FF6B00',
    edgeB:     '#8B3A00',
    bgNum:     'rgba(60,30,0,0.4)',
    label:     '#FF6B00',
  },
};

// Pick scheme based on day
const SCHEME_ORDER = ['RED_GOLD','BLACK_WHITE','GREEN_LIME','NAVY_BLUE','CHARCOAL_ORANGE','RED_GOLD','BLACK_WHITE'];
const day = new Date().getUTCDay();
const scheme = SCHEMES[SCHEME_ORDER[day]];

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');`;

// ─── BASE STYLES ──────────────────────────────────────────────────────────────
function baseStyles(s) {
  return `
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1080px; height:1080px; overflow:hidden; }
  body {
    background: ${s.bg};
    color: ${s.headline};
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  .grid {
    position:absolute; inset:0; pointer-events:none;
    background-image:
      linear-gradient(${s.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${s.grid} 1px, transparent 1px);
    background-size: 54px 54px;
  }
  .edge-top {
    position:absolute; top:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg, transparent 0%, ${s.edgeA} 40%, ${s.edgeB} 70%, transparent 100%);
  }
  .edge-bottom {
    position:absolute; bottom:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg, transparent 0%, ${s.edgeB} 30%, ${s.edgeA} 60%, transparent 100%);
  }
  .top-bar {
    position:absolute; top:42px; left:60px; right:60px;
    display:flex; justify-content:space-between; align-items:center;
  }
  .agency {
    font-family:'DM Mono', monospace; font-size:13px;
    color:${s.accent}; letter-spacing:0.2em; text-transform:uppercase;
  }
  .cat-label {
    font-family:'DM Mono', monospace; font-size:12px;
    color:${s.accentDim}; letter-spacing:0.14em; text-transform:uppercase;
  }
  .bottom-bar {
    position:absolute; bottom:38px; left:60px; right:60px;
    display:flex; justify-content:space-between; align-items:center;
  }
  .handle {
    font-family:'DM Mono', monospace; font-size:13px;
    color:${s.accentDim}; letter-spacing:0.08em;
  }
  .counter {
    font-family:'DM Mono', monospace; font-size:13px;
    color:${s.accentDim}; letter-spacing:0.08em;
  }
  .content {
    position:absolute; top:118px; bottom:96px;
    left:60px; right:60px;
    display:flex; flex-direction:column; justify-content:center;
  }
  .sec-label {
    font-family:'DM Mono', monospace; font-size:12px;
    color:${s.label}; letter-spacing:0.22em;
    text-transform:uppercase; margin-bottom:20px;
  }
  .gold-bar { width:56px; height:2px; background:${s.accent}; margin:24px 0; }
  .gold-rule {
    width:100%; height:1px; margin:20px 0;
    background: linear-gradient(90deg, ${s.accent} 0%, ${s.accentDim} 70%, transparent 100%);
  }
  .bg-num {
    position:absolute; font-family:'Anton', sans-serif;
    font-size:320px; color:${s.bgNum};
    right:20px; top:50%; transform:translateY(-50%);
    line-height:1; user-select:none; pointer-events:none;
    letter-spacing:-0.05em;
  }
  `;
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function shell(num, total, category, extraCSS, innerHTML) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
${FONTS}
${baseStyles(scheme)}
${extraCSS}
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
  <span class="counter">0${num} / 0${total}</span>
</div>
${innerHTML}
</body></html>`;
}

// ─── SLIDE 1: HOOK ────────────────────────────────────────────────────────────
export function slide1(data, category) {
  const text = data.slide1_hook || '';
  const fs = text.length > 40 ? '74px' : text.length > 30 ? '88px' : text.length > 20 ? '102px' : '118px';

  const css = `
    .hook {
      font-family:'Anton', sans-serif; font-size:${fs};
      line-height:1.0; color:${scheme.headline};
      text-transform:uppercase; letter-spacing:-0.01em;
      margin-bottom:34px; position:relative; z-index:2;
    }
    .hook .accent { color:${scheme.accent}; }
    .swipe-row {
      display:flex; align-items:center; gap:14px;
      position:relative; z-index:2;
    }
    .swipe-line {
      width:40px; height:1px; background:${scheme.accent};
    }
    .swipe-text {
      font-family:'DM Mono', monospace; font-size:15px;
      color:${scheme.accentDim}; letter-spacing:0.2em; text-transform:uppercase;
    }
    .corner-br {
      position:absolute; bottom:96px; right:0;
      width:180px; height:180px;
      border-top:1px solid ${scheme.accentDim};
      border-left:1px solid ${scheme.accentDim};
    }
    .curiosity-tag {
      display:inline-block; margin-bottom:20px;
      padding:6px 14px; border:1px solid ${scheme.accentDim};
      border-radius:3px;
      font-family:'DM Mono', monospace; font-size:11px;
      color:${scheme.label}; letter-spacing:0.18em; text-transform:uppercase;
    }
  `;

  return shell(1, 5, category, css, `
    <div class="corner-br"></div>
    <div class="content">
      <div class="curiosity-tag">SWIPE TO SEE WHY →</div>
      <div class="hook">${text}</div>
      <div class="gold-bar"></div>
      <div class="swipe-row">
        <div class="swipe-line"></div>
        <span class="swipe-text">AI AUTOMATION FOR LOCAL BUSINESS</span>
      </div>
    </div>
  `);
}

// ─── SLIDE 2: OPEN LOOP (don't answer yet) ────────────────────────────────────
export function slide2(data, category) {
  const hl = data.slide2_headline || '';
  const fs = hl.length > 32 ? '58px' : hl.length > 24 ? '70px' : '82px';

  const css = `
    .left-bar {
      position:absolute; left:0; top:130px; bottom:110px; width:3px;
      background:linear-gradient(180deg, transparent, ${scheme.accent} 30%, ${scheme.edgeB} 70%, transparent);
    }
    .headline {
      font-family:'Anton', sans-serif; font-size:${fs};
      line-height:1.04; color:${scheme.headline};
      text-transform:uppercase; margin-bottom:22px; max-width:820px;
    }
    .body-text {
      font-size:23px; line-height:1.7;
      color:${scheme.body}; max-width:700px;
    }
    .loop-tag {
      margin-top:28px; display:inline-flex; align-items:center; gap:10px;
      font-family:'DM Mono', monospace; font-size:13px;
      color:${scheme.label}; letter-spacing:0.16em; text-transform:uppercase;
    }
    .loop-arrow { font-size:18px; }
  `;

  return shell(2, 5, category, css, `
    <div class="bg-num">01</div>
    <div class="left-bar"></div>
    <div class="content" style="padding-left:16px;">
      <div class="sec-label">${data.slide2_label || 'THE PROBLEM'}</div>
      <div class="headline">${hl}</div>
      <div class="gold-bar"></div>
      <div class="body-text">${data.slide2_body}</div>
      <div class="loop-tag">KEEP SWIPING <span class="loop-arrow">→</span></div>
    </div>
  `);
}

// ─── SLIDE 3: PARTIAL REVEAL ──────────────────────────────────────────────────
export function slide3(data, category) {
  const hl = data.slide3_headline || '';
  const fs = hl.length > 32 ? '58px' : hl.length > 24 ? '70px' : '82px';

  const css = `
    .headline {
      font-family:'Anton', sans-serif; font-size:${fs};
      line-height:1.04; color:${scheme.accent};
      text-transform:uppercase; margin-bottom:22px; max-width:820px;
    }
    .body-text {
      font-size:23px; line-height:1.7;
      color:${scheme.body}; max-width:700px;
    }
    .top-corner {
      position:absolute; top:118px; right:60px;
      width:70px; height:70px;
      border-bottom:1px solid ${scheme.accentDim};
      border-left:1px solid ${scheme.accentDim};
    }
    .loop-tag {
      margin-top:28px; display:inline-flex; align-items:center; gap:10px;
      font-family:'DM Mono', monospace; font-size:13px;
      color:${scheme.label}; letter-spacing:0.16em; text-transform:uppercase;
    }
  `;

  return shell(3, 5, category, css, `
    <div class="bg-num">02</div>
    <div class="top-corner"></div>
    <div class="content">
      <div class="sec-label">${data.slide3_label || 'THE TRUTH'}</div>
      <div class="headline">${hl}</div>
      <div class="gold-bar"></div>
      <div class="body-text">${data.slide3_body}</div>
      <div class="loop-tag">THE NUMBER IS WILD → KEEP GOING</div>
    </div>
  `);
}

// ─── SLIDE 4: THE PROOF / STAT ────────────────────────────────────────────────
export function slide4(data, category) {
  const stat = data.slide4_stat || '';
  const statFS = stat.length > 10 ? '100px' : stat.length > 6 ? '130px' : '158px';

  const css = `
    .stat {
      font-family:'Anton', sans-serif; font-size:${statFS};
      line-height:1.0; color:${scheme.accent};
      letter-spacing:-0.03em; margin-bottom:4px;
    }
    .stat-context {
      font-size:30px; line-height:1.4;
      color:${scheme.headline}; font-weight:700;
      max-width:640px; margin-bottom:16px;
    }
    .stat-sub {
      font-size:20px; line-height:1.5;
      color:${scheme.body}; max-width:640px;
    }
    .loop-tag {
      margin-top:26px; display:inline-flex; align-items:center; gap:10px;
      font-family:'DM Mono', monospace; font-size:13px;
      color:${scheme.label}; letter-spacing:0.16em; text-transform:uppercase;
    }
  `;

  return shell(4, 5, category, css, `
    <div class="bg-num">03</div>
    <div class="content">
      <div class="sec-label">${data.slide4_label || 'THE NUMBERS'}</div>
      <div class="stat">${stat}</div>
      <div class="gold-rule"></div>
      <div class="stat-context">${data.slide4_context}</div>
      <div class="stat-sub">${data.slide4_sub || ''}</div>
      <div class="loop-tag">ONE MORE SLIDE → THIS CHANGES EVERYTHING</div>
    </div>
  `);
}

// ─── SLIDE 5: THE PAYOFF + CTA ────────────────────────────────────────────────
export function slide5(data, category) {
  const hl = data.slide5_headline || '';
  const fs = hl.length > 32 ? '58px' : hl.length > 24 ? '68px' : '78px';

  const css = `
    .cta-headline {
      font-family:'Anton', sans-serif; font-size:${fs};
      line-height:1.04; color:${scheme.headline};
      text-transform:uppercase; margin-bottom:32px;
    }
    .pill {
      display:inline-flex; align-items:center; gap:16px;
      background:${scheme.accentDim};
      border:1px solid ${scheme.accent};
      border-radius:6px; padding:16px 26px; margin-bottom:24px;
    }
    .pill-icon { font-size:24px; }
    .pill-label {
      font-size:18px; color:${scheme.body}; line-height:1.2;
    }
    .pill-word {
      font-family:'Anton', sans-serif; font-size:38px;
      color:${scheme.accent}; letter-spacing:0.06em;
    }
    .cta-desc {
      font-size:20px; line-height:1.55;
      color:${scheme.body}; max-width:700px;
    }
    .corner-br {
      position:absolute; bottom:96px; right:0;
      width:140px; height:140px;
      border-top:1px solid ${scheme.accentDim};
      border-left:1px solid ${scheme.accentDim};
    }
  `;

  return shell(5, 5, category, css, `
    <div class="corner-br"></div>
    <div class="content">
      <div class="sec-label">HERE'S HOW TO GET THIS</div>
      <div class="cta-headline">${hl}</div>
      <div class="pill">
        <span class="pill-icon">💬</span>
        <div>
          <div class="pill-label">Comment below</div>
          <div class="pill-word">"${data.slide5_cta_word}"</div>
        </div>
      </div>
      <div class="cta-desc">${data.slide5_cta_desc}</div>
    </div>
  `);
}
