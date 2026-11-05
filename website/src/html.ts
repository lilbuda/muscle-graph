export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
}

export const arrow = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.3"/></svg>';
export const copyIcon = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor"/><path d="M10 3H3v7" stroke="currentColor"/></svg>';

export function codeBlock(code: string, label = 'TypeScript'): string {
  const tokens = /(\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|`[^`]*`|\b(?:import|from|const|let|export|return|if|new|interface|readonly|type|undefined|null|true|false|function|class|private|void)\b|\b\d+(?:\.\d+)?\b)/g;
  let result = '';
  let offset = 0;
  for (const match of code.matchAll(tokens)) {
    result += escapeHtml(code.slice(offset, match.index));
    const token = match[0];
    const kind = token.startsWith('//') ? 'comment' : /^['"`]/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : 'keyword';
    result += `<span class="token-${kind}">${escapeHtml(token)}</span>`;
    offset = (match.index ?? 0) + token.length;
  }
  result += escapeHtml(code.slice(offset));
  return `<figure class="code-block"><figcaption><span>${escapeHtml(label)}</span><button type="button" class="copy-button" aria-label="Copy code">${copyIcon}<span>Copy</span></button></figcaption><pre tabindex="0"><code>${result}</code></pre></figure>`;
}

export function table(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="Reference table"><table><thead><tr>${headers.map(header => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
