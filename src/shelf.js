import { REPOS, BOOK_LOOKS, COVER_FIGURES } from './content.js';

// Ported from the prototype's Shelf module. The template below only holds
// static markup plus numbers and colours from BOOK_LOOKS; every piece of
// repo text (and the book number) is set afterwards with textContent.

export function bookGeometry(i) {
  const k = BOOK_LOOKS[i % BOOK_LOOKS.length];
  const W = k.W;
  const H = k.H;
  const C = Math.round(H * 0.68);
  return { W, H, C, openWidth: Math.round(C * 0.985 + W * 0.18) + 24 };
}

const GRAIN = '<svg class="grain"><rect width="100%" height="100%" filter="url(#grain)"></rect></svg>';

function bookMarkup(i) {
  const k = BOOK_LOOKS[i % BOOK_LOOKS.length];
  const { W, H, C } = bookGeometry(i);
  const cloth = 'background-color:' + k.bg + ';color:' + k.fg + ';';
  return (
    '<button class="b3d" type="button" style="width:' + W + 'px;height:' + H + 'px;">' +
    '<div class="face" style="left:0;width:' + W + 'px;height:' + H + 'px;transform:translateZ(' + (C / 2) + 'px);' + cloth + 'background-image:linear-gradient(90deg,rgba(0,0,0,.35),rgba(255,255,255,.10) 22%,rgba(255,255,255,0) 45%,rgba(0,0,0,.12) 80%,rgba(0,0,0,.35));display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;box-shadow:inset 0 3px 0 rgba(255,255,255,.06),inset 0 -3px 0 rgba(0,0,0,.25);">' + GRAIN +
      '<span style="position:absolute;left:0;right:0;top:40px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;height:3px;opacity:.55;"></span>' +
      '<span style="position:absolute;left:0;right:0;bottom:40px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;height:3px;opacity:.55;"></span>' +
      '<span style="position:relative;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;">Khuman</span>' +
      '<span class="s-title" style="position:relative;writing-mode:vertical-rl;transform:rotate(180deg);font-size:19px;font-weight:500;letter-spacing:0.01em;white-space:nowrap;"></span>' +
      '<span class="s-num" style="position:relative;font-size:9px;font-weight:500;letter-spacing:.16em;"></span></div>' +
    '<div class="face" style="left:' + ((W - C) / 2) + 'px;width:' + C + 'px;height:' + H + 'px;transform:rotateY(-90deg) translateZ(' + (W / 2) + 'px);' + cloth + 'background-image:linear-gradient(90deg,rgba(0,0,0,.30) 0,rgba(0,0,0,.08) 14px,rgba(255,255,255,.07) 16px,rgba(255,255,255,0) 40%,rgba(0,0,0,.10));display:flex;flex-direction:column;justify-content:space-between;padding:28px 26px 30px 34px;">' + GRAIN +
      '<span style="position:absolute;inset:16px 16px 16px 26px;border:1px solid currentColor;opacity:.3;"></span>' +
      '<div style="position:relative;display:flex;justify-content:space-between;font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;"><span>Korouhanba Khuman</span><span class="c-num"></span></div>' +
      '<div style="position:relative;display:flex;justify-content:center;"><svg width="140" height="140" viewBox="0 0 150 150" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path></path></svg></div>' +
      '<div style="position:relative;"><div class="c-title" style="font-size:40px;font-weight:500;line-height:0.95;letter-spacing:-0.035em;margin-bottom:12px;"></div><div class="c-sub" style="font-size:15px;letter-spacing:-0.005em;opacity:.75;"></div></div></div>' +
    '<div class="face" style="left:' + ((W - C) / 2 + 4) + 'px;top:5px;width:' + (C - 8) + 'px;height:' + (H - 10) + 'px;transform:rotateY(90deg) translateZ(' + (W / 2 - 2) + 'px);background:repeating-linear-gradient(90deg,#efe9dc 0 1px,#ddd6c5 1px 2px);"></div>' +
    '</button>'
  );
}

export function createShelf(row, detail, opts = {}) {
  const repos = opts.repos || REPOS;
  const isPhone = opts.isPhone || (() => false);
  const slots = [];

  repos.forEach((r, i) => {
    const n = (i < 9 ? '0' : '') + (i + 1);
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.innerHTML = bookMarkup(i);
    slot.querySelector('.s-title').textContent = r.title;
    slot.querySelector('.s-num').textContent = n;
    slot.querySelector('.c-num').textContent = n;
    slot.querySelector('path').setAttribute('d', COVER_FIGURES[i % COVER_FIGURES.length]);
    slot.querySelector('.c-title').textContent = r.title;
    slot.querySelector('.c-sub').textContent = r.subtitle;
    slot.querySelector('button').addEventListener('click', () => pick(i, true));
    row.appendChild(slot);
    slots.push(slot);
  });

  function pick(i, fromUser) {
    slots.forEach((s, j) => {
      const g = bookGeometry(j);
      const sel = j === i;
      const b = s.querySelector('button');
      s.style.width = (sel ? g.openWidth : g.W) + 'px';
      b.style.transform = sel ? 'rotateY(80deg)' : 'rotateY(0deg)';
      b.setAttribute('aria-pressed', sel ? 'true' : 'false');
      b.setAttribute('aria-label', (sel ? 'Open: ' : 'Open ') + repos[j].title);
    });
    const r = repos[i];
    detail.lang.textContent = r.lang;
    detail.title.textContent = r.title;
    detail.repo.textContent = r.repo;
    detail.desc.textContent = r.desc;
    detail.link.href = r.url;
    // Review Focus 1: only a real tap scrolls, never the initial pick.
    if (fromUser && isPhone()) {
      setTimeout(() => {
        slots[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }, 720);
    }
  }

  pick(0);
  return { pick };
}
