export function baseTemplate(text) {
  return `
  <html>
  <body style="
    width:1080px;
    height:1080px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:black;
    color:white;
    font-size:48px;
    text-align:center;
    padding:60px;
    font-family:Arial;
  ">
    ${text}
  </body>
  </html>
  `;
}

export const slide1 = c => baseTemplate(c.slide1_hook);

export const slide2 = c => baseTemplate(c.slide2_headline);

export const slide3 = c => baseTemplate(c.slide3_headline);

// 🔥 PATTERN BREAKER
export const slide4 = c => baseTemplate(`
  <div style="font-size:90px">${c.slide4_stat}</div>
`);

// 🔥 EMOTIONAL HIT
export const slide5 = c => baseTemplate(`
  <div>
    <div>${c.slide5_headline}</div>
    <div style="margin-top:40px;font-size:36px">
      Comment "${c.slide5_cta_word}"
    </div>
  </div>
`);
