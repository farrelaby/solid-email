import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    dts: true,
    entry: ['./src/node/index.ts'],
    deps: { neverBundle: ['solid-js', 'solid-js/web'] },
    format: ['cjs', 'esm'],
    outDir: './dist/node',
  },
  {
    dts: true,
    entry: ['./src/browser/index.ts'],
    deps: { neverBundle: ['solid-js', 'solid-js/web'] },
    format: ['cjs', 'esm'],
    outDir: './dist/browser',
  },
  {
    dts: true,
    entry: ['./src/edge/index.ts'],
    deps: { neverBundle: ['solid-js', 'solid-js/web'] },
    format: ['cjs', 'esm'],
    outDir: './dist/edge',
  },
]);
