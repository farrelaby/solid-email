# Sending Solid Email Output

Solid Email returns ordinary HTML and plain text. Use any provider that accepts those fields.

## Provider-agnostic shape

```tsx
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const html = await render(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
));

const text = await render(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
), {
  plainText: true,
});

await emailProvider.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html,
  text,
});
```

## Resend-style example

```tsx
import { Resend } from 'resend';
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const html = await render(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
));

await resend.emails.send({
  from: 'Acme <onboarding@example.com>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  html,
});
```

## Nodemailer-style example

```tsx
import nodemailer from 'nodemailer';
import { render } from '@solid-email/render';
import { WelcomeEmail } from './welcome-email';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const html = await render(() => (
  <WelcomeEmail name="Ainul" actionUrl="https://example.com/start" />
));

await transporter.sendMail({
  from: 'Acme <onboarding@example.com>',
  to: 'user@example.com',
  subject: 'Welcome to Acme',
  html,
});
```

## Production checklist

- Use verified sender domains.
- Use production asset URLs for images.
- Generate plain text for important transactional mail.
- Keep subject and preview text aligned.
- Avoid secrets or tokens in rendered logs.
- Test at least one real send before shipping a new template.
