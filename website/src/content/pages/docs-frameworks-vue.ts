import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';
import { vueExample } from '../examples.js';

const page: Page = { path: '/docs/frameworks/vue', title: 'Vue', group: 'Frameworks', description: 'Use the same API with Vue’s mount hooks and reactive props.', sections: [
    section('component', 'Create the component', `<p>Mount the graph after the template ref is available, watch data replacements, and destroy it before unmount.</p>${codeBlock(vueExample, 'Vue SFC')}`),
    section('state', 'Update reactive state', `<p>Replace your workout array when exercises change so the watcher receives a new value. You can pass other reactive options through the same <code>update()</code> call.</p>`),
  ] };

export default page;
