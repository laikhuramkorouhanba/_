// GoatCounter page views: free, no cookies, no consent banner needed.
// Loads only when a site code is set at build time (VITE_GOATCOUNTER_CODE).
export function addAnalytics(head, code) {
  if (!code || !/^[a-z0-9-]+$/.test(code)) return null;
  const s = document.createElement('script');
  s.async = true;
  s.dataset.goatcounter = 'https://' + code + '.goatcounter.com/count';
  s.src = 'https://gc.zgo.at/count.js';
  head.appendChild(s);
  return s;
}
