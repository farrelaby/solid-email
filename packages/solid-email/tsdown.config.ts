import { defineConfig, type UserConfig } from 'tsdown';
import solid from 'vite-plugin-solid';

const base: Pick<UserConfig, 'deps' | 'dts' | 'fixedExtension' | 'format'> = {
  dts: true,
  deps: {
    neverBundle: [
      'solid-js',
      'solid-js/web',
      'solid-js/web/dist/server.js',
      '@solid-email/render',
    ],
  },
  format: ['cjs', 'esm'],
  fixedExtension: true,
};

export default defineConfig([
  {
    ...base,
    // Package root stays SSR/email-rendering oriented so render(), compile(),
    // and every email component are safe under browser-like import conditions.
    entry: ['./src/index.ts'],
    outDir: './dist',
    plugins: [
      solid({
        solid: {
          generate: 'ssr',
          hydratable: false,
          moduleName: 'solid-js/web/dist/server.js',
        },
      }),
    ],
  },
  {
    ...base,
    // Explicit ./client subpath is a DOM/CSR build for previews. It excludes
    // render/compile and server-only components instead of using browser
    // conditions, because browser users may still render email HTML strings.
    entry: ['./src/client/index.ts'],
    outDir: './dist/client',
    platform: 'browser',
    plugins: [
      solid({
        solid: {
          generate: 'dom',
          hydratable: false,
        },
      }),
    ],
  },
]);
