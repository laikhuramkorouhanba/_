import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GREETINGS } from '../../src/content.js';
import { runIntro } from '../../src/intro.js';

function mount() {
  document.body.innerHTML =
    '<div class="intro" id="intro" aria-hidden="true"><div class="word"><i></i><span id="word">Hello</span></div></div>';
  return { overlay: document.getElementById('intro'), word: document.getElementById('word') };
}

describe('runIntro', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ''; });

  it('swaps words on the prototype timings', () => {
    const { overlay, word } = mount();
    runIntro(overlay, word, GREETINGS);
    expect(word.textContent).toBe('Hello');
    vi.advanceTimersByTime(749);
    expect(word.textContent).toBe('Hello');
    vi.advanceTimersByTime(1);
    expect(word.textContent).toBe('Bonjour');
    vi.advanceTimersByTime(170);
    expect(word.textContent).toBe('नमस्ते');
  });

  it('adds leave after the last word holds 520 ms, then removes the overlay 950 ms later', () => {
    const { overlay, word } = mount();
    runIntro(overlay, word, GREETINGS);
    // first word 750 ms, then words 1..n-2 hold 170 ms each, then the last word appears
    const lastShown = 750 + 170 * (GREETINGS.length - 2);
    vi.advanceTimersByTime(lastShown);
    expect(word.textContent).toBe(GREETINGS[GREETINGS.length - 1]);
    expect(overlay.classList.contains('leave')).toBe(false);
    vi.advanceTimersByTime(519);
    expect(overlay.classList.contains('leave')).toBe(false);
    vi.advanceTimersByTime(1);
    expect(overlay.classList.contains('leave')).toBe(true);
    expect(overlay.isConnected).toBe(true);
    vi.advanceTimersByTime(949);
    expect(overlay.isConnected).toBe(true);
    vi.advanceTimersByTime(1);
    expect(overlay.isConnected).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('with reduced motion removes the overlay right away and queues no timers', () => {
    const { overlay, word } = mount();
    runIntro(overlay, word, GREETINGS, { reducedMotion: true });
    expect(overlay.isConnected).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
