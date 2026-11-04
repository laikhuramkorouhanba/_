import { describe, it, expect } from 'vitest';
import { project, globeView, drawGlobe } from '../../src/globe.js';
import LAND from '../../src/data/land-dots.json';

describe('project', () => {
  it('puts the view centre at the canvas centre, facing the viewer', () => {
    const [x, y, depth] = project(93.94, 24.82, 93.94, 24.82, 58, 64, 64);
    expect(Math.abs(x - 64)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(y - 64)).toBeLessThanOrEqual(0.5);
    expect(depth).toBeCloseTo(1, 6);
  });

  it('gives a negative depth for the antipode', () => {
    const [, , depth] = project(-86.06, -24.82, 93.94, 24.82, 58, 64, 64);
    expect(depth).toBeLessThan(0);
  });
});

describe('globeView', () => {
  it('starts at Manipur', () => {
    const { lon0, lat0 } = globeView((-Math.PI / 2) * 3200);
    expect(lon0).toBeCloseTo(93.94, 6);
    expect(lat0).toBeCloseTo(24, 6);
  });

  it('turns to Paris', () => {
    const { lon0, lat0 } = globeView((Math.PI / 2) * 3200);
    expect(lon0).toBeCloseTo(2.35, 6);
    expect(lat0).toBeCloseTo(38, 6);
  });
});

describe('land data', () => {
  it('is a flat lon/lat list of even length 2652', () => {
    expect(LAND.length % 2).toBe(0);
    expect(LAND.length).toBe(2652);
  });
});

describe('drawGlobe', () => {
  it('draws on a recording fake context without throwing', () => {
    const calls = [];
    const ctx = new Proxy(
      {},
      {
        get: (target, key) => (key in target ? target[key] : (...args) => calls.push([key, ...args])),
        set: (target, key, value) => {
          target[key] = value;
          return true;
        },
      },
    );
    const canvas = { width: 128, height: 128, getContext: () => ctx };
    expect(() => drawGlobe(canvas, 0)).not.toThrow();
    expect(calls[0]).toEqual(['clearRect', 0, 0, 128, 128]);
    expect(calls.filter((c) => c[0] === 'fill').length).toBeGreaterThan(2);
  });

  it('ignores a missing canvas', () => {
    expect(() => drawGlobe(null, 0)).not.toThrow();
  });
});
