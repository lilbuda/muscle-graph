import { version } from '../../package.json';
import { pages, quickStart, type Page } from './content/index.js';
import { arrow, codeBlock, copyIcon, escapeHtml } from './html.js';

export function renderNavigation(path: string): string {
  const groups = [...new Set(pages.map(page => page.group))];
  return groups.map(group => `<div class="nav-group"><p>${escapeHtml(group)}</p>${pages.filter(page => page.group === group).map(page => `<a href="${page.path}" ${page.path === path ? 'aria-current="page"' : ''}>${escapeHtml(page.title)}${page.path === '/showcase' ? '<span class="nav-live">Live</span>' : ''}</a>`).join('')}</div>`).join('')
    + `<div class="sidebar-bottom"><span>muscle-graph ${version}</span><a href="https://github.com/lilbuda/muscle-graph">Source on GitHub ${arrow}</a></div>`;
}

function showcaseMarkup(full = false): string {
  return `<section class="showcase ${full ? 'showcase-full' : ''}" aria-label="Interactive muscle map">
    <div class="showcase-toolbar"><div class="body-switch" aria-label="Body model"><button type="button" data-body="male" aria-pressed="true">Male</button><button type="button" data-body="female" aria-pressed="false">Female</button></div><label class="preset-label">Workout <select id="workout-preset"><option value="upper">Upper body</option><option value="lower">Lower body</option><option value="full">Full body</option><option value="empty">Empty map</option></select></label></div>
    <div class="anatomy-views"><figure><figcaption>Anterior</figcaption><div id="anterior-map" class="map-host"></div></figure><figure><figcaption>Posterior</figcaption><div id="posterior-map" class="map-host"></div></figure></div>
    <div class="selection-readout"><span class="readout-label">Explore the anatomy</span><p id="map-status" role="status" aria-live="polite">Select a muscle to see its name.</p><button type="button" id="clear-selection">Reset selection ${arrow}</button></div>
    ${full ? `<div class="showcase-options"><div><h2>Make it yours</h2><p>Changes appear in the map and configuration below.</p></div><div class="color-controls"><label>Muscles<input type="color" id="map-muscle-color" /></label><label>Body fill<input type="color" id="map-fill-color" /></label><label>Body outline<input type="color" id="map-outline-color" /></label><label>Muscle borders<input type="color" id="map-border-color" /></label><label>Highlight<input type="color" id="map-highlight-color" /></label></div><label class="muscle-picker">Find a muscle<select id="map-muscle-select"><option value="">Choose a region…</option></select></label></div><div id="configuration-code"></div>` : ''}
  </section>`;
}

function renderOverview(): string {
  return `<div class="overview-hero"><div class="hero-copy"><p class="page-category">JavaScript anatomy library</p><h1>Interactive<br>muscle maps.</h1><p class="hero-description">Anatomy that belongs in your application. Male and female SVG figures, precise selection, and colors you control.</p><div class="hero-actions"><a class="button-primary" href="/docs/installation">Get started ${arrow}</a><a class="text-link" href="/showcase">Open showcase ${arrow}</a></div><div class="install-command"><code>npm install muscle-graph</code><button type="button" class="copy-command" data-copy="npm install muscle-graph" aria-label="Copy install command">${copyIcon}</button></div><p class="package-details">TypeScript <span>·</span> MIT licensed <span>·</span> Framework-agnostic</p></div><div class="hero-anatomy">${showcaseMarkup()}</div></div>
    <section class="overview-section" id="quick-start"><div class="section-intro"><p class="page-category">From data to anatomy</p><h2>A few lines to<br>your first map.</h2><p>Pass a workout, choose your colors, and connect the selection to your UI. The same API works across frameworks.</p><a class="text-link" href="/docs/quick-start">Read the quick start ${arrow}</a></div>${codeBlock(quickStart)}</section>
    <section class="overview-guides" id="guides"><div><p class="page-category">Read the documentation</p><h2>Find your way in.</h2></div><div class="guide-links">${[
      ['/docs/data', 'Bring your workout data', 'Understand frequencies, broad groups, and detailed muscle IDs.'],
      ['/docs/theming', 'Match your application', 'Set the silhouette, muscle colors, outlines, and focus states.'],
      ['/docs/frameworks/angular', 'Use your framework', 'Connect mounting, reactive updates, and cleanup.'],
      ['/docs/api', 'Look up the API', 'Every option, method, and exported type in one place.'],
    ].map(([path, title, description]) => `<a href="${path}"><div><h3>${title}</h3><p>${description}</p></div>${arrow}</a>`).join('')}</div></section>`;
}

export function renderPage(page: Page): string {
  if (page.path === '/') return renderOverview();
  if (page.path === '/showcase') return `<header class="page-header"><p class="page-category">Live showcase</p><h1>Meet the anatomy.</h1><p>${page.description}</p></header>${showcaseMarkup(true)}`;
  const pageIndex = pages.findIndex(candidate => candidate.path === page.path);
  const previous = pages[pageIndex - 1];
  const next = pages[pageIndex + 1];
  return `<div class="docs-layout"><article class="prose"><header class="page-header"><p class="page-category">${escapeHtml(page.group)}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p></header>${page.sections.map(section => `<section id="${section.id}" class="doc-section"><h2><a href="#${section.id}">${escapeHtml(section.title)}<span aria-hidden="true">#</span></a></h2>${section.html}</section>`).join('')}<nav class="page-pagination" aria-label="Adjacent guides">${previous ? `<a href="${previous.path}"><small>Previous</small>${escapeHtml(previous.title)}</a>` : '<span></span>'}${next ? `<a href="${next.path}"><small>Next</small>${escapeHtml(next.title)} ${arrow}</a>` : ''}</nav><p class="edit-link"><a href="https://github.com/lilbuda/muscle-graph/blob/main/website/src/content/${page.path === '/404' ? 'index' : 'pages/' + page.path.slice(1).replaceAll('/', '-')}.ts">Improve this page on GitHub ${arrow}</a></p></article><aside class="table-of-contents" aria-label="On this page"><p>On this page</p><nav aria-label="Section navigation">${page.sections.map(section => `<a href="#${section.id}">${escapeHtml(section.title)}</a>`).join('')}</nav><a class="toc-help" href="https://github.com/lilbuda/muscle-graph/issues">Found an issue? ${arrow}</a></aside></div>`;
}

export function renderFooter(): string {
  return `<span>muscle-graph</span><span>Open source. MIT licensed.</span><span>SVG artwork adapted from <a href="https://github.com/soroojshehryar/react-muscle-highlighter">react-muscle-highlighter</a>.</span><a href="https://github.com/lilbuda/muscle-graph">GitHub ${arrow}</a>`;
}
