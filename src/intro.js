// Multilingual welcome overlay. Ported from the prototype's intro block.
// The first word is already in the markup; it holds 750 ms, each next word
// 170 ms, the last 520 ms. Then the overlay slides up (CSS .leave) and is
// removed 950 ms later.
export function runIntro(overlay, wordEl, words, opts = {}) {
  if (opts.reducedMotion) { overlay.remove(); return; }
  let i = 0;
  function step() {
    i += 1;
    if (i < words.length) {
      wordEl.textContent = words[i];
      setTimeout(step, i === words.length - 1 ? 520 : 170);
    } else {
      overlay.classList.add('leave');
      setTimeout(() => { overlay.remove(); }, 950);
    }
  }
  setTimeout(step, 750);
}
