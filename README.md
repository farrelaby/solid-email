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
| Solid Email `render()` | Static JSX | 2.3973ms | 417.13 hz | 5.30x faster than React Email `render()` |
| Solid Email `renderSync()` | Static JSX | 2.9353ms | 340.68 hz | 4.33x faster than React Email `render()` |
| Solid Email `render()` | Tailwind JSX | 6.1340ms | 163.03 hz | 4.29x faster than React Email Tailwind |
| React Email `render()` | Static JSX | 12.7043ms | 78.71 hz | Baseline |
| React Email `render()` | Tailwind JSX | 26.3239ms | 37.99 hz | Tailwind baseline |

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
