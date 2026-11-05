import { describe, expect, it } from 'vitest';
import { transformWithOxc } from 'vite';
import { getPage, pages } from '../website/src/content/index.js';
import { codeBlock } from '../website/src/html.js';
import { renderNavigation, renderPage } from '../website/src/render.js';
import { ADVANCED_MUSCLES, MuscleType } from '../src/muscles.js';
import { getAnatomy } from '../src/advanced-geometry.js';

describe('documentation', () => {
  for (const page of pages) {
    it(`resolves the links and code examples on ${page.path}`, async () => {
      expect(getPage(page.path)).toBe(page);
      const content = document.createElement('div');
      content.innerHTML = renderNavigation(page.path) + renderPage(page);
      expect(content.querySelectorAll('h1')).toHaveLength(1);
      for (const link of content.querySelectorAll<HTMLAnchorElement>('a[href]')) {
        const url = new URL(link.getAttribute('href') ?? '', `https://docs.example${page.path}`);
        if (url.origin !== 'https://docs.example') continue;
        const target = getPage(url.pathname);
        expect(target.path, link.href).not.toBe('/404');
        if (url.hash) expect(target.sections.some(section => `#${section.id}` === url.hash)).toBe(true);
      }
      for (const block of content.querySelectorAll('.code-block')) {
        const label = block.querySelector('figcaption > span')?.textContent;
        if (label !== 'TypeScript' && label !== 'TSX') continue;
        const source = block.querySelector('code')?.textContent ?? '';
        const filename = label === 'TSX' ? 'example.tsx' : 'example.ts';
        await expect(transformWithOxc(source, filename), source).resolves.toHaveProperty('code');
      }
    });
  }

  it('escapes code examples without creating executable markup', () => {
    const source = '<script>alert("example")</script>';
    const content = document.createElement('div');
    content.innerHTML = codeBlock(source);
    expect(content.querySelector('script')).toBeNull();
    expect(content.querySelector('code')?.textContent).toBe(source);
  });

  it('documents the actual detailed muscle availability for both bodies', () => {
    const content = document.createElement('div');
    content.innerHTML = renderPage(getPage('/docs/muscles'));
    for (const bodyType of ['male', 'female'] as const) {
      for (const [column, type] of [[2, 'anterior'], [3, 'posterior']] as const) {
        const visible = new Set(getAnatomy(bodyType, type).regions.map(region => region.muscle));
        for (const row of content.querySelectorAll('#detailed tbody tr')) {
          const id = row.querySelector('code')?.textContent as MuscleType;
          expect(ADVANCED_MUSCLES).toContain(id);
          expect(row.children[column]?.textContent, `${bodyType} ${type} ${id}`).toBe(visible.has(id) ? 'Yes' : '—');
        }
      }
    }
  });
});
