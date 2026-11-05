import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';

const page: Page = { path: '/docs/accessibility', title: 'Accessibility', group: 'Reference', description: 'Integrate keyboard interaction, accessible labels, and clear color choices.', sections: [
    section('keyboard', 'Keyboard interaction', `<p>Muscle groups are focusable buttons. Tab moves through the visible groups. Enter and Space activate a focused group through <code>onClick</code>. Held keys do not repeatedly activate it.</p>`),
    section('labels', 'Name each map', `${codeBlock(`createMuscleGraph({
  container: host,
  type: 'posterior',
  ariaLabel: 'Posterior muscles for the current workout',
});`)}<p>Groups expose an anatomical label, their current frequency, and an <code>aria-pressed</code> state based on positive workout frequency.</p>`),
    section('context', 'Provide context beyond color', `<p>Show the selected muscle name, exercise list, or frequency in your surrounding interface. An <code>aria-live</code> status can announce updates. Choose muscle, background and focus colors that remain distinguishable in your application’s theme.</p>${codeBlock(`<p id="selection-status" role="status" aria-live="polite"></p>`, 'HTML')}`),
  ] };

export default page;
