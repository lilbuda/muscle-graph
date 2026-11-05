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
    section('callbacks-update', 'Update callbacks', `<p>Pass a new callback to <code>update()</code> when your application state changes. The graph uses the latest callback without replacing the SVG.</p>${codeBlock(`graph.update({ onClick: handleMuscleClick });`)}`),
  ] };

export default page;
