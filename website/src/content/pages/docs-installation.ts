import type { Page } from '../types.js';
import { section, note } from '../helpers.js';
import { codeBlock } from '../../html.js';
import { quickStart } from '../examples.js';

const page: Page = { path: '/docs/installation', title: 'Installation', group: 'Start here', description: 'Add muscle-graph to your project and render your first body map.', sections: [
    section('install', 'Install the package', `<p>Install from npm with your preferred package manager. The library ships typed ESM and CommonJS entry points and has zero runtime dependencies.</p>${codeBlock(`npm install muscle-graph`, 'Terminal')}${codeBlock(`pnpm add muscle-graph
yarn add muscle-graph`, 'Other package managers')}`),
    section('host', 'Create a host element', `<p>Give the library an empty element to own. Its SVG scales with the available width. Keep application content outside this host.</p>${codeBlock(`<div id="body-map"></div>`, 'HTML')}`),
    section('import', 'Import and render', `<p>Create a graph after the element exists in the browser.</p>${codeBlock(quickStart)}${note('Working in a framework? Use the <a href="/docs/frameworks/angular">Angular</a>, <a href="/docs/frameworks/react">React</a>, or <a href="/docs/frameworks/vue">Vue</a> guide to connect mounting and cleanup.')}`),
    section('distribution', 'Package formats', `<p>Use the default or named <code>createMuscleGraph</code> export. The package selects the corresponding declarations for ESM and CommonJS consumers.</p>${codeBlock(`import { createMuscleGraph } from 'muscle-graph';
// CommonJS
const { createMuscleGraph } = require('muscle-graph');`)}<p>For script-tag use, the UMD build exposes <code>MuscleGraph.createMuscleGraph</code>. Host the package’s <code>dist/muscle-graph.umd.cjs</code> file as a JavaScript asset.</p>`),
  ] };

export default page;
