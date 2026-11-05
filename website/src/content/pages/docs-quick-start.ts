import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';
import { quickStart } from '../examples.js';

const page: Page = { path: '/docs/quick-start', title: 'Quick start', group: 'Start here', description: 'Render a model, highlight muscles, and respond to interactions in a few lines.', sections: [
    section('render', 'Render a body map', `<p>Every graph renders one body and one view. Create two instances to show anterior and posterior anatomy together.</p>${codeBlock(quickStart)}`),
    section('views', 'Choose a body and view', `${codeBlock(`graph.update({ bodyType: 'female', type: 'posterior' });`)}<p>Both bodies expose the same 32 detailed muscle identifiers. See the <a href="/docs/muscles">muscle reference</a> for front and rear availability.</p>`),
    section('highlight', 'Highlight a muscle', `<p>Pass exercises through <code>data</code>. Broad names such as <code>chest</code> expand to their detailed regions.</p>${codeBlock(`graph.update({
  data: [{ name: 'Bench press', muscles: ['chest', 'triceps'], frequency: 3 }],
});

// Clear workout highlights
graph.update({ data: [] });`)}`),
    section('cleanup', 'Clean up', `<p>Destroy the instance when the host is removed. This removes its DOM and event listeners.</p>${codeBlock(`graph.destroy();`)}<p>Continue with <a href="/docs/data">workout data</a> or try the <a href="/showcase">interactive showcase</a>.</p>`),
  ] };

export default page;
