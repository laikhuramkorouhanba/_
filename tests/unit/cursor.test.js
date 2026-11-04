import { describe, it, expect, beforeEach } from 'vitest';
import { initCursor } from '../../src/cursor.js';

function setup() {
  document.body.innerHTML = '';
  const root = document.createElement('div');
  root.className = 'mode-free';
  const tag = document.createElement('div');
  const shelf = document.createElement('div');
  const link = document.createElement('a');
  root.append(tag, shelf, link);
  document.body.appendChild(root);
  const cursor = initCursor(root, tag, [shelf, link]);
  return { root, tag, shelf, link, cursor };
}

const move = (x, y) => window.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));

describe('initCursor', () => {
  let s;
  beforeEach(() => { s = setup(); });

  it('switches to project mode while over a target', () => {
    expect(s.root.className).toBe('mode-free');
    for (const el of [s.shelf, s.link]) {
      el.dispatchEvent(new MouseEvent('mouseenter'));
      expect(s.root.className).toBe('mode-project');
      el.dispatchEvent(new MouseEvent('mouseleave'));
      expect(s.root.className).toBe('mode-free');
    }
  });

  it('moves the label 22% of the way to the pointer each step', () => {
    move(0, 0);
    move(100, 200);
    s.cursor.step();
    expect(s.tag.style.transform).toBe('translate(22px,44px) translate(-50%,-50%)');
  });

  it('leaves the label alone before any pointer event', () => {
    s.tag.style.transform = 'translate(1px,2px)';
    s.cursor.step();
    expect(s.tag.style.transform).toBe('translate(1px,2px)');
  });
});
