import { describe, it, expect, beforeEach } from 'vitest';
import { addAnalytics } from '../../src/analytics.js';

describe('addAnalytics', () => {
  beforeEach(() => { document.head.innerHTML = ''; });

  it('adds nothing without a site code', () => {
    expect(addAnalytics(document.head, undefined)).toBe(null);
    expect(addAnalytics(document.head, '')).toBe(null);
    expect(document.head.querySelectorAll('script').length).toBe(0);
  });

  it('adds the GoatCounter script for a valid code', () => {
    addAnalytics(document.head, 'korouhanba');
    const s = document.head.querySelector('script');
    expect(s.src).toBe('https://gc.zgo.at/count.js');
    expect(s.async).toBe(true);
    expect(s.dataset.goatcounter).toBe('https://korouhanba.goatcounter.com/count');
  });

  it('ignores a code that is not a plain site name', () => {
    expect(addAnalytics(document.head, 'evil.com/x?')).toBe(null);
    expect(document.head.querySelectorAll('script').length).toBe(0);
  });
});
