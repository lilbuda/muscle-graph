import { build } from 'vite';

await build({ configFile: 'website/vite.config.ts' });
await build({
  configFile: false,
  build: {
    ssr: 'website/prerender.mjs',
    outDir: '.npm-cache/website',
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'prerender.mjs' } },
  },
});
await import('../.npm-cache/website/prerender.mjs');
