import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MuscleGraph',
      formats: ['es', 'umd'],
      fileName: (format) => (format === 'es' ? 'muscle-graph.js' : 'muscle-graph.umd.cjs'),
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'named',
        banner: '/*! muscle-graph | MIT | SVG artwork adapted from react-muscle-highlighter (MIT). See LICENSE and THIRD_PARTY_NOTICES.md. */',
      },
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
