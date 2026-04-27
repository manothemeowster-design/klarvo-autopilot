const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Mono:wght@400;500&display=swap');`;

const SCHEMES = {
  ANTHROPIC: {
    bg:'#F7F2EA', headline:'#111111', headlineBold:'#111111', accent:'#E8510A',
    accentLight:'#FDE8DC', body:'#444444', bodyLight:'#999999',
    pillBg:'#FFFFFF', pillBorder:'rgba(0,0,0,0.10)', pillShadow:'0 2px 12px rgba(0,0,0,0.08)',
    pillText:'#333333', arrow:'#111111', handle:'#AAAAAA',
    headlineFont:"'DM Sans', sans-serif", headlineW:300, headlineBoldW:800,
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'ANTHROPIC',
  },
  EDITORIAL: {
    bg:'#F8F8F8', headline:'#0A0A0A', headlineBold:'#0A0A0A', accent:'#FF2200',
    accentLight:'#FFE8E5', body:'#3A3A3A', bodyLight:'#888888',
    pillBg:'#FF2200', pillBorder:'transparent', pillShadow:'none',
    pillText:'#FFFFFF', arrow:'#FF2200', handle:'#BBBBBB',
    headlineFont:"'Anton', sans-serif", headlineW:400, headlineBoldW:400,
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'EDITORIAL',
  },
  BOLD_RED: {
    bg:'#C41010', headline:'#FFFFFF', headlineBold:'#FFD700', accent:'#FFD700',
    accentLight:'rgba(255,215,0,0.15)', body:'rgba(255,255,255,0.80)', bodyLight:'rgba(255,255,255,0.45)',
    pillBg:'rgba(255,255,255,0.12)', pillBorder:'rgba(255,255,255,0.25)', pillShadow:'none',
    pillText:'#FFFFFF', arrow:'#FFD700', handle:'rgba(255,255,255,0.4)',
    headlineFont:"'Anton', sans-serif", headlineW:400, headlineBoldW:400,
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:true, style:'BOLD',
  },
  MODERN: {
    bg:'#FAF6F0', headline:'#111111', headlineBold:'#FF5C00', accent:'#FF5C00',
    accentLight:'#FFF0E8', body:'#444444', bodyLight:'#999999',
    pillBg:'#FFFFFF', pillBorder:'rgba(0,0,0,0.08)', pillShadow:'0 2px 10px rgba(0,0,0,0.06)',
    pillText:'#333333', arrow:'#FF5C00', handle:'#BBBBBB',
    headlineFont:"'Anton', sans-serif", headlineW:400, headlineBoldW:400,
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:false, style:'MODERN',
  },
  DARK_GOLD: {
    bg:'#130606', headline:'#F2E4C4', headlineBold:'#C9A84C', accent:'#C9A84C',
    accentLight:'rgba(201,168,76,0.12)', body:'rgba(242,228,196,0.72)', bodyLight:'rgba(242,228,196,0.38)',
    pillBg:'rgba(201,168,76,0.10)', pillBorder:'rgba(201,168,76,0.25)', pillShadow:'none',
    pillText:'#C9A84C', arrow:'#C9A84C', handle:'rgba(201,168,76,0.4)',
    headlineFont:"'Anton', sans-serif", headlineW:400, headlineBoldW:400,
    bodyFont:"'DM Sans', sans-serif", monoFont:"'DM Mono', monospace",
    dark:true, style:'DARK',
  },
};

const SCHEME_KEYS = ['ANTHROPIC','EDITORIAL','BOLD_RED','MODERN','DARK_GOLD'];
const now   = new Date();
const _day  = now.getUTCDay();
const _hour = now.getUTCHours();
const _slot = _hour < 7 ? 0 : _hour < 11 ? 0 : _hour < 15 ? 1 : _hour < 19 ? 2 : 3;
const S     = SCHEMES[SCHEME_KEYS[(_day * 4 + _slot) % SCHEME_KEYS.length]];

function gridCSS() {
  if (S.style === 'ANTHROPIC' || S.style === 'MODERN' || S.style === 'BOLD') return '';
  const c = S.dark ? 'rgba(201,168,76,0.05)' : 'rgba(0,0,0,0.055)';
  return `.grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(${c} 1px,transparent 1px),linear-gradient(90deg,${c} 1px,transparent 1px);background-size:60px 60px;}`;
}

function shell(css, body) {
  const needsGrid = S.style === 'EDITORIAL' || S.style === 'DARK';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${FONTS}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1080px;overflow:hidden;background:${S.bg};}
body{font-family:${S.bodyFont};position:relative;}
${gridCSS()}
${css}
</style></head><body>${needsGrid ? '<div class="grid"></div>' : ''}${body}</body></html>`;
}

export function slide1(data) {
  const hook  = data.slide1_hook || '';
  const pills = data.slide1_pills || ['AI Receptionist','Auto Follow-Up','24/7 Booking','Lead Recovery'];

  if (S.style === 'ANTHROPIC') {
    const words    = hook.split(' ');
    const lastWord = words.pop();
    const rest     = words.join(' ');
    const len      = hook.length;
    const fs       = len > 45 ? '86px' : len > 32 ? '100px' : len > 22 ? '116px' : '132px';
    const css = `
      .logo-pill{position:absolute;top:54px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;background:${S.pillBg};border:1px solid ${S.pillBorder};box-shadow:${S.pillShadow};border-radius:100px;padding:9px 18px;font-family:${S.monoFont};font-size:13px;color:${S.pillText};letter-spacing:0.06em;white-space:nowrap;}
      .logo-dot{width:10px;height:10px;border-radius:50%;background:${S.accent};}
      .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:140px 80px 120px;text-align:center;}
      .hook-text{font-family:${S.headlineFont};font-size:${fs};line-height:1.08;color:${S.headline};font-weight:${S.headlineW};letter-spacing:-0.02em;}
      .hook-text .bold{font-weight:${S.headlineBoldW};color:${S.headlineBold};}
      .arrow-row{margin-top:48px;font-size:32px;color:${S.arrow};}
      .pill{position:absolute;background:${S.pillBg};border:1px solid ${S.pillBorder};box-shadow:${S.pillShadow};border-radius:100px;padding:10px 20px;font-family:${S.bodyFont};font-size:16px;color:${S.pillText};font-weight:500;white-space:nowrap;}
      .p1{top:175px;left:54px;} .p2{top:175px;right:54px;} .p3{bottom:118px;left:54px;} .p4{bottom:118px;right:54px;}
      .handle{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
      .counter{position:absolute;top:60px;right:60px;font-family:${S.monoFont};font-size:12px;color:${S.handle};letter-spacing:0.08em;}
    `;
    return shell(css, `
      <div class="logo-pill"><div class="logo-dot"></div>KLARVO.AI</div>
      <div class="counter">01 / 05</div>
      <div class="center">
        <div class="hook-text">${rest} <span class="bold">${lastWord}</span></div>
        <div class="arrow-row">→</div>
      </div>
      <div class="pill p1">${pills[0]}</div>
      <div class="pill p2">${pills[1]}</div>
      <div class="pill p3">${pills[2]}</div>
      <div class="pill p4">${pills[3]}</div>
      <div class="handle">@klarvo.ai</div>
    `);
  }

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
  return shell(css, `
    <div class="wrap">
      <div class="agency">KLARVO.AI  ·  AI AUTOMATION</div>
      <div class="hook">${hook.toUpperCase()}</div>
      <div class="swipe-pill">SWIPE TO SEE WHY →</div>
    </div>
    <div class="counter">01 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

export function slide2(data) {
  const hl  = (data.slide2_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '76px' : len > 26 ? '92px' : len > 18 ? '108px' : '124px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px 88px;}
    .label{display:inline-flex;align-items:center;padding:9px 20px;border-radius:8px;background:${S.accentLight};border:1px solid ${S.pillBorder};font-family:${S.monoFont};font-size:12px;letter-spacing:0.2em;color:${S.accent};text-transform:uppercase;margin-bottom:36px;align-self:flex-start;}
    .headline{font-family:${S.headlineFont};font-size:${fs};line-height:0.96;color:${S.headline};text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:38px;}
    .bar{width:56px;height:3px;background:${S.accent};margin-bottom:34px;}
    .body{font-size:25px;line-height:1.65;color:${S.body};font-weight:400;max-width:860px;}
    .cta{margin-top:40px;display:inline-flex;align-items:center;gap:12px;font-family:${S.monoFont};font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:${S.accent};}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(css, `
    <div class="wrap">
      <div class="label">${data.slide2_label||'THE PROBLEM'}</div>
      <div class="headline">${hl}</div>
      <div class="bar"></div>
      <div class="body">${data.slide2_body}</div>
      <div class="cta">KEEP SWIPING →</div>
    </div>
    <div class="counter">02 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

export function slide3(data) {
  const hl  = (data.slide3_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '76px' : len > 26 ? '92px' : len > 18 ? '108px' : '124px';
  const css = `
    .wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px 88px;}
    .label{display:inline-flex;align-items:center;padding:9px 20px;border-radius:8px;background:${S.accent};color:${S.dark?'#000':'#fff'};font-family:${S.monoFont};font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:36px;align-self:flex-start;}
    .headline{font-family:${S.headlineFont};font-size:${fs};line-height:0.96;color:${S.headlineBold};text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:38px;}
    .bar{width:56px;height:3px;background:${S.pillBorder};margin-bottom:34px;}
    .body{font-size:25px;line-height:1.65;color:${S.body};font-weight:400;max-width:860px;}
    .tease{margin-top:38px;padding:16px 24px;border:1px solid ${S.pillBorder};border-radius:8px;display:inline-block;font-family:${S.monoFont};font-size:13px;letter-spacing:0.16em;color:${S.accent};text-transform:uppercase;}
    .counter{position:absolute;bottom:40px;right:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
    .handle{position:absolute;bottom:40px;left:62px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.08em;}
  `;
  return shell(css, `
    <div class="wrap">
      <div class="label">${data.slide3_label||'THE TRUTH'}</div>
      <div class="headline">${hl}</div>
      <div class="bar"></div>
      <div class="body">${data.slide3_body}</div>
      <div class="tease">THE PROOF IS ON THE NEXT SLIDE →</div>
    </div>
    <div class="counter">03 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

export function slide4(data) {
  const stat = (data.slide4_stat || '').toUpperCase();
  const len  = stat.length;
  const fs   = len > 10 ? '118px' : len > 7 ? '150px' : '190px';
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
  return shell(css, `
    <div class="wrap">
      <div class="label">${data.slide4_label||'THE NUMBERS'}</div>
      <div class="stat">${stat}</div>
      <div class="rule"></div>
      <div class="context">${data.slide4_context}</div>
      <div class="sub">${data.slide4_sub||''}</div>
    </div>
    <div class="counter">04 / 05</div>
    <div class="handle">@klarvo.ai</div>
  `);
}

export function slide5(data) {
  const hl  = (data.slide5_headline || '').toUpperCase();
  const len = hl.length;
  const fs  = len > 36 ? '74px' : len > 26 ? '88px' : len > 18 ? '102px' : '116px';

  if (S.style === 'ANTHROPIC') {
    const css = `
      .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 88px;text-align:center;}
      .above{font-family:${S.monoFont};font-size:13px;letter-spacing:0.2em;color:${S.bodyLight};text-transform:uppercase;margin-bottom:32px;}
      .headline{font-family:${S.headlineFont};font-size:${fs};line-height:1.06;color:${S.headline};font-weight:${S.headlineBoldW};margin-bottom:52px;letter-spacing:-0.02em;}
      .save-btn{display:inline-flex;align-items:center;gap:12px;border:2px solid ${S.headline};border-radius:100px;padding:18px 40px;margin-bottom:28px;font-family:${S.monoFont};font-size:16px;letter-spacing:0.18em;color:${S.headline};text-transform:uppercase;}
      .cta-word{font-family:'Anton',sans-serif;font-size:28px;letter-spacing:0.08em;color:${S.accent};}
      .cta-desc{font-size:20px;line-height:1.55;color:${S.bodyLight};max-width:680px;}
      .logo-pill{position:absolute;bottom:52px;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;background:${S.pillBg};border:1px solid ${S.pillBorder};box-shadow:${S.pillShadow};border-radius:100px;padding:9px 18px;font-family:${S.monoFont};font-size:13px;color:${S.handle};letter-spacing:0.06em;}
      .logo-dot{width:8px;height:8px;border-radius:50%;background:${S.accent};}
    `;
    return shell(css, `
      <div class="wrap">
        <div class="above">HERE'S HOW TO GET THIS</div>
        <div class="headline">${hl}</div>
        <div class="save-btn">💬 Comment <span class="cta-word">"${data.slide5_cta_word}"</span></div>
        <div class="cta-desc">${data.slide5_cta_desc}</div>
      </div>
      <div class="logo-pill"><div class="logo-dot"></div>@klarvo.ai</div>
    `);
  }

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
  return shell(css, `
    <div class="wrap">
      <div class="above">HERE'S HOW TO GET THIS ↓</div>
      <div class="headline">${hl}</div>
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
