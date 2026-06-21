<table align="center">
  <tr>
    <td valign="middle">
      <img src="assets/solid-email-logo.png" alt="Solid Email logo" width="128" />
    </td>
    <td valign="middle">
      <h1>Solid Email</h1>
    </td>
  </tr>
</table>

<div align="center">
  Build beautiful, reliable HTML emails with SolidJS.
  <br />
  High-quality, unstyled components for modern email templates.
</div>

## Introduction

Solid Email is a collection of email components for SolidJS and TypeScript.
It helps you write responsive templates with familiar JSX while handling the markup patterns email clients expect.

Inspired by [React Email](https://react.email), designed for SolidJS.

## Why

Email HTML is still full of client-specific behavior, table layouts, inline styles, and rendering quirks.
Solid Email keeps the authoring experience close to a modern Solid app while producing HTML that can be sent by any email provider.

## Benchmarks

Measured with `pnpm benchmark:rendering` on the repository marketing email fixture. Lower mean time is better.

| Renderer | Template | Mean | Throughput | Comparison |
| --- | --- | ---: | ---: | --- |
| Solid Email `render()` | Static JSX | 3.8375ms | 260.58 hz | 4.53x faster than React Email `render()` |
| Solid Email `renderSync()` | Static JSX | 4.6953ms | 212.98 hz | 3.70x faster than React Email `render()` |
| Solid Email `render()` | Tailwind JSX | 11.6995ms | 85.47 hz | 3.07x faster than React Email Tailwind |
| Solid Email `compileSync` render (cached) | Static JSX | 0.0107ms | 93,571 hz | 1,626x faster than React Email `render()` |
| Solid Email `compile` render (cached) | Static JSX | 0.0816ms | 12,248 hz | 213x faster than React Email `render()` |
| Solid Email `compile` render (cached) | Tailwind JSX | 0.0574ms | 17,429 hz | 303x faster than React Email Tailwind |
| React Email `render()` | Static JSX | 17.3786ms | 57.54 hz | Baseline |
| React Email `render()` | Tailwind JSX | 35.7052ms | 28.00 hz | Tailwind baseline |

**Cached** means the template is compiled once and only the render step is measured. This is the expected production usage — compile at module load, render per request. The "one-time" compile+render cost is comparable to calling `render()` directly.

Bundle size compares built ESM entry files after `pnpm build`; gzip uses Node's `zlib.gzipSync`.

| Package entry | Raw size | Gzip size | Comparison |
| --- | ---: | ---: | --- |
| `@akin01/solid-email/dist/index.mjs` | 198.5 KiB | 42.2 KiB | Components entry |
| `@solid-email/render/dist/node/index.mjs` | 4.5 KiB | 1.7 KiB | Renderer entry |
| Solid Email combined entries | 203.0 KiB | 43.7 KiB | 7.1x smaller raw / 8.0x smaller gzip than React Email |
| `react-email/dist/index.mjs` | 1,448.0 KiB | 347.4 KiB | React Email baseline |

## Install

```sh
pnpm add @akin01/solid-email @solid-email/render solid-js
```

## Getting started

Define an email template with SolidJS components.

```tsx
import { Body, Button, Container, Html, Text } from '@akin01/solid-email';

export function WelcomeEmail() {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Welcome to Solid Email.</Text>
          <Button href="https://example.com">Get started</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

Render it to HTML before sending.

```tsx
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const html = await render(() => <WelcomeEmail />);
```

For static templates that do not use async resources or pretty formatting, use the synchronous renderer.

```tsx
import { renderSync } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const html = renderSync(() => <WelcomeEmail />);
```

## Compile for repeated renders

When you render the same template multiple times with different data, `compile()` pre-evaluates the Solid components once and reuses the cached HTML on each render.

```tsx
import { compile, Slot, slot } from '@solid-email/render';
import { Html, Body, Container, Text } from '@akin01/solid-email';

function WelcomeEmail(props: { name: string; url: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>
            Hello <Slot name="name" />!
          </Text>
          <a href={slot('url')}>Visit</a>
        </Container>
      </Body>
    </Html>
  );
}

const compiled = await compile(() => <WelcomeEmail name="" url="" />);

const html = await compiled.render({ name: 'Alice', url: 'https://example.com' });
const html2 = await compiled.render({ name: 'Bob', url: 'https://other.com' });
```

Use `compileSync()` for the synchronous equivalent (rejects `pretty` output).

### Slots

Slots mark the dynamic parts of a compiled template.

| API | Use case |
| --- | --- |
| `<Slot name="..." />` | Content slot inside JSX elements. |
| `slot("...")` | Attribute slot for attribute values like `href` or `src`. |
| `defineSlots<T>()` | Strongly typed slot names for editor autocomplete. |
| `CompiledTemplate.render(data)` | Re-render the template with new slot values. |
| `CompiledTemplate.renderSync(data)` | Synchronous re-render (no `pretty`). |

#### Weak types (untyped slots)

Slot names are plain strings — quick to write but no compile-time checking.

```tsx
import { compile, Slot, slot } from '@solid-email/render';

const compiled = await compile(
  <p>
    Hello <Slot name="name" />!
  </p>
);

// Slot names are strings, typos are silent
const html = await compiled.render({ name: 'Alice' });
```

#### Strong types (defineSlots)

`defineSlots<T>()` returns typed accessor functions so typos and missing keys are caught at compile time.

```tsx
import { compile, defineSlots } from '@solid-email/render';

type MySlots = {
  name: string;
  url: string;
};

const slots = defineSlots<MySlots>();

const compiled = await compile(
  <p>
    Hello {slots.content('name')}!
    <a href={slots.attr('url')}>Visit</a>
  </p>,
);

// TypeScript errors if you miss a key or misspell a name
const html = await compiled.render({ name: 'Alice', url: 'https://example.com' });
```

Content slots support defaults via the second argument: `slots.content('name', 'Guest')`.

### Tailwind with compiled templates

Tailwind classes must be on static parent elements, not on Slot components. Slot values at runtime use inline styles or fall back to `render()`.

## Components

A set of standard components for building email layouts without hand-writing every table and client-safe style.

- [Html](packages/solid-email/src/components/html)
- [Head](packages/solid-email/src/components/head)
- [Font](packages/solid-email/src/components/font)
- [Preview](packages/solid-email/src/components/preview)
- [Body](packages/solid-email/src/components/body)
- [Container](packages/solid-email/src/components/container)
- [Section](packages/solid-email/src/components/section)
- [Row](packages/solid-email/src/components/row)
- [Column](packages/solid-email/src/components/column)
- [Heading](packages/solid-email/src/components/heading)
- [Text](packages/solid-email/src/components/text)
- [Hr](packages/solid-email/src/components/hr)
- [Img](packages/solid-email/src/components/img)
- [Link](packages/solid-email/src/components/link)
- [Button](packages/solid-email/src/components/button)
- [CodeInline](packages/solid-email/src/components/code-inline)
- [CodeBlock](packages/solid-email/src/components/code-block)
- [Markdown](packages/solid-email/src/components/markdown)
- [Tailwind](packages/solid-email/src/components/tailwind)

## Sending email

The renderer returns ordinary HTML, so templates can be sent with any provider that accepts an HTML body.

```tsx
const html = await render(() => <WelcomeEmail />);

await emailProvider.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html,
});
```

## Support

Solid Email targets the common HTML and CSS constraints used by popular email clients.
Always preview important templates in the clients your audience uses.

| <img src="https://react.email/static/icons/gmail.svg" width="48" height="48" alt="Gmail logo" /> | <img src="https://react.email/static/icons/apple-mail.svg" width="48" height="48" alt="Apple Mail logo" /> | <img src="https://react.email/static/icons/outlook.svg" width="48" height="48" alt="Outlook logo" /> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48" height="48" alt="Yahoo Mail logo" /> | <img src="https://react.email/static/icons/hey.svg" width="48" height="48" alt="HEY logo" /> | <img src="https://react.email/static/icons/superhuman.svg" width="48" height="48" alt="Superhuman logo" /> |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Gmail ✔ | Apple Mail ✔ | Outlook ✔ | Yahoo Mail ✔ | HEY ✔ | Superhuman ✔ |

## Agent skill

Solid Email includes an agent skill for template authoring, rendering, styling, and testing guidance.

```sh
npx skills add akin01/solid-email@solid-email
```

The skill source lives in [`skills/solid-email`](skills/solid-email).

## Development

This repository uses pnpm workspaces and Biome.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm lint
```

---

<div align="center">
  Build with ❤️, MIT License.
</div>
