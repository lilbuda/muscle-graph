import './styles.css';
import { getPage, pages } from './content/index.js';
import { arrow, escapeHtml } from './html.js';
import { renderFooter, renderNavigation, renderPage } from './render.js';
import type { ShowcaseController } from './showcase.js';

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing website element #${id}`);
  return found as T;
}

const main = element('main');
const navigation = element('docs-navigation');
const sidebar = element('sidebar');
const backdrop = element<HTMLButtonElement>('nav-backdrop');
const menu = element<HTMLButtonElement>('menu-toggle');
const themeToggle = element<HTMLButtonElement>('theme-toggle');
const search = element<HTMLDialogElement>('search-dialog');
const searchInput = element<HTMLInputElement>('search-input');
const searchResults = element('search-results');
const copyStatus = element('copy-status');
let showcase: ShowcaseController | undefined;
let renderSequence = 0;
let tocObserver: IntersectionObserver | undefined;
let copyTimeout: ReturnType<typeof setTimeout> | undefined;

const searchIndex = pages.flatMap(page => [
  { title: page.title, description: page.description, href: page.path, group: page.group },
  ...page.sections.map(section => ({ title: section.title, description: section.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '), href: `${page.path}#${section.id}`, group: page.title })),
]);

function closeNavigation(restoreFocus = false): void {
  const wasOpen = sidebar.classList.contains('open');
  sidebar.classList.remove('open');
  backdrop.hidden = true;
  menu.setAttribute('aria-expanded', 'false');
  if (restoreFocus && wasOpen) menu.focus();
}

function updateThemeButton(): void {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeToggle.innerHTML = dark
    ? '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.3"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.6 3.6 5 5m10 10 1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4" stroke="currentColor" stroke-width="1.3"/></svg>'
    : '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.6 12.7A7.2 7.2 0 0 1 7.3 3.4a7.2 7.2 0 1 0 9.3 9.3Z" stroke="currentColor" stroke-width="1.3"/></svg>';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#171b17' : '#f7f7f2');
}

function refreshSearch(): void {
  const query = searchInput.value.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const results = searchIndex.map(entry => ({ ...entry, score: terms.reduce((score, term) => score + (entry.title.toLowerCase().includes(term) ? 5 : entry.description.toLowerCase().includes(term) ? 1 : 0), 0) }))
    .filter(entry => !query || terms.every(term => `${entry.title} ${entry.description} ${entry.group}`.toLowerCase().includes(term)))
    .sort((a, b) => b.score - a.score).slice(0, 9);
  searchResults.innerHTML = results.length ? results.map(result => `<li><a href="${result.href}"><strong>${escapeHtml(result.title)}</strong><small>${escapeHtml(result.group)} ${arrow}</small></a></li>`).join('') : '<li class="search-empty">No matching pages. Try “colors”, “Angular”, or a muscle name.</li>';
}

function openSearch(): void {
  closeNavigation();
  if (search.open) return;
  search.showModal();
  refreshSearch();
  searchInput.focus();
}

async function render(focusMain = false): Promise<void> {
  const sequence = ++renderSequence;
  showcase?.destroy();
  showcase = undefined;
  tocObserver?.disconnect();
  const page = getPage(location.pathname);
  document.title = page.path === '/' ? 'muscle-graph — Interactive muscle maps' : `${page.title} — muscle-graph`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
  navigation.innerHTML = renderNavigation(page.path);
  main.innerHTML = renderPage(page);
  element('footer').innerHTML = renderFooter();
  closeNavigation();
  if (focusMain) main.focus({ preventScroll: true });
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  else if (focusMain) window.scrollTo(0, 0);
  const sections = main.querySelectorAll('.doc-section');
  tocObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of main.querySelectorAll('.table-of-contents nav a')) {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-90px 0px -65% 0px' });
  sections.forEach(section => tocObserver?.observe(section));
  const muscleFilter = main.querySelector<HTMLInputElement>('#muscle-filter');
  muscleFilter?.addEventListener('input', () => {
    let visible = 0;
    const rows = main.querySelectorAll<HTMLTableRowElement>('#detailed tbody tr');
    for (const row of rows) {
      row.hidden = !row.textContent?.toLowerCase().includes(muscleFilter.value.toLowerCase());
      if (!row.hidden) visible++;
    }
    const status = main.querySelector('#muscle-filter-status');
    if (status) status.textContent = `${visible} muscle regions`;
  });
  if (page.path === '/' || page.path === '/showcase') {
    const { mountShowcase } = await import('./showcase.js');
    if (sequence === renderSequence) showcase = mountShowcase(main);
  }
}

themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('muscle-graph-theme', theme); } catch { /* The theme still works without storage. */ }
  updateThemeButton();
  showcase?.setTheme();
});
menu.addEventListener('click', () => {
  const open = !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  backdrop.hidden = !open;
  menu.setAttribute('aria-expanded', String(open));
});
backdrop.addEventListener('click', () => closeNavigation(true));
element('open-search').addEventListener('click', openSearch);
element('close-search').addEventListener('click', () => search.close());
searchInput.addEventListener('input', refreshSearch);
search.addEventListener('keydown', event => {
  const links = [...searchResults.querySelectorAll<HTMLAnchorElement>('a')];
  const index = links.indexOf(document.activeElement as HTMLAnchorElement);
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const next = event.key === 'ArrowDown' ? Math.min(index + 1, links.length - 1) : Math.max(index - 1, 0);
    links[next]?.focus();
  }
  if (event.key === 'Enter' && event.target === searchInput) links[0]?.click();
});
document.addEventListener('keydown', event => {
  const inputFocused = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
  if (((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !inputFocused)) {
    event.preventDefault();
    openSearch();
  }
  if (event.key === 'Escape') closeNavigation(true);
});

document.addEventListener('click', async event => {
  if (!(event.target instanceof Element)) return;
  const copy = event.target.closest<HTMLButtonElement>('.copy-button, .copy-command');
  if (copy) {
    const text = copy.dataset.copy ?? copy.closest('.code-block')?.querySelector('code')?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = 'Copied to clipboard';
    } catch { copyStatus.textContent = 'Select the code to copy it.'; }
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => { copyStatus.textContent = ''; }, 2400);
    return;
  }
  const link = event.target.closest<HTMLAnchorElement>('a');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || link.hasAttribute('download') || link.target === '_blank') return;
  if (link.getAttribute('href')?.startsWith('#')) return;
  event.preventDefault();
  if (search.open) search.close();
  history.pushState(null, '', `${url.pathname}${url.hash}`);
  await render(true);
});
window.addEventListener('popstate', () => { void render(true); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  try { if (localStorage.getItem('muscle-graph-theme')) return; } catch { /* Use the system preference. */ }
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  updateThemeButton();
  showcase?.setTheme();
});
updateThemeButton();
void render();
