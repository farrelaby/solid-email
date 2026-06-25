# @solid-email/html-to-text

HTML-to-plain-text converter used by Solid Email rendering.

## Install

```sh
pnpm add @solid-email/html-to-text
```

Most Solid Email users should call `render(..., { plainText: true })` from `@solid-email/render`. Use this package directly when converting raw HTML strings or batch-processing HTML outside the renderer.

## Convert HTML

```ts
import { convert } from '@solid-email/html-to-text';

const text = convert('<p>Hello <strong>Alice</strong></p>', {
  wordwrap: false,
});
```

## Compile converter options

Compile options once when converting many HTML strings with the same settings.

```ts
import { compile } from '@solid-email/html-to-text';

const toText = compile({
  wordwrap: false,
  selectors: [{ selector: 'img', format: 'skip' }],
});

const text = toText('<p>Hello <strong>Alice</strong></p>');
```

See the repository README for Solid JSX plain-text rendering examples and benchmarks: https://github.com/Akin01/solid-email
