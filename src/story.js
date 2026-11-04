const ROW_STYLE = 'padding-bottom: clamp(96px, 12vw, 176px); box-sizing: border-box;';
const LINE_STYLE = 'margin: 0; max-width: 18em; font-size: clamp(32px, 4.4vw, 64px); line-height: 1.04; letter-spacing: -0.035em; font-weight: 500;';

export function renderStory(host, lines) {
  lines.forEach((line) => {
    const row = document.createElement('div');
    row.className = 'story-row rv';
    row.style.cssText = ROW_STYLE;
    const p = document.createElement('p');
    p.style.cssText = LINE_STYLE;
    p.textContent = line;
    row.appendChild(p);
    host.appendChild(row);
  });
}
