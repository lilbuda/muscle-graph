import type { DocSection } from './types.js';

export const section = (id: string, title: string, html: string): DocSection => ({ id, title, html });
export const note = (html: string): string => `<aside class="note">${html}</aside>`;
