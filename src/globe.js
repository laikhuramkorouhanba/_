// Dotted orthographic globe that eases between Manipur and Paris.
// Ported from prototype/index.html drawGlobe(); maths and constants unchanged.
import LAND from './data/land-dots.json';

const D = Math.PI / 180;
const CITIES = [[93.94, 24.82], [2.35, 48.86]];

// Orthographic projection. Angles in degrees. depth > 0 faces the viewer.
export function project(lon, lat, lam0, phi0, R, cx, cy) {
  const sp = Math.sin(phi0 * D), cp = Math.cos(phi0 * D);
  const l = lon * D - lam0 * D, f = lat * D, cf = Math.cos(f), sf = Math.sin(f), cl = Math.cos(l);
  const z = sp * sf + cp * cf * cl;
  return [cx + R * cf * Math.sin(l), cy - R * (cp * sf - sp * cf * cl), z];
}

// View centre (degrees) at time nowMs.
export function globeView(nowMs) {
  const t = (Math.sin(nowMs / 3200) + 1) / 2;
  const e = t * t * (3 - 2 * t);
  return { lon0: 93.94 + (2.35 - 93.94) * e, lat0: 24 + 14 * e };
}

export function drawGlobe(cv, now) {
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d'), S = cv.width, R = S / 2 - 6, cx = S / 2, cy = S / 2;
  const { lon0, lat0 } = globeView(now);
  const proj = (lon, lat) => project(lon, lat, lon0, lat0, R, cx, cy);

  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = '#ededea'; ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(11,12,13,0.18)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

  for (let i = 0; i < LAND.length; i += 2) {
    const q = proj(LAND[i], LAND[i + 1]);
    if (q[2] <= 0) continue;
    ctx.fillStyle = 'rgba(11,12,13,' + (0.25 + 0.6 * q[2]).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(q[0], q[1], 1.6, 0, Math.PI * 2); ctx.fill();
  }

  const a = CITIES[0], b = CITIES[1];
  const v = (c) => {
    const l = c[0] * D, f = c[1] * D;
    return [Math.cos(f) * Math.cos(l), Math.cos(f) * Math.sin(l), Math.sin(f)];
  };
  const A = v(a), B = v(b), om = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  ctx.strokeStyle = '#0b0c0d'; ctx.lineWidth = 2; ctx.beginPath();
  let pen = false;
  for (let k = 0; k <= 40; k++) {
    const s = k / 40, w1 = Math.sin((1 - s) * om) / Math.sin(om), w2 = Math.sin(s * om) / Math.sin(om);
    const x = w1 * A[0] + w2 * B[0], y = w1 * A[1] + w2 * B[1], zz = w1 * A[2] + w2 * B[2];
    const lift = 1 + 0.12 * Math.sin(Math.PI * s), n = Math.sqrt(x * x + y * y + zz * zz);
    const lon = Math.atan2(y, x) / D, lat = Math.asin(zz / n) / D, q2 = proj(lon, lat);
    const px = cx + (q2[0] - cx) * lift, py = cy + (q2[1] - cy) * lift;
    if (q2[2] > 0) { if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } } else pen = false;
  }
  ctx.stroke();

  CITIES.forEach((c) => {
    const q = proj(c[0], c[1]); if (q[2] <= 0) return;
    ctx.fillStyle = '#0b0c0d'; ctx.beginPath(); ctx.arc(q[0], q[1], 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#ededea'; ctx.lineWidth = 1.5; ctx.stroke();
  });
}
