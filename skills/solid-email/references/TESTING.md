# Solid Email Testing

Test rendered behavior, not component plumbing.

## Unit tests

Use Vitest to render templates and assert the resulting HTML.

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

describe('WelcomeEmail', () => {
  it('renders the call to action', async () => {
    const html = await render(() => (
      <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
    ));

    expect(html).toContain('Hello Ainul');
    expect(html).toContain('href="https://example.com/start"');
  });
});
```

## Snapshot tests

Inline snapshots are useful for stable component output, but avoid snapshots so large that behavior changes are hidden.

Prefer targeted assertions for:

- Important attributes.
- Inline styles that protect email-client behavior.
- Preview text.
- Plain-text output.
- Conditional comments and MSO-specific output.

## Plain text tests

```tsx
const text = await render(() => <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />, {
  plainText: true,
});

expect(text).toContain('Hello Ainul');
expect(text).not.toContain('<p');
```

## Type safety

Do not add `@ts-nocheck`, `@ts-ignore`, broad `any`, or fake fallback types. Fix the types at the boundary.

Recommended checks:

```sh
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm lint
```

## Integration tests

For package integration, verify:

- Packed packages install in a fixture.
- Framework builds pass.
- SSR output contains expected component HTML.
- Conditional exports resolve in supported runtime conditions.
- Declaration output emits for fixture code.

A browser is only required if the project explicitly supports rendering templates inside client/browser pages.
