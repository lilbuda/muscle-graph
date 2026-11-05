import { defineConfig } from 'vite';

export default defineConfig({
  root: 'website',
  build: { outDir: '../website-dist', emptyOutDir: true },
});
