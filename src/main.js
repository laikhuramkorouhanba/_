import { CHAPTERS, GREETINGS } from './content.js';
import { renderStory } from './story.js';
import { runIntro } from './intro.js';
import { createShelf } from './shelf.js';

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
