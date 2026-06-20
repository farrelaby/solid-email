# Solid Email Styling

Email styling must survive clients that rewrite markup, remove selectors, or ignore modern CSS.

## Defaults

Use SolidJS style objects by default.

```tsx
<Text
  style={{
    color: '#111827',
    'font-size': '16px',
    'line-height': '24px',
  }}
>
  Hello
</Text>
```

`style` may also be a CSS string when a serialized style is easier to preserve.

```tsx
<Text style="color:#111827;font-size:16px;line-height:24px">
  Hello
</Text>
```

## Class names

Prefer Solid's `class` prop.

```tsx
<Container class="mx-auto p-6">{children}</Container>
```

Use `className` only when adapting code that already uses it.

## Layout

- Prefer `Container`, `Section`, `Row`, and `Column`.
- Avoid flexbox and grid for critical layout.
- Use table-based columns for multi-column sections.
- Use explicit widths for predictable desktop email rendering.
- Keep responsive behavior as progressive enhancement, not the only valid layout.

## Units

- Use `px` for critical spacing, widths, and typography.
- Numeric style values serialize with `px` unless the CSS property is unitless.
- Avoid relying on `rem` for email-client-critical dimensions.

## Borders

Always provide a border style when setting borders.

```tsx
<Hr style={{ border: 'none', 'border-top': '1px solid #e5e7eb' }} />
```

For one-sided borders, reset the full border first.

## Images

- Prefer PNG or JPG.
- Avoid SVG and WEBP for broad email-client support.
- Use absolute production URLs before sending.
- Include `alt` text.
- Provide `width` and `height` when known.

## Tailwind

Wrap the email with `Tailwind` when using utility classes.

```tsx
<Tailwind>
  <Body class="bg-slate-50">
    <Container class="mx-auto p-6">
      <Text class="text-base text-slate-900">Hello</Text>
    </Container>
  </Body>
</Tailwind>
```

Tailwind behavior:

- Compiles utility classes through Tailwind v4.
- Inlines eligible styles into native `style` attributes.
- Keeps residual classes for media, pseudo, or non-inlineable rules.
- Injects residual CSS into `Head`.

## Avoid

- JavaScript in templates.
- Complex selectors for critical rendering.
- CSS animations or interactive CSS as required behavior.
- Dark-mode-only text or image variants.
- Client-specific hacks without a test or rendered snapshot.
