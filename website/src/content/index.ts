import type { Page } from './types.js';
import { section } from './helpers.js';
import overview from './pages/overview.js';
import installation from './pages/docs-installation.js';
import quickStartPage from './pages/docs-quick-start.js';
import showcase from './pages/showcase.js';
import workoutData from './pages/docs-data.js';
import theming from './pages/docs-theming.js';
import events from './pages/docs-events.js';
import lifecycle from './pages/docs-lifecycle.js';
import angular from './pages/docs-frameworks-angular.js';
import react from './pages/docs-frameworks-react.js';
import vue from './pages/docs-frameworks-vue.js';
import api from './pages/docs-api.js';
import muscles from './pages/docs-muscles.js';
import accessibility from './pages/docs-accessibility.js';

export type { Page } from './types.js';
export { quickStart } from './examples.js';

export const pages: readonly Page[] = [overview, installation, quickStartPage, showcase, workoutData, theming, events, lifecycle, angular, react, vue, api, muscles, accessibility];

export const notFoundPage: Page = { path: '/404', title: 'Page not found', description: 'That page could not be found. Browse the guides or search the documentation.', group: 'Documentation', sections: [section('continue', 'Find your next step', '<p><a href="/docs/installation">Start with installation</a>, browse the <a href="/docs/api">API reference</a>, or use the search at the top of this page.</p>')] };

export function getPage(path: string): Page {
  return pages.find(page => page.path === path.replace(/\/$/, '') || (page.path === '/' && path === '/')) ?? notFoundPage;
}
