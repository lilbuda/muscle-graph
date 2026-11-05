import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pages, notFoundPage } from './src/content/index.ts';
import { escapeHtml } from './src/html.ts';
import { renderFooter, renderNavigation, renderPage } from './src/render.ts';

const template = await readFile('website-dist/index.html', 'utf8');
for (const marker of ['<!--nav-start--><!--nav-end-->', '<!--page-start--><!--page-end-->']) {
  if (!template.includes(marker)) throw new Error(`Missing documentation template marker ${marker}`);
}
for (const page of [...pages, notFoundPage]) {
  const title = page.path === '/' ? 'muscle-graph — Interactive muscle maps' : `${page.title} — muscle-graph`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${escapeHtml(page.description)}">`)
    .replace('<!--nav-start--><!--nav-end-->', () => `<!--nav-start-->${renderNavigation(page.path)}<!--nav-end-->`)
    .replace('<!--page-start--><!--page-end-->', () => `<!--page-start-->${renderPage(page)}<!--page-end-->`)
    .replace('<footer class="site-footer" id="footer"></footer>', () => `<footer class="site-footer" id="footer">${renderFooter()}</footer>`);
  const target = join('website-dist', page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}
console.log(`Pre-rendered ${pages.length} documentation pages and the 404 page.`);
