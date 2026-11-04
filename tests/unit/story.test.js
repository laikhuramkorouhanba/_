import { describe, it, expect } from 'vitest';
import { GREETINGS, CHAPTERS, REPOS, BOOK_LOOKS, COVER_FIGURES } from '../../src/content.js';
import { renderStory } from '../../src/story.js';

describe('content', () => {
  it('has the seven story lines', () => {
    expect(CHAPTERS.length).toBe(6);
    expect(CHAPTERS[0]).toBe('Raised in Manipur, in the far north east of India.');
    expect(CHAPTERS[5]).toBe('And the aim has always been the same: make the complicated feel effortless.');
  });

  it('has the greetings in order', () => {
    expect(GREETINGS).toEqual(['Hello', 'Bonjour', 'नमस्ते', 'Khurumjari', 'こんにちは', 'Hola', 'Ciao', 'Hello']);
  });

  it('has six books', () => {
    expect(REPOS.length).toBe(6);
    expect(BOOK_LOOKS.length).toBe(6);
    expect(COVER_FIGURES.length).toBe(6);
  });

  it('has no em dashes in the copy', () => {
    const strings = [...CHAPTERS, ...REPOS.flatMap((r) => Object.values(r))];
    for (const s of strings) expect(s).not.toContain('—');
  });
});

describe('renderStory', () => {
  it('renders one revealed row per line with the line as text', () => {
    const host = document.createElement('div');
    renderStory(host, CHAPTERS);
    const ps = host.querySelectorAll('.story-row.rv p');
    expect(ps.length).toBe(6);
    ps.forEach((p, i) => expect(p.textContent).toBe(CHAPTERS[i]));
  });

  it('sets text with textContent, not HTML', () => {
    const host = document.createElement('div');
    const line = '<b>bold</b> & more';
    renderStory(host, [line]);
    const p = host.querySelector('.story-row.rv p');
    expect(p.textContent).toBe(line);
    expect(p.querySelector('b')).toBeNull();
  });
});
