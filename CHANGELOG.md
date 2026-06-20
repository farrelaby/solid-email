# Changelog

All notable changes to this project will be documented in this file.

## 0.1.0 - 2026-06-20

### Added

- Added `@akin01/solid-email`, a SolidJS component package for building HTML email templates.
- Added `@solid-email/render`, a Solid SSR renderer for email HTML and plain-text output.
- Added email components: `Html`, `Head`, `Font`, `Preview`, `Body`, `Tailwind`, `Container`, `Section`, `Row`, `Column`, `Heading`, `Text`, `Hr`, `Img`, `Link`, `Button`, `CodeInline`, `CodeBlock`, and `Markdown`.
- Added async `render()` and synchronous `renderSync()` APIs.
- Added conditional render package exports for node, browser, worker, deno, workerd, edge-light, and convex-style runtimes.
- Added Tailwind v4 utility compilation and email-safe style inlining.
- Added Markdown rendering with styled headings, paragraphs, lists, links, tables, quotes, images, and code output.
- Added Prism-based code block and inline code components.
- Added CLI entrypoint through the `email` binary.
- Added Solid Vite SSR and TanStack Start Solid integration fixtures.
- Added GitHub issue templates, discussion templates, pull request template, CI workflows, and release workflow.
- Added MIT license, README, implementation docs, and Solid Email agent skill documentation.

### Changed

- Published component package name is scoped as `@akin01/solid-email`.
- Initial package version is `0.1.0` for the monorepo packages.

### Verified

- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm lint`
