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

## Compile for repeated renders

When the same template is rendered multiple times with different data, `compile()` pre-evaluates the Solid components once and reuses the cached HTML on each render.

```tsx
import { compile, Slot, slot } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const compiled = await compile(() => <WelcomeEmail name="" actionUrl="" />);

const html = await compiled.render({ name: 'Alice', actionUrl: 'https://example.com/start' });
const html2 = await compiled.render({ name: 'Bob', actionUrl: 'https://other.com' });
```

Use `compileSync()` for the synchronous equivalent. It rejects `pretty` output.

Slots mark dynamic parts of a compiled template:

```tsx
import { compile, Slot, slot } from '@solid-email/render';

const compiled = await compile(
  <p>
    Hello <Slot name="name" />!
    <a href={slot('url')}>Visit</a>
  </p>,
);

const html = await compiled.render({ name: 'Alice', url: 'https://example.com' });
```

For typed slot names, use `defineSlots<T>()`:

```tsx
import { compile, defineSlots } from '@solid-email/render';

type MySlots = { name: string; url: string };
const slots = defineSlots<MySlots>();

const compiled = await compile(
  <p>
    {slots.content('name', 'Guest')}
    <a href={slots.attr('url')}>Visit</a>
  </p>,
);
```

Tailwind classes must be on static parent elements, not on Slot components. Slot values at runtime use inline styles or fall back to `render()`.

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
