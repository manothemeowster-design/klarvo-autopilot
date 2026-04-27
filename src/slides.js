const FONTS_BASE = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=DM+Mono:wght@400;500&display=swap');`;
const FONTS_SERIF = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');`;

const SCHEMES = {
  ANTHROPIC: {
    bg:'#F5EFE4', headline:'#1A1A1A', headlineBold:'#E8510A', accent:'#E8510A',
    accentLight:'#FDE8DC', body:'#444444', bodyLight:'#999999',
    pillBg:'#FFFFFF', pillBorder:'rgba(0,0,0,0.07)', pillShadow:'0 2px 20px rgba(0,0,0,0.05)',
    pillText:'#333333', handle:'#CCCCCC',
    headlineFont:"'Playfair Display', Georgia, serif",
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'ANTHROPIC',
  },
  EDITORIAL: {
    bg:'#F8F8F8', headline:'#0A0A0A', headlineBold:'#0A0A0A', accent:'#FF2200',
    accentLight:'#FFE8E5', body:'#3A3A3A', bodyLight:'#888888',
    pillBg:'#FF2200', pillBorder:'transparent', pillShadow:'none',
    pillText:'#FFFFFF', handle:'#BBBBBB',
    headlineFont:"'Anton', sans-serif",
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'EDITORIAL',
  },
  BOLD_RED: {
    bg:'#C41010', headline:'#FFFFFF', headlineBold:'#FFD700', accent:'#FFD700',
    accentLight:'rgba(255,215,0,0.15)', body:'rgba(255,255,255,0.80)', bodyLight:'rgba(255,255,255,0.45)',
    pillBg:'rgba(255,255,255,0.12)', pillBorder:'rgba(255,255,255,0.25)', pillShadow:'none',
    pillText:'#FFFFFF', handle:'rgba(255,255,255,0.4)',
    headlineFont:"'Anton', sans-serif",
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:true, style:'BOLD',
  },
  MODERN: {
    bg:'#FAF6F0', headline:'#111111', headlineBold:'#FF5C00', accent:'#FF5C00',
    accentLight:'#FFF0E8', body:'#444444', bodyLight:'#999999',
    pillBg:'#FFFFFF', pillBorder:'rgba(0,0,0,0.08)', pillShadow:'0 2px 10px rgba(0,0,0,0.06)',
    pillText:'#333333', handle:'#BBBBBB',
    headlineFont:"'Anton', sans-serif",
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'MODERN',
  },
  DARK_GOLD: {
    bg:'#130606', headline:'#F2E4C4', headlineBold:'#C9A84C', accent:'#C9A84C',
    accentLight:'rgba(201,168,76,0.12)', body:'rgba(242,228,196,0.72)', bodyLight:'rgba(242,228,196,0.38)',
    pillBg:'rgba(201,168,76,0.10)', pillBorder:'rgba(201,168,76,0.25)', pillShadow:'none',
    pillText:'#C9A84C', handle:'rgba(201,168,76,0.4)',
    headlineFont:"'Anton', sans-serif",
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:true, style:'DARK',
  },
};

const SCHEME_KEYS = ['ANTHROPIC','EDITORIAL','BOLD_RED','MODERN','DARK_GOLD'];
const now   = new Date();
const _day  = now.getUTCDay();
const _hour = now.getUTCHours();
const _slot = _hour < 7 ? 0 : _hour < 11 ? 0 : _hour < 15 ? 1 : _hour < 19 ? 2 : 3;
const _totalHours = _day * 24 + _hour;
const S = SCHEMES[SCHEME_KEYS[Math.floor(_totalHours / 6) % SCHEME_KEYS.length]];

function gridCSS() {
  if (S.style === 'ANTHROPIC' || S.style === 'MODERN' || S.style === 'BOLD') return '';
  const c = S.dark ? 'rgba(201,168,76,0.05)' : 'rgba(0,0,0,0.055)';
  return `.grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px);background-size:60px 60px;}`;
}

function shell(isSerif, css, body) {
  const fonts = isSerif ? FONTS_SERIF : FONTS_BASE;
  const needsGrid = S.style === 'EDITORIAL' || S.style === 'DARK';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${fonts}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1080px;overflow:hidden;background:${S.bg};}
body{font-family:${S.bodyFont};position:relative;}
${gridCSS()}${css}
</style></head><body>${needsGrid?'<div class="grid"></div>':''}${body}</body></html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — HOOK (scroll stopper)
// ─────────────────────────────────────────────────────────────────────────────
export function slide1(data) {
  const hook  = data.slide1_hook || '';
  const pills = data.slide1_pills || ['AI Receptionist','Auto Follow-Up','24/7 Booking','Lead Recovery'];

  // ── ANTHROPIC STYLE ───────────────────────────────────────────────────────
  // Goal: massive serif text, ultra-thin regular words, ultra-bold last word,
  // 4 ghostly floating pills, ✳ brand icon, swipe hint below arrow
  if (S.style === 'ANTHROPIC') {
    const words    = hook.split(' ');
    const lastWord = words.pop();
    const rest     = words.join(' ');
    const len      = hook.length;

    // Aggressively large font sizes — short hooks get huge, long hooks stay readable
    const fs = len > 58 ? '88px'
             : len > 46 ? '106px'
             : len > 34 ? '126px'
             : len > 22 ? '148px'
             :            '168px';

    const css = `
      .wrap{
        position:absolute;inset:0;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:195px 72px 160px;
        text-align:center;
      }
      /* Regular words: feather-thin so the bold final word POPS */
      .hook-text{
        font-family:'Playfair Display',Georgia,serif;
        font-size:${fs};
        line-height:1.13;
        color:#1A1A1A;
        font-weight:300;
        letter-spacing:-0.02em;
      }
      .hook-text .bold{
        font-weight:900;
        color:#0D0D0D;
        font-style:italic;
        letter-spacing:-0.025em;
      }
      /* Arrow + swipe hint stacked */
      .bottom-row{
        margin-top:52px;
        display:flex;flex-direction:column;align-items:center;gap:11px;
      }
      .arrow{
        font-size:36px;
        color:#1A1A1A;
        font-family:'DM Sans',sans-serif;
        font-weight:300;
        line-height:1;
      }
      .swipe-hint{
        font-family:'DM Mono',monospace;
        font-size:11px;
        letter-spacing:0.26em;
        color:#BBBBBB;
        text-transform:uppercase;
      }
      /* Ghost pills — barely-there, premium */
      .pill{
        position:absolute;
        background:#FFFFFF;
        border:1px solid rgba(0,0,0,0.065);
        box-shadow:0 2px 22px rgba(0,0,0,0.045);
        border-radius:100px;
        padding:11px 22px;
        font-family:'DM Sans',sans-serif;
        font-size:14px;
        font-weight:500;
        color:#333333;
        white-space:nowrap;
      }
      /* Brand pill — top center with Anthropic-style asterisk */
      .brand-pill{
        position:absolute;
        top:60px;
        left:50%;
        transform:translateX(-50%);
        background:#FFFFFF;
        border:1px solid rgba(0,0,0,0.07);
        box-shadow:0 2px 22px rgba(0,0,0,0.055);
        border-radius:100px;
        padding:11px 22px;
        font-family:'DM Sans',sans-serif;
        font-size:14px;
        font-weight:500;
        color:#444444;
        white-space:nowrap;
        display:inline-flex;align-items:center;gap:10px;
      }
      .brand-star{
        font-size:18px;
        color:#E8510A;
        line-height:1;
        display:flex;align-items:center;
      }
      .handle{
        position:absolute;
        bottom:42px;left:50%;transform:translateX(-50%);
        font-family:'DM Mono',monospace;
        font-size:12px;color:#CCCCCC;
        letter-spacing:0.1em;
        white-space:nowrap;
      }
      .counter{
        position:absolute;
        top:64px;right:64px;
        font-family:'DM Mono',monospace;
        font-size:11px;color:#DDDDDD;
        letter-spacing:0.1em;
      }
    `;

    return shell(true, css, `
      <div class="counter">01 / 05</div>
      <div class="brand-pill">
        <span class="brand-star">✳</span>
        KLARVO.AI
      </div>
      <div class="pill" style="top:228px;right:50px;">${pills[0]}</div>
      <div class="pill" style="top:362px;left:44px;">${pills[1]}</div>
      <div class="pill" style="bottom:238px;right:54px;">${pills[2]}</div>
      <div class="pill" style="bottom:180px;left:48px;">${pills[3] || 'AI Automation'}</div>
      <div class="wrap">
        <div class="hook-text">${rest} <span class="bold">${lastWord}</span></div>
        <div class="bottom-row">
          <div class="arrow">→</div>
          <div class="swipe-hint">swipe to see how</div>
        </div>
      </div>
      <div class="handle">@klarvo.ai</div>
    `);
  }

  // ── ALL OTHER STYLES ──────────────────────────────────────────────────────
  const len = hook.length;
  const fs  = len > 45 ? '86px' : len > 32 ? '102px' : len > 22 ? '118px' : '136px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 80px;text-align:center;}
    .agency{font-family:${S.monoFont};font-size:13px;letter-spacing:0.22em;color:${S.bodyLight};text-transform:uppercase;margin-bottom:40px;}
    .hook{font-family:${S.headlineFont};font-size:${fs};line-height:0.96;color:${S.headline};text-transform:uppercase;letter-spacing:-0.015em;}
    .swipe-pill{margin-top:48px;display:inline-flex;align-items:center;gap:10px;background:${S.accent};color:${S.dark?'#000':'#fff'};padding:13px 26px;border-radius:100px;font-family:${S.monoFont};font-size:14px;letter-spacing:0.16em;text-transform:uppercase;}
    .handle{position:absolute;bottom:40px;left:0;right:0;text-align:center;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
    .counter{position:absolute;top:46px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
  `;
  return shell(false, css, `
    <div class="wrap">
      <div class="agency">KLARVO.AI  ·  AI AUTOMATION</div>
      <div class="hook">${hook.toUpperCase()}</div>
      <div class="swipe-pill">SWIPE TO SEE HOW →</div>
    </div>
    <div class="counter">01 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — OPEN LOOP (raises question, doesn't answer)
// ─────────────────────────────────────────────────────────────────────────────
export function slide2(data) {
  const hl  = (data.slide2_headline || '');
  const len = hl.length;
  const isSerif = S.style === 'ANTHROPIC';

  if (isSerif) {
    // Font size for serif: bigger and more dramatic
    const fs = len > 42 ? '80px' : len > 30 ? '96px' : len > 20 ? '114px' : '132px';
    const css = `
      .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:88px 96px;}
      .label{
        display:inline-flex;align-items:center;gap:8px;
        padding:9px 20px;border-radius:8px;
        background:#FDE8DC;border:1px solid rgba(232,81,10,0.15);
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.2em;color:#E8510A;
        text-transform:uppercase;margin-bottom:40px;
        align-self:flex-start;
      }
      .headline{
        font-family:'Playfair Display',Georgia,serif;
        font-size:${fs};line-height:1.09;
        color:#111111;font-weight:700;
        letter-spacing:-0.02em;
        margin-bottom:42px;
      }
      .bar{width:64px;height:3px;background:#E8510A;border-radius:2px;margin-bottom:38px;}
      .body{
        font-family:'DM Sans',sans-serif;
        font-size:26px;line-height:1.68;
        color:#444444;font-weight:400;
        max-width:860px;
      }
      .cta{
        margin-top:44px;
        display:inline-flex;align-items:center;gap:12px;
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.22em;text-transform:uppercase;color:#E8510A;
      }
      .counter{position:absolute;bottom:40px;right:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
      .handle{position:absolute;bottom:40px;left:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
    `;
    return shell(true, css, `
      <div class="wrap">
        <div class="label">${data.slide2_label || 'THE PROBLEM'}</div>
        <div class="headline">${hl}</div>
        <div class="bar"></div>
        <div class="body">${data.slide2_body}</div>
        <div class="cta">KEEP SWIPING →</div>
      </div>
      <div class="counter">02 / 05</div>
      <div class="handle">@klarvo.ai</div>
    `);
  }

  // Non-ANTHROPIC styles
  const hlUpper = hl.toUpperCase();
  const lenU = hlUpper.length;
  const fs = lenU > 36 ? '76px' : lenU > 26 ? '92px' : lenU > 18 ? '108px' : '124px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px 88px;}
    .label{display:inline-flex;align-items:center;padding:9px 20px;border-radius:8px;background:${S.accentLight};border:1px solid ${S.pillBorder};font-family:${S.monoFont};font-size:12px;letter-spacing:0.2em;color:${S.accent};text-transform:uppercase;margin-bottom:36px;align-self:flex-start;}
    .headline{font-family:${S.headlineFont};font-size:${fs};line-height:0.97;color:${S.headline};text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:38px;}
    .bar{width:56px;height:3px;background:${S.accent};margin-bottom:34px;}
    .body{font-size:25px;line-height:1.65;color:${S.body};font-weight:400;max-width:860px;}
    .cta{margin-top:40px;display:inline-flex;align-items:center;gap:12px;font-family:${S.monoFont};font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${S.accent};}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(false, css, `
    <div class="wrap">
      <div class="label">${data.slide2_label || 'THE PROBLEM'}</div>
      <div class="headline">${hlUpper}</div>
      <div class="bar"></div>
      <div class="body">${data.slide2_body}</div>
      <div class="cta">KEEP SWIPING →</div>
    </div>
    <div class="counter">02 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — DEEPEN TENSION (partial reveal)
// ─────────────────────────────────────────────────────────────────────────────
export function slide3(data) {
  const hl  = (data.slide3_headline || '');
  const len = hl.length;
  const isSerif = S.style === 'ANTHROPIC';

  if (isSerif) {
    const fs = len > 42 ? '80px' : len > 30 ? '96px' : len > 20 ? '114px' : '132px';
    const css = `
      .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:88px 96px;}
      .label{
        display:inline-flex;align-items:center;
        padding:9px 20px;border-radius:8px;
        background:#E8510A;color:#FFFFFF;
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.2em;text-transform:uppercase;
        margin-bottom:40px;align-self:flex-start;
      }
      .headline{
        font-family:'Playfair Display',Georgia,serif;
        font-size:${fs};line-height:1.09;
        color:#E8510A;font-weight:700;
        font-style:italic;
        letter-spacing:-0.02em;
        margin-bottom:42px;
      }
      .bar{width:64px;height:3px;background:rgba(0,0,0,0.1);border-radius:2px;margin-bottom:38px;}
      .body{
        font-family:'DM Sans',sans-serif;
        font-size:26px;line-height:1.68;
        color:#444444;font-weight:400;
        max-width:860px;
      }
      .tease{
        margin-top:42px;
        padding:16px 28px;
        border:1.5px solid rgba(232,81,10,0.25);
        border-radius:10px;display:inline-block;
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.2em;color:#E8510A;text-transform:uppercase;
      }
      .counter{position:absolute;bottom:40px;right:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
      .handle{position:absolute;bottom:40px;left:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
    `;
    return shell(true, css, `
      <div class="wrap">
        <div class="label">${data.slide3_label || 'THE TRUTH'}</div>
        <div class="headline">${hl}</div>
        <div class="bar"></div>
        <div class="body">${data.slide3_body}</div>
        <div class="tease">THE PROOF IS ON THE NEXT SLIDE →</div>
      </div>
      <div class="counter">03 / 05</div>
      <div class="handle">@klarvo.ai</div>
    `);
  }

  const hlUpper = hl.toUpperCase();
  const lenU = hlUpper.length;
  const fs = lenU > 36 ? '76px' : lenU > 26 ? '92px' : lenU > 18 ? '108px' : '124px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px 88px;}
    .label{display:inline-flex;align-items:center;padding:9px 20px;border-radius:8px;background:${S.accent};color:${S.dark?'#000':'#fff'};font-family:${S.monoFont};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:36px;align-self:flex-start;}
    .headline{font-family:${S.headlineFont};font-size:${fs};line-height:0.97;color:${S.headlineBold};text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:38px;}
    .bar{width:56px;height:3px;background:${S.accent};margin-bottom:34px;}
    .body{font-size:25px;line-height:1.65;color:${S.body};font-weight:400;max-width:860px;}
    .tease{margin-top:38px;padding:16px 24px;border:1px solid ${S.accent};border-radius:8px;display:inline-block;font-family:${S.monoFont};font-size:13px;letter-spacing:0.16em;color:${S.accent};text-transform:uppercase;}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(false, css, `
    <div class="wrap">
      <div class="label">${data.slide3_label || 'THE TRUTH'}</div>
      <div class="headline">${hlUpper}</div>
      <div class="bar"></div>
      <div class="body">${data.slide3_body}</div>
      <div class="tease">THE PROOF IS ON THE NEXT SLIDE →</div>
    </div>
    <div class="counter">03 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — THE STAT (jaw-drop number)
// ─────────────────────────────────────────────────────────────────────────────
export function slide4(data) {
  const stat = (data.slide4_stat || '').toUpperCase();
  const len  = stat.length;
  const isSerif = S.style === 'ANTHROPIC';

  // Bigger stat sizing across the board
  const fs = len > 12 ? '110px' : len > 8 ? '155px' : '200px';

  if (isSerif) {
    const css = `
      .wrap{
        position:absolute;inset:0;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:70px 88px;text-align:center;
      }
      .label{
        padding:9px 22px;border-radius:8px;
        background:#FDE8DC;border:1px solid rgba(232,81,10,0.15);
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.22em;color:#E8510A;
        text-transform:uppercase;margin-bottom:40px;
      }
      .stat{
        font-family:'Playfair Display',Georgia,serif;
        font-size:${fs};line-height:0.86;
        color:#E8510A;
        font-weight:900;font-style:italic;
        letter-spacing:-0.04em;
        margin-bottom:36px;
      }
      .rule{width:100%;height:1px;background:rgba(0,0,0,0.1);margin-bottom:36px;}
      .context{
        font-family:'Playfair Display',Georgia,serif;
        font-size:42px;line-height:1.12;
        color:#111111;font-weight:700;
        max-width:800px;margin-bottom:20px;
      }
      .sub{
        font-family:'DM Sans',sans-serif;
        font-size:22px;line-height:1.55;
        color:#999999;max-width:700px;font-weight:400;
      }
      .counter{position:absolute;bottom:40px;right:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
      .handle{position:absolute;bottom:40px;left:64px;font-family:'DM Mono',monospace;font-size:11px;color:#CCCCCC;letter-spacing:0.1em;}
    `;
    return shell(true, css, `
      <div class="wrap">
        <div class="label">${data.slide4_label || 'THE NUMBERS'}</div>
        <div class="stat">${stat}</div>
        <div class="rule"></div>
        <div class="context">${data.slide4_context}</div>
        <div class="sub">${data.slide4_sub || ''}</div>
      </div>
      <div class="counter">04 / 05</div>
      <div class="handle">@klarvo.ai</div>
    `);
  }

  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 88px;text-align:center;}
    .label{padding:9px 22px;border-radius:8px;background:${S.accentLight};border:1px solid ${S.pillBorder};font-family:${S.monoFont};font-size:12px;letter-spacing:0.2em;color:${S.accent};text-transform:uppercase;margin-bottom:36px;}
    .stat{font-family:${S.headlineFont};font-size:${fs};line-height:0.88;color:${S.accent};letter-spacing:-0.03em;margin-bottom:32px;}
    .rule{width:100%;height:1px;background:${S.dark?'rgba(242,228,196,0.12)':'rgba(0,0,0,0.1)'};margin-bottom:32px;}
    .context{font-family:${S.headlineFont};font-size:40px;line-height:1.1;color:${S.headline};text-transform:uppercase;max-width:800px;margin-bottom:18px;}
    .sub{font-size:22px;line-height:1.5;color:${S.bodyLight};max-width:700px;}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(false, css, `
    <div class="wrap">
      <div class="label">${data.slide4_label || 'THE NUMBERS'}</div>
      <div class="stat">${stat}</div>
      <div class="rule"></div>
      <div class="context">${data.slide4_context}</div>
      <div class="sub">${data.slide4_sub || ''}</div>
    </div>
    <div class="counter">04 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — CTA PAYOFF (comment prompt)
// ─────────────────────────────────────────────────────────────────────────────
export function slide5(data) {
  const hl  = (data.slide5_headline || '');
  const len = hl.length;
  const isSerif = S.style === 'ANTHROPIC';

  if (isSerif) {
    const fs = len > 40 ? '76px' : len > 28 ? '90px' : len > 18 ? '106px' : '122px';
    const css = `
      .wrap{
        position:absolute;inset:0;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:80px 88px;text-align:center;
      }
      .above{
        font-family:'DM Mono',monospace;font-size:12px;
        letter-spacing:0.24em;color:#AAAAAA;
        text-transform:uppercase;margin-bottom:36px;
      }
      .headline{
        font-family:'Playfair Display',Georgia,serif;
        font-size:${fs};line-height:1.1;
        color:#111111;font-weight:400;
        margin-bottom:56px;letter-spacing:-0.02em;
      }
      .headline .bold{font-weight:900;font-style:italic;}
      /* Outline pill button — minimal and clean */
      .save-btn{
        display:inline-flex;align-items:center;gap:14px;
        border:2px solid #111111;border-radius:100px;
        padding:20px 48px;margin-bottom:30px;
        font-family:'DM Sans',sans-serif;font-size:17px;
        letter-spacing:0.1em;color:#111111;
        text-transform:uppercase;font-weight:500;
        white-space:nowrap;
      }
      .cta-word{
        font-family:'Playfair Display',Georgia,serif;
        font-size:26px;font-weight:900;font-style:italic;
        color:#E8510A;
      }
      .cta-desc{
        font-family:'DM Sans',sans-serif;
        font-size:20px;line-height:1.6;
        color:#888888;max-width:680px;font-weight:400;
      }
      /* Floating brand pill at bottom */
      .logo-pill{
        position:absolute;bottom:50px;left:50%;transform:translateX(-50%);
        display:inline-flex;align-items:center;gap:10px;
        background:#FFFFFF;border:1px solid rgba(0,0,0,0.07);
        box-shadow:0 2px 22px rgba(0,0,0,0.05);border-radius:100px;
        padding:11px 22px;font-family:'DM Mono',monospace;
        font-size:12px;color:#777777;letter-spacing:0.08em;
        white-space:nowrap;
      }
      .logo-dot{width:10px;height:10px;border-radius:50%;background:#E8510A;flex-shrink:0;}
    `;
    return shell(true, css, `
      <div class="wrap">
        <div class="above">HERE'S HOW TO GET THIS</div>
        <div class="headline">${hl}</div>
        <div class="save-btn">💬 Comment <span class="cta-word">"${data.slide5_cta_word}"</span></div>
        <div class="cta-desc">${data.slide5_cta_desc}</div>
      </div>
      <div class="logo-pill"><div class="logo-dot"></div>@klarvo.ai</div>
    `);
  }

  const hlUpper = hl.toUpperCase();
  const lenU = hlUpper.length;
  const fs = lenU > 36 ? '74px' : lenU > 26 ? '88px' : lenU > 18 ? '102px' : '116px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 88px;text-align:center;}
    .above{font-family:${S.monoFont};font-size:13px;letter-spacing:0.2em;color:${S.bodyLight};text-transform:uppercase;margin-bottom:30px;}
    .headline{font-family:${S.headlineFont};font-size:${fs};line-height:0.96;color:${S.headline};text-transform:uppercase;letter-spacing:-0.015em;margin-bottom:46px;}
    .cta-box{display:flex;align-items:center;gap:18px;background:${S.accent};color:${S.dark?'#000':'#fff'};padding:22px 42px;border-radius:12px;margin-bottom:22px;}
    .cta-icon{font-size:26px;}
    .cta-label{font-family:${S.bodyFont};font-size:18px;font-weight:400;opacity:0.85;}
    .cta-word{font-family:${S.headlineFont};font-size:42px;letter-spacing:0.08em;}
    .cta-desc{font-size:19px;line-height:1.55;color:${S.bodyLight};max-width:680px;}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(false, css, `
    <div class="wrap">
      <div class="above">HERE'S HOW TO GET THIS ↓</div>
      <div class="headline">${hlUpper}</div>
      <div class="cta-box">
        <span class="cta-icon">💬</span>
        <div>
          <div class="cta-label">Comment</div>
          <div class="cta-word">"${data.slide5_cta_word}"</div>
        </div>
      </div>
      <div class="cta-desc">${data.slide5_cta_desc}</div>
    </div>
    <div class="counter">05 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}
