// "See the project" label: follows the pointer with a 22% lag per frame and
// shows only while the pointer is over one of the targets.
export function initCursor(root, tag, targets) {
  let mx = 0, my = 0, tx = 0, ty = 0, seen = false;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (!seen) { tx = mx; ty = my; seen = true; }
  });
  const setMode = (m) => { root.className = 'mode-' + m; };
  for (const el of targets) {
    el.addEventListener('mouseenter', () => setMode('project'));
    el.addEventListener('mouseleave', () => setMode('free'));
  }
  function step() {
    if (!seen) return;
    tx += (mx - tx) * 0.22; ty += (my - ty) * 0.22;
    tag.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%)';
  }
  return { step };
}
