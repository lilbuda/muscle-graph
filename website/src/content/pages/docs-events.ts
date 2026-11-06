import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';

const page: Page = { path: '/docs/events', title: 'Interactions', group: 'Guides', description: 'Connect clicks, keyboard activation, and muscle statistics to your interface.', sections: [
    section('callbacks', 'Listen for activation', `${codeBlock(`const graph = createMuscleGraph({
  container: host,
  onClick: ({ muscle, data }) => {
    console.log(muscle, data.exercises, data.frequency);
  },
  onMouseEnter: ({ muscle }) => { label.textContent = muscle; },
  onMouseLeave: () => { label.textContent = ''; },
});`)}<p>Callbacks report the detailed identifier of the activated group. Enter and Space activate focused muscles through the same <code>onClick</code> callback.</p>`),
    section('controlled-selection', 'Control selection', `<p>The callback reports activation. Keep selection in your application state and update the graph to display it.</p>${codeBlock(`let selected: string | undefined;
const graph = createMuscleGraph({
  container: host,
  onClick: ({ muscle }) => {
    selected = selected === muscle ? undefined : muscle;
    graph.update({
      data: selected ? [{ name: 'Selection', muscles: [selected] }] : [],
    });
  },
});`)}`),
    section('static-maps', 'Display a static map', `<p>Set <code>interactive: false</code> to disable mouse, touch and keyboard activation, pointer callbacks, tab stops, and hover effects. Regions become labeled images and preserve their set counts, SVG titles, data-driven highlights, and custom colors.</p>${codeBlock(`const graph = createMuscleGraph({
  container: host,
  interactive: false,
  ariaLabel: 'Muscles trained this week',
  data: [{ name: 'Bench press', muscles: ['chest'], frequency: 3 }],
});

graph.update({ type: 'posterior' });
graph.update({ interactive: true });`)}<p>Changing interactivity reuses the SVG. Disabling it clears focus from a focused muscle. View switching controls belong to your application. Manage their native <code>disabled</code> state separately so users can switch views of a static map.</p>`),
    section('callbacks-update', 'Update callbacks', `<p>Pass a new callback to <code>update()</code> when your application state changes. The graph uses the latest callback without replacing the SVG. Callbacks remain available when interactivity is re-enabled.</p>${codeBlock(`graph.update({ onClick: handleMuscleClick });`)}`),
  ] };

export default page;
