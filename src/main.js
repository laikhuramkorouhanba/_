import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/500.css';
import '@fontsource/inter-tight/600.css';
import { CHAPTERS, GREETINGS } from './content.js';
import { renderStory } from './story.js';
import { runIntro } from './intro.js';
import { createShelf } from './shelf.js';
import { drawGlobe } from './globe.js';
import { initCursor } from './cursor.js';
import { addAnalytics } from './analytics.js';

const $ = (id) => document.getElementById(id);

runIntro($('intro'), $('word'), GREETINGS, {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
});
renderStory($('chapters'), CHAPTERS);
createShelf(
  $('shelf-row'),
  { lang: $('d-lang'), title: $('d-title'), repo: $('d-repo'), desc: $('d-desc'), link: $('d-link') },
  { isPhone: () => innerWidth < 761 },
);

const cursor = initCursor($('root'), $('tag'), [$('shelf'), $('d-link')]);
const globe = $('globe');
function loop(now) {
  cursor.step();
  drawGlobe(globe, now);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

addAnalytics(document.head, import.meta.env.VITE_GOATCOUNTER_CODE);
