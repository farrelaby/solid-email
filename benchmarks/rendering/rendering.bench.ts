import {
  compile as compileSolidEmail,
  compileSync as compileSolidEmailSync,
  render as renderSolidEmail,
  renderSync as renderSolidEmailSync,
} from '@akin01/solid-email';
import { render as renderReactEmail } from 'react-email';
import { afterAll, bench, describe } from 'vitest';
import { createSolidTailwindEmail } from '../tailwind/solid-tailwind-template';
import {
  assertIncludes,
  iterationBenchmarkOptions,
  logBenchmarkSettings,
  logFixtureBytes,
} from '../utils';
import { createReactMarketingEmail } from './react-email-template';
import { createReactTailwindEmail } from './react-tailwind-template';
import { createSolidMarketingEmail } from './solid-email-template';

const solidSyncHtml = renderSolidEmailSync(createSolidMarketingEmail);
const [solidAsyncHtml, solidTailwindHtml, reactHtml, reactTailwindHtml] =
  await Promise.all([
    renderSolidEmail(createSolidMarketingEmail),
    renderSolidEmail(createSolidTailwindEmail),
    renderReactEmail(createReactMarketingEmail()),
    renderReactEmail(createReactTailwindEmail()),
  ]);

const compiledSync = compileSolidEmailSync(createSolidMarketingEmail);
const compiledAsync = await compileSolidEmail(createSolidMarketingEmail);
const compiledSyncRender = compiledSync.renderSync({});
const compiledAsyncRender = await compiledAsync.render({});

const compiledTailwindAsync = await compileSolidEmail(createSolidTailwindEmail);
const compiledTailwindAsyncRender = await compiledTailwindAsync.render({});

assertIncludes('solid-email renderSync', solidSyncHtml, [
  'Launch Week',
  'Product highlights',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('solid-email render', solidAsyncHtml, [
  'Launch Week',
  'Product highlights',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('solid-email render with Tailwind', solidTailwindHtml, [
  'Launch Week',
  'Tailwind fixture coverage',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('react-email', reactHtml, [
  'Launch Week',
  'Product highlights',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('react-email render with Tailwind', reactTailwindHtml, [
  'Launch Week',
  'Tailwind fixture coverage',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('solid-email compileSync render', compiledSyncRender, [
  'Launch Week',
  'Product highlights',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes('solid-email compile render', compiledAsyncRender, [
  'Launch Week',
  'Product highlights',
  'Release note 12',
  'View the launch notes',
]);
assertIncludes(
  'solid-email compile render Tailwind',
  compiledTailwindAsyncRender,
  [
    'Launch Week',
    'Tailwind fixture coverage',
    'Release note 12',
    'View the launch notes',
  ],
);

logFixtureBytes({
  'solid-email renderSync': Buffer.byteLength(solidSyncHtml),
  'solid-email render': Buffer.byteLength(solidAsyncHtml),
  'solid-email render with Tailwind': Buffer.byteLength(solidTailwindHtml),
  'solid-email compileSync render': Buffer.byteLength(compiledSyncRender),
  'solid-email compile render': Buffer.byteLength(compiledAsyncRender),
  'solid-email compile render Tailwind': Buffer.byteLength(
    compiledTailwindAsyncRender,
  ),
  'react-email render': Buffer.byteLength(reactHtml),
  'react-email render with Tailwind': Buffer.byteLength(reactTailwindHtml),
});
const options = iterationBenchmarkOptions();
logBenchmarkSettings(options);

let renderedBytes = 0;

describe('email rendering use cases', () => {
  bench(
    'solid-email renderSync static template',
    () => {
      const html = renderSolidEmailSync(createSolidMarketingEmail);
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email render async API static template',
    async () => {
      const html = await renderSolidEmail(createSolidMarketingEmail);
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email render async API Tailwind template',
    async () => {
      const html = await renderSolidEmail(createSolidTailwindEmail);
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email compileSync render (cached)',
    () => {
      const html = compiledSync.renderSync({});
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email compile render (cached)',
    async () => {
      const html = await compiledAsync.render({});
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email compile render Tailwind (cached)',
    async () => {
      const html = await compiledTailwindAsync.render({});
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email compileSync one-time compile + render',
    () => {
      const tpl = compileSolidEmailSync(createSolidMarketingEmail);
      const html = tpl.renderSync({});
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'solid-email compile one-time compile + render',
    async () => {
      const tpl = await compileSolidEmail(createSolidMarketingEmail);
      const html = await tpl.render({});
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'react-email render',
    async () => {
      const html = await renderReactEmail(createReactMarketingEmail());
      renderedBytes += html.length;
    },
    options,
  );

  bench(
    'react-email render Tailwind template',
    async () => {
      const html = await renderReactEmail(createReactTailwindEmail());
      renderedBytes += html.length;
    },
    options,
  );
});

afterAll(() => {
  if (renderedBytes === 0) {
    throw new Error('Benchmark did not render any output');
  }
});
