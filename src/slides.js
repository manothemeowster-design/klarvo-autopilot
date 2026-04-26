// ─── DESIGN SYSTEMS (extracted from reference images) ────────────────────────
//
// EDITORIAL   → Image 7: white/grid bg, massive black text, red accent pill, newspaper feel
// CREAM       → Image 2/5: warm cream bg, teal accent, serif+sans mix, floating labels
// BOLD_RED    → Image 4: solid red bg, white text, mixed weights, high impact
// MODERN      → Image 6: warm beige, orange accent, clean sans, product feel
// DARK_GOLD   → Image 1 (ours): dark red, gold accent, grid overlay
//
// Each scheme = complete visual identity: bg, text, accent, font style, decorators

const SCHEMES = {

  // ── EDITORIAL ─────────────────────────────────────────────────────────────
  // Reference: Image 7 — white grid background, huge black bold text,
  // red accent boxes/pills, dashed decorative lines, newspaper/zine energy
  EDITORIAL: {
    bg:         '#F7F7F7',
    gridColor:  'rgba(0,0,0,0.06)',
    headline:   '#0A0A0A',
    headlineAlt:'#0A0A0A',
    body:       '#3A3A3A',
    bodyLight:  '#888888',
    accent:     '#FF2200',
    accentText: '#FFFFFF',
    accentBg:   '#FF2200',
    label:      '#888888',
    labelBg:    'transparent',
    border:     'rgba(0,0,0,0.12)',
    swipeText:  '#0A0A0A',
    headlineFont: "'Anton', sans-serif",
    bodyFont:   "'DM Sans', sans-serif",
    monoFont:   "'DM Mono', monospace",
    dark: false,
  },

  // ── CREAM MINIMAL ─────────────────────────────────────────────────────────
  // Reference: Images 2 & 5 — warm off-white, mixed serif+sans typography,
  // teal/blue accent, floating pill labels, clean breathing room, editorial feel
  CREAM: {
    bg:         '#F4EFE6',
    gridColor:  'rgba(0,0,0,0.04)',
    headline:   '#1A1A1A',
    headlineAlt:'#0A6B5E',
    body:       '#444444',
    bodyLight:  '#888888',
    accent:     '#0D9488',
    accentText: '#FFFFFF',
    accentBg:   '#0D9488',
    label:      '#999999',
    labelBg:    'rgba(0,0,0,0.06)',
    border:     'rgba(0,0,0,0.1)',
    swipeText:  '#0D9488',
    headlineFont: "'Anton', sans-serif",
    bodyFont:   "'DM Sans', sans-serif",
    monoFont:   "'DM Mono', monospace",
    dark: false,
  },

  // ── BOLD RED ──────────────────────────────────────────────────────────────
  // Reference: Image 4 — saturated solid color BG, white text at multiple
  // weights (thin label + ultra-bold headline), brand photography energy
  BOLD_RED: {
    bg:         '#CC0A0A',
    gridColor:  'rgba(255,255,255,0.06)',
    headline:   '#FFFFFF',
    headlineAlt:'#FFD700',
    body:       'rgba(255,255,255,0.82)',
    bodyLight:  'rgba(255,255,255,0.5)',
    accent:     '#FFD700',
    accentText: '#000000',
    accentBg:   '#FFD700',
    label:      'rgba(255,255,255,0.55)',
    labelBg:    'rgba(255,255,255,0.12)',
    border:     'rgba(255,255,255,0.2)',
    swipeText:  '#FFD700',
    headlineFont: "'Anton', sans-serif",
    bodyFont:   "'DM Sans', sans-serif",
    monoFont:   "'DM Mono', monospace",
    dark: true,
  },

  // ── MODERN BEIGE ──────────────────────────────────────────────────────────
  // Reference: Image 6 — warm beige/cream, orange accent, mixed font weights,
  // clean product/brand feel, subtle shadows, modern SaaS aesthetic
  MODERN: {
    bg:         '#FAF6F0',
    gridColor:  'rgba(0,0,0,0.04)',
    headline:   '#111111',
    headlineAlt:'#FF5C00',
    body:       '#444444',
    bodyLight:  '#999999',
    accent:     '#FF5C00',
    accentText: '#FFFFFF',
    accentBg:   '#FF5C00',
    label:      '#999999',
    labelBg:    'rgba(0,0,0,0.06)',
    border:     'rgba(0,0,0,0.1)',
    swipeText:  '#FF5C00',
    headlineFont: "'Anton', sans-serif",
    bodyFont:   "'DM Sans', sans-serif",
    monoFont:   "'DM Mono', monospace",
    dark: false,
  },

  // ── DARK GOLD (original) ──────────────────────────────────────────────────
  // Reference: Image 1 (our posts) — dark maroon, gold accent, grid overlay
  DARK_GOLD: {
    bg:         '#130606',
    gridColor:  'rgba(201,168,76,0.05)',
    headline:   '#F2E4C4',
    headlineAlt:'#C9A84C',
    body:       'rgba(242,228,196,0.72)',
    bodyLight:  'rgba(242,228,196,0.4)',
    accent:     '#C9A84C',
    accentText: '#0A0A0A',
    accentBg:   '#C9A84C',
    label:      'rgba(201,168,76,0.6)',
    labelBg:    'rgba(201,168,76,0.1)',
    border:     'rgba(201,168,76,0.2)',
    swipeText:  '#C9A84C',
    headlineFont: "'Anton', sans-serif",
    bodyFont:   "'DM Sans', sans-serif",
    monoFont:   "'DM Mono', monospace",
    dark: true,
  },
};

// ─── SCHEME ROTATION BY DAY ───────────────────────────────────────────────────
const SCHEME_ORDER = ['EDITORIAL','CREAM','BOLD_RED','MODERN','DARK_GOLD','EDITORIAL','CREAM'];
const day = new Date().getUTCDay(); // 0=Sun ... 6=Sat
const S = SCHEMES[SCHEME_ORDER[day]];

// ─── FONTS ────────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400&family=DM+Mono:wght@400;500&display=swap');`;

// ─── BASE CSS ─────────────────────────────────────────────────────────────────
function base() {
  return `
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:1080px; height:1080px; overflow:hidden; }
    body {
      background: ${S.bg};
      font-family: ${S.bodyFont};
      position: relative;
    }
    /* subtle grid overlay */
    .grid {
      position:absolute; inset:0; pointer-events:none;
      background-image:
        linear-gradient(${S.gridColor} 1px, transparent 1px),
        linear-gradient(90deg, ${S.gridColor} 1px, transparent 1px);
      background-size: 60px 60px;
    }
  `;
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function shell(num, total, css, body) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${FONTS}${base()}${css}</style></head>
<body><div class="grid"></div>${body}</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — THE HOOK
// Full-bleed centered. MASSIVE text. Forces the scroll-stop.
// Reference feel: Image 7 (editorial grid + huge black text) /
//                 Image 4 (bold color BG, huge white text)
// ═══════════════════════════════════════════════════════════════════════════════
export function slide1(data) {
  const hook = (data.slide1_hook || '').toUpperCase();
  const len  = hook.length;
  const fs   = len > 50 ? '88px' : len > 38 ? '102px' : len > 26 ? '118px' : '136px';
  const lh   = '0.96';

  const css = `
    .wrap {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 70px 72px; text-align: center;
    }
    .agency {
      font-family: ${S.monoFont}; font-size: 13px; letter-spacing: 0.22em;
      color: ${S.label}; text-transform: uppercase;
      margin-bottom: 40px;
    }
    .hook {
      font-family: ${S.headlineFont}; font-size: ${fs}; line-height: ${lh};
      color: ${S.headline}; text-transform: uppercase;
      letter-spacing: -0.01em; flex: 1;
      display: flex; align-items: center; justify-content: center;
    }
    .hook .pop { color: ${S.accent}; }
    .swipe-pill {
      margin-top: 44px;
      display: inline-flex; align-items: center; gap: 10px;
      background: ${S.accentBg}; color: ${S.accentText};
      padding: 12px 24px; border-radius: 100px;
      font-family: ${S.monoFont}; font-size: 14px;
      letter-spacing: 0.16em; text-transform: uppercase; font-weight: 500;
    }
    .handle {
      position: absolute; bottom: 38px; left: 0; right: 0;
      text-align: center;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.08em;
    }
    .counter {
      position: absolute; top: 44px; right: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.06em;
    }
  `;

  return shell(1, 5, css, `
    <div class="wrap">
      <div class="agency">KLARVO.AI  ·  AI AUTOMATION</div>
      <div class="hook">${hook}</div>
      <div class="swipe-pill">SWIPE TO SEE WHY →</div>
    </div>
    <div class="counter">01 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — OPEN THE LOOP
// Clear label + massive headline + tight body copy. Opens the question.
// ═══════════════════════════════════════════════════════════════════════════════
export function slide2(data) {
  const hl  = (data.slide2_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '78px' : len > 28 ? '92px' : len > 20 ? '108px' : '124px';

  const css = `
    .wrap {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      justify-content: center; padding: 80px 84px;
    }
    .label-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 18px; border-radius: 6px;
      background: ${S.labelBg}; border: 1px solid ${S.border};
      font-family: ${S.monoFont}; font-size: 12px; letter-spacing: 0.2em;
      color: ${S.label}; text-transform: uppercase;
      margin-bottom: 32px; align-self: flex-start;
    }
    .headline {
      font-family: ${S.headlineFont}; font-size: ${fs};
      line-height: 0.96; color: ${S.headline};
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 36px;
    }
    .divider {
      width: 64px; height: 3px; background: ${S.accent};
      margin-bottom: 32px;
    }
    .body {
      font-size: 24px; line-height: 1.62; color: ${S.body};
      font-weight: 400; max-width: 860px;
    }
    .keep-going {
      margin-top: 40px; display: inline-flex; align-items: center; gap: 12px;
      font-family: ${S.monoFont}; font-size: 13px;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: ${S.accent};
    }
    .counter {
      position: absolute; bottom: 38px; right: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.06em;
    }
    .handle {
      position: absolute; bottom: 38px; left: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.08em;
    }
  `;

  return shell(2, 5, css, `
    <div class="wrap">
      <div class="label-pill">${data.slide2_label || 'THE PROBLEM'}</div>
      <div class="headline">${hl}</div>
      <div class="divider"></div>
      <div class="body">${data.slide2_body}</div>
      <div class="keep-going">KEEP SWIPING →</div>
    </div>
    <div class="counter">02 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — DEEPEN THE TENSION
// Accent-colored headline = visual shift = feels like revelation
// ═══════════════════════════════════════════════════════════════════════════════
export function slide3(data) {
  const hl  = (data.slide3_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '78px' : len > 28 ? '92px' : len > 20 ? '108px' : '124px';

  const css = `
    .wrap {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      justify-content: center; padding: 80px 84px;
    }
    .label-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 18px; border-radius: 6px;
      background: ${S.accentBg}; color: ${S.accentText};
      font-family: ${S.monoFont}; font-size: 12px; letter-spacing: 0.2em;
      text-transform: uppercase; margin-bottom: 32px; align-self: flex-start;
    }
    .headline {
      font-family: ${S.headlineFont}; font-size: ${fs};
      line-height: 0.96; color: ${S.headlineAlt};
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 36px;
    }
    .divider {
      width: 64px; height: 3px; background: ${S.border};
      margin-bottom: 32px;
    }
    .body {
      font-size: 24px; line-height: 1.62; color: ${S.body};
      font-weight: 400; max-width: 860px;
    }
    .tease {
      margin-top: 40px; padding: 18px 26px;
      border: 1px solid ${S.border}; border-radius: 8px;
      font-family: ${S.monoFont}; font-size: 14px; letter-spacing: 0.14em;
      color: ${S.accent}; text-transform: uppercase; display: inline-block;
    }
    .counter {
      position: absolute; bottom: 38px; right: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.06em;
    }
    .handle {
      position: absolute; bottom: 38px; left: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.08em;
    }
  `;

  return shell(3, 5, css, `
    <div class="wrap">
      <div class="label-pill">${data.slide3_label || 'THE TRUTH'}</div>
      <div class="headline">${hl}</div>
      <div class="divider"></div>
      <div class="body">${data.slide3_body}</div>
      <div class="tease">THE NUMBER IS INSANE → NEXT SLIDE</div>
    </div>
    <div class="counter">03 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE PROOF (the jaw-drop)
// GIGANTIC stat centered. Number does all the talking.
// Reference: Image 7 big bold numbers / Image 5 large centered text
// ═══════════════════════════════════════════════════════════════════════════════
export function slide4(data) {
  const stat = (data.slide4_stat || '').toUpperCase();
  const len  = stat.length;
  const fs   = len > 10 ? '120px' : len > 6 ? '152px' : '186px';

  const css = `
    .wrap {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 70px 84px; text-align: center;
    }
    .label-pill {
      padding: 8px 20px; border-radius: 6px;
      background: ${S.labelBg}; border: 1px solid ${S.border};
      font-family: ${S.monoFont}; font-size: 12px; letter-spacing: 0.2em;
      color: ${S.label}; text-transform: uppercase;
      margin-bottom: 36px;
    }
    .stat {
      font-family: ${S.headlineFont}; font-size: ${fs};
      line-height: 0.9; color: ${S.accent};
      letter-spacing: -0.03em; margin-bottom: 28px;
    }
    .rule {
      width: 100%; height: 1px; background: ${S.border};
      margin-bottom: 28px;
    }
    .context {
      font-family: ${S.headlineFont}; font-size: 42px; line-height: 1.1;
      color: ${S.headline}; text-transform: uppercase;
      max-width: 780px; margin-bottom: 16px;
    }
    .sub {
      font-size: 22px; line-height: 1.5; color: ${S.bodyLight};
      max-width: 700px;
    }
    .counter {
      position: absolute; bottom: 38px; right: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.06em;
    }
    .handle {
      position: absolute; bottom: 38px; left: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.08em;
    }
  `;

  return shell(4, 5, css, `
    <div class="wrap">
      <div class="label-pill">${data.slide4_label || 'THE NUMBERS'}</div>
      <div class="stat">${stat}</div>
      <div class="rule"></div>
      <div class="context">${data.slide4_context}</div>
      <div class="sub">${data.slide4_sub || ''}</div>
    </div>
    <div class="counter">04 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE CTA (the payoff)
// Bold CTA word front and center. Comment pill. Clean close.
// Reference: Image 2 "SAVE IT NOW" button / Image 7 red CTA box
// ═══════════════════════════════════════════════════════════════════════════════
export function slide5(data) {
  const hl  = (data.slide5_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '76px' : len > 28 ? '90px' : len > 20 ? '104px' : '118px';

  const css = `
    .wrap {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 70px 84px; text-align: center;
    }
    .above {
      font-family: ${S.monoFont}; font-size: 13px; letter-spacing: 0.2em;
      color: ${S.label}; text-transform: uppercase; margin-bottom: 28px;
    }
    .headline {
      font-family: ${S.headlineFont}; font-size: ${fs};
      line-height: 0.96; color: ${S.headline};
      text-transform: uppercase; letter-spacing: -0.01em;
      margin-bottom: 48px;
    }
    .cta-box {
      display: flex; align-items: center; gap: 20px;
      background: ${S.accentBg}; color: ${S.accentText};
      padding: 22px 40px; border-radius: 12px;
      margin-bottom: 24px;
    }
    .cta-icon { font-size: 28px; }
    .cta-inner { text-align: left; }
    .cta-line1 {
      font-family: ${S.bodyFont}; font-size: 18px;
      font-weight: 400; opacity: 0.85; line-height: 1;
      margin-bottom: 4px;
    }
    .cta-word {
      font-family: ${S.headlineFont}; font-size: 44px;
      letter-spacing: 0.06em; line-height: 1;
    }
    .cta-desc {
      font-size: 19px; line-height: 1.5;
      color: ${S.bodyLight}; max-width: 680px;
    }
    .counter {
      position: absolute; bottom: 38px; right: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.06em;
    }
    .handle {
      position: absolute; bottom: 38px; left: 60px;
      font-family: ${S.monoFont}; font-size: 13px;
      color: ${S.bodyLight}; letter-spacing: 0.08em;
    }
  `;

  return shell(5, 5, css, `
    <div class="wrap">
      <div class="above">HERE'S HOW TO GET THIS ↓</div>
      <div class="headline">${hl}</div>
      <div class="cta-box">
        <div class="cta-icon">💬</div>
        <div class="cta-inner">
          <div class="cta-line1">Comment below</div>
          <div class="cta-word">"${data.slide5_cta_word}"</div>
        </div>
      </div>
      <div class="cta-desc">${data.slide5_cta_desc}</div>
    </div>
    <div class="counter">05 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}
