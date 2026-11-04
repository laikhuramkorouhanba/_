import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';

const IDS = [
  'root', 'tag', 'intro', 'word', 'globe', 'chapters', 'shelf', 'shelf-row',
  'detail', 'd-lang', 'd-title', 'd-repo', 'd-desc', 'd-link',
];

describe('index.html scaffold', () => {
  let doc;

  beforeAll(() => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8');
    doc = new JSDOM(html).window.document;
  });

  it('has the page title', () => {
    expect(doc.title).toBe('Korouhanba Khuman');
  });

  it.each(IDS)('has #%s', (id) => {
    expect(doc.getElementById(id)).not.toBeNull();
  });
});
