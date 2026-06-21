import { renderSync as renderSolidEmailSync } from '@akin01/solid-email';
import { afterAll, bench, describe } from 'vitest';
import { createSolidMarketingEmail } from '../rendering/solid-email-template';
import {
  assertIncludes,
  iterationBenchmarkOptions,
  logBenchmarkSettings,
  logFixtureBytes,
} from '../utils';
import { previewItems, selectedPreview } from './preview-data';
import { SolidPreviewUi } from './solid-preview-ui';

const options = iterationBenchmarkOptions(1);
const useCase = process.env.UI_BENCH_USECASE;
const runHot = useCase === undefined || useCase === 'hot';
const runCold = useCase === undefined || useCase === 'cold';

if (!runHot && !runCold) {
  throw new Error('Expected UI_BENCH_USECASE to be unset, "hot", or "cold"');
}

let hotPreviewProps:
  | {
      emailHtml: string;
      items: typeof previewItems;
      runtime: string;
      selected: typeof selectedPreview;
    }
  | undefined;
let hotPreviewHtml = '';
let coldPreviewHtml = '';

if (runHot) {
  const hotEmailHtml = renderSolidEmailSync(createSolidMarketingEmail);
  const previewProps = {
    emailHtml: hotEmailHtml,
    items: previewItems,
    runtime: 'solid-email',
    selected: selectedPreview,
  };
  hotPreviewProps = previewProps;
  hotPreviewHtml = renderSolidEmailSync(() => (
    <SolidPreviewUi {...previewProps} />
  ));
  assertIncludes('solid-email hot preview UI', hotPreviewHtml, [
    'Solid Email Preview',
    'Email previews',
    'Rendered email preview',
    'Release note 12',
  ]);
}

if (runCold) {
  const coldEmailHtml = renderSolidEmailSync(createSolidMarketingEmail);
  coldPreviewHtml = renderSolidEmailSync(() => (
    <SolidPreviewUi
      emailHtml={coldEmailHtml}
      items={previewItems}
      runtime="solid-email"
      selected={selectedPreview}
    />
  ));
  assertIncludes('solid-email cold preview UI', coldPreviewHtml, [
    'Solid Email Preview',
    'Email previews',
    'Rendered email preview',
    'Release note 12',
  ]);
}

logFixtureBytes({
  ...(runHot
    ? { 'solid-hot-preview-ui': Buffer.byteLength(hotPreviewHtml) }
    : {}),
  ...(runCold
    ? { 'solid-cold-preview-ui': Buffer.byteLength(coldPreviewHtml) }
    : {}),
});
logBenchmarkSettings(options);

let renderedBytes = 0;

describe('solid-email preview UI use cases', () => {
  if (runHot) {
    const previewProps = hotPreviewProps;
    if (!previewProps) {
      throw new Error('Hot preview props were not initialized');
    }
    bench(
      'hot email previews',
      () => {
        const html = renderSolidEmailSync(() => (
          <SolidPreviewUi {...previewProps} />
        ));
        renderedBytes += html.length;
      },
      options,
    );
  }

  if (runCold) {
    bench(
      'cold email previews',
      () => {
        const emailHtml = renderSolidEmailSync(createSolidMarketingEmail);
        const html = renderSolidEmailSync(() => (
          <SolidPreviewUi
            emailHtml={emailHtml}
            items={previewItems}
            runtime="solid-email"
            selected={selectedPreview}
          />
        ));
        renderedBytes += html.length;
      },
      options,
    );
  }
});

afterAll(() => {
  if (renderedBytes === 0) {
    throw new Error('Benchmark did not render any output');
  }
});
