import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  deps: {
    neverBundle: [
      '@selderee/plugin-htmlparser2',
      'deepmerge-ts',
      'dom-serializer',
      'htmlparser2',
      'selderee',
    ],
  },
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  outDir: './dist',
});
