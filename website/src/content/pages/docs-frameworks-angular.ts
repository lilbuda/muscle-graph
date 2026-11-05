import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';
import { angularExample } from '../examples.js';

const page: Page = { path: '/docs/frameworks/angular', title: 'Angular', group: 'Frameworks', description: 'Connect a standalone Angular component to signals and the browser render lifecycle.', sections: [
    section('component', 'Create a standalone component', `<p>Use <code>afterNextRender</code> to mount the graph in the browser. An injector-backed effect applies signal input changes. <code>DestroyRef</code> disposes of the instance with the component.</p>${codeBlock(angularExample)}`),
    section('usage', 'Pass workout data', `${codeBlock(`<app-muscle-map [data]="workout()" bodyType="female" />`, 'Angular template')}<p>Keep your workout state in the parent. Pass the same state to your exercise list, analytics, and muscle map.</p>`),
  ] };

export default page;
