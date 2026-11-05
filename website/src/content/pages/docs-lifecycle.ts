import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';

const page: Page = { path: '/docs/lifecycle', title: 'Lifecycle & SSR', group: 'Guides', description: 'Mount, update, and dispose of graphs safely in modern web applications.', sections: [
    section('mount', 'Mount after the host exists', `<p>Importing the package is safe during server rendering. Create the graph after your framework mounts its host element. Creating an instance without a DOM throws an explanatory error.</p>${codeBlock(`const graph = createMuscleGraph();
host.append(graph.element);`)}<p>The container is used at creation. To move a graph within the same document, append <code>graph.element</code> to its new host. For a new document, destroy and recreate the instance.</p>`),
    section('updates', 'Update the instance', `<p>Data, color, style, and callback updates reuse the current SVG nodes. Changing <code>bodyType</code> or <code>type</code> rebuilds geometry. Focus is retained when the focused muscle exists in the new view.</p>${codeBlock(`graph.update({ bodyType: 'female' });
graph.update({ data: nextWorkout });
graph.update({ hoverColor: '#b65e43' });`)}`),
    section('dispose', 'Dispose on unmount', `<p><code>destroy()</code> removes the wrapper and its listeners. It is safe to call more than once. Subsequent updates are ignored.</p>${codeBlock(`graph.destroy();`)}`),
    section('documents', 'Iframes and nested graphs', `<p>A supplied host determines the document used to create the graph. Iframe containers are supported. Each instance scopes event handling and focus restoration to its own wrapper.</p>`),
  ] };

export default page;
