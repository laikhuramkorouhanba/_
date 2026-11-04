import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { REPOS } from '../../src/content.js';
import { bookGeometry, createShelf } from '../../src/shelf.js';

function setup(opts) {
  const row = document.createElement('div');
  document.body.appendChild(row);
  const detail = {};
  for (const k of ['lang', 'title', 'repo', 'desc']) detail[k] = document.createElement('p');
  detail.link = document.createElement('a');
  detail.link.href = '#';
  const shelf = createShelf(row, detail, opts);
  const slots = [...row.querySelectorAll('.slot')];
  const btn = (i) => slots[i].querySelector('button');
  return { row, detail, shelf, slots, btn };
}

describe('bookGeometry', () => {
  it('matches the prototype sizes', () => {
    expect(bookGeometry(0)).toEqual({ W: 62, H: 420, C: 286, openWidth: 317 });
    expect(bookGeometry(1)).toEqual({ W: 74, H: 450, C: 306, openWidth: 339 });
  });
});

describe('createShelf', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function () {};
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders six books with book 1 open', () => {
    const { slots, btn, detail } = setup();
    expect(slots.length).toBe(6);
    const pressed = slots.map((_, i) => btn(i).getAttribute('aria-pressed'));
    expect(pressed).toEqual(['true', 'false', 'false', 'false', 'false', 'false']);
    expect(btn(0).style.transform).toBe('rotateY(80deg)');
    expect(slots[0].style.width).toBe('317px');
    expect(detail.title.textContent).toBe('Churn');
    expect(detail.link.href).toBe('https://github.com/laikhuramkorouhanba/churn-streamlit');
  });

  it('pick opens one book and closes the others', () => {
    const { shelf, slots, btn, detail } = setup();
    shelf.pick(2, true);
    expect(btn(2).getAttribute('aria-pressed')).toBe('true');
    expect(btn(0).getAttribute('aria-pressed')).toBe('false');
    expect(btn(0).style.transform).toBe('rotateY(0deg)');
    expect(slots[0].style.width).toBe('62px');
    expect(detail.title.textContent).toBe('Murmur');
  });

  it('sets repo text with textContent, not HTML', () => {
    const repos = REPOS.map((r, i) => (i === 0 ? { ...r, title: '<b>x</b>', subtitle: '<i>s</i>' } : r));
    const { row, slots, detail } = setup({ repos });
    expect(row.querySelector('b')).toBeNull();
    expect(row.querySelector('i')).toBeNull();
    expect(slots[0].querySelector('.c-title').textContent).toBe('<b>x</b>');
    expect(slots[0].querySelector('.c-sub').textContent).toBe('<i>s</i>');
    expect(slots[0].textContent).toContain('<b>x</b>');
    expect(detail.title.textContent).toBe('<b>x</b>');
    expect(detail.title.children.length).toBe(0);
  });

  it('Review Focus 1: no scroll on load, scroll only after a real tap on phones', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { btn } = setup({ isPhone: () => true });
    vi.advanceTimersByTime(2000);
    expect(spy).toHaveBeenCalledTimes(0);
    btn(3).click();
    vi.advanceTimersByTime(719);
    expect(spy).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not scroll on desktop clicks', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { btn } = setup({ isPhone: () => false });
    btn(3).click();
    vi.advanceTimersByTime(2000);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
