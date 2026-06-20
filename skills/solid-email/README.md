# Solid Email Agent Skill

This directory contains an Agent Skill for building HTML emails with Solid Email.

## Structure

```text
skills/
└── solid-email/
    ├── SKILL.md              # Main skill instructions
    └── references/
        ├── COMPONENTS.md     # Component reference
        ├── RENDERING.md      # HTML/plain-text rendering guide
        ├── SENDING.md        # Provider-agnostic sending guide
        ├── STYLING.md        # Email-safe styling rules
        └── TESTING.md        # Verification guidance
```

## What this skill covers

- Building email templates with SolidJS components.
- Rendering templates to HTML and plain text.
- Using Tailwind utility inlining for email clients.
- Writing email-client-safe markup and styles.
- Integrating rendering in Node, Vite, TanStack Start, worker, and edge-style runtimes.
- Keeping template code type-safe.

## Usage

Agents can load `skills/solid-email/SKILL.md` when a task involves Solid Email templates, components, rendering, or email delivery integration.
