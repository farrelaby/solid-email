# Solid Email Rendering

Use `@solid-email/render` to convert SolidJS templates into email HTML or plain text.

## Async render

```tsx
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const html = await render(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
));
```

Use `render()` by default. It supports async Solid rendering and Suspense waiting.

## Pretty HTML

```tsx
const html = await render(() => <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />, {
  pretty: true,
});
```

Pretty formatting is async.

## Synchronous render

```tsx
import { renderSync } from '@solid-email/render';

const html = renderSync(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
));
```

Use `renderSync()` only for static templates. It does not allow `pretty: true`.

## Plain text

```tsx
const text = await render(() => <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />, {
  plainText: true,
});
```

Customize plain-text conversion with `htmlToTextOptions` when `plainText` is `true`.

```tsx
const text = await render(() => <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />, {
  plainText: true,
  htmlToTextOptions: {
    wordwrap: false,
  },
});
```

## Runtime targets

`@solid-email/render` provides conditional exports for common runtimes:

- default/node
- browser
- worker
- deno
- workerd
- edge-light
- convex

Do not import node-only modules from templates that must run in browser, worker, or edge environments.

## Server integration

Render email HTML from server-only code.

```tsx
// email.server.tsx
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

export function renderWelcomeEmail() {
  return render(() => (
    <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
  ));
}
```

For TanStack Start, call rendering from server functions or other server-only modules, not from client route bundles.
