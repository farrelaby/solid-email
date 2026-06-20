# Solid Email Components

Import components from `@akin01/solid-email`.

```tsx
import { Body, Container, Html, Text } from '@akin01/solid-email';
```

## Structure components

### `Html`

Root email document wrapper. Use once per complete template.

```tsx
<Html lang="en" dir="ltr">
  {children}
</Html>
```

### `Head`

Adds metadata, fonts, styles, and title output. Include it in complete templates, especially when using `Font`, `Preview`, or residual Tailwind CSS.

```tsx
<Head />
```

### `Preview`

Inbox preview text. Place near the top of the email tree.

```tsx
<Preview>Confirm your email address</Preview>
```

`useTitleTag` defaults to `true`.

### `Body`

Main email body wrapper. Body resets margin and padding for reliable baseline rendering.

```tsx
<Body style={{ margin: '0', 'background-color': '#f6f9fc' }}>
  {children}
</Body>
```

## Layout components

### `Container`

Centered outer wrapper. Use for the main content width.

```tsx
<Container style={{ margin: '0 auto', padding: '24px' }}>
  {children}
</Container>
```

### `Section`

Table-based content section. Use to group blocks inside a container.

```tsx
<Section style={{ padding: '16px 0' }}>{children}</Section>
```

### `Row` and `Column`

Table row and table cell primitives for email-safe columns.

```tsx
<Row>
  <Column width="50%">Left</Column>
  <Column width="50%">Right</Column>
</Row>
```

Prefer these over flexbox or grid.

## Content components

### `Heading`

Renders `h1` by default. Use `as` for heading level.

```tsx
<Heading as="h2" style={{ 'font-size': '24px' }}>
  Welcome
</Heading>
```

Supports margin shortcut props such as `m`, `mx`, `my`, `mt`, `mr`, `mb`, and `ml`.

### `Text`

Paragraph text. Margin shorthand is expanded into side-specific margins before rendering.

```tsx
<Text style={{ color: '#111827', 'line-height': '24px' }}>
  Hello from Solid Email.
</Text>
```

### `Button`

Email-safe call-to-action link. Use `href`; do not use native `<button>` for emails.

```tsx
<Button
  href="https://example.com/start"
  style={{
    'background-color': '#2563eb',
    color: '#ffffff',
    padding: '12px 16px',
    'border-radius': '6px',
  }}
>
  Get started
</Button>
```

### `Link`

Email-safe anchor.

```tsx
<Link href="https://example.com">Open dashboard</Link>
```

### `Img`

Image element. Use absolute production URLs and meaningful alt text.

```tsx
<Img
  src="https://cdn.example.com/logo.png"
  alt="Company logo"
  width="120"
  height="40"
/>
```

Avoid SVG and WEBP for broad client support.

### `Hr`

Horizontal divider.

```tsx
<Hr style={{ border: 'none', 'border-top': '1px solid #e5e7eb' }} />
```

## Rich content components

### `Markdown`

Renders markdown strings with email-safe default renderers and style overrides.

```tsx
<Markdown markdownCustomStyles={{ p: { color: '#111827' } }}>
  {'# Welcome\n\nThanks for joining.'}
</Markdown>
```

Only render trusted markdown or sanitize before passing it in.

### `CodeInline`

Inline code wrapper.

```tsx
<CodeInline>pnpm install</CodeInline>
```

### `CodeBlock`

Syntax-highlighted code block using Prism languages.

```tsx
<CodeBlock language="tsx" code={'const ok = true;'} lineNumbers />
```

Useful props include:

- `code`: source code string.
- `language`: Prism language.
- `theme`: token style map.
- `lineNumbers`: show line numbers.
- `fontFamily`: apply a font family to the rendered code.

### `Font`

Adds font declarations in the head.

```tsx
<Font
  fontFamily="Inter"
  fallbackFontFamily="Arial"
  webFont={{
    url: 'https://example.com/inter.woff2',
    format: 'woff2',
  }}
/>
```

### `Tailwind`

Compiles Tailwind utility classes and inlines eligible styles.

```tsx
<Tailwind config={{ theme: { extend: { colors: { brand: '#2563eb' } } } }}>
  <Body class="bg-white">
    <Container class="mx-auto p-6">
      <Text class="text-brand">Hello</Text>
    </Container>
  </Body>
</Tailwind>
```

## Attribute and style conventions

- Prefer Solid's `class` prop.
- `className` is accepted as a compatibility alias.
- Prefer kebab-case style keys.
- Use native attributes such as `width`, `height`, `align`, `cellpadding`, and `cellspacing` when email markup requires them.
