import { CHAPTERS, GREETINGS } from './content.js';
import { renderStory } from './story.js';
import { runIntro } from './intro.js';

runIntro(document.getElementById('intro'), document.getElementById('word'), GREETINGS, {
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
});
renderStory(document.getElementById('chapters'), CHAPTERS);
