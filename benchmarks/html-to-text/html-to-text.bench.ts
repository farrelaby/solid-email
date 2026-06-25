import {
  type HtmlToTextOptions as SolidHtmlToTextOptions,
  convert as solidHtmlToTextConvert,
} from '@solid-email/html-to-text';
import {
  compileSync,
  plainTextSelectors,
  renderSync as solidEmailRenderSync,
  toPlainText as solidEmailToPlainText,
} from '@solid-email/render';
import {
  type HtmlToTextOptions as ReactHtmlToTextOptions,
  convert as reactHtmlToTextConvert,
} from 'html-to-text';
import {
  render as reactEmailRender,
  toPlainText as reactEmailToPlainText,
} from 'react-email';
import { afterAll, bench, describe } from 'vitest';
import {
  assertIncludes,
  iterationBenchmarkOptions,
  logBenchmarkSettings,
  logFixtureBytes,
} from '../utils';
import {
  createReactTextEmail,
  reactTextRenderData,
} from './react-text-template';
import {
  type CompiledTextSlots,
  compiledTextRenderData,
  compiledTextTemplateProps,
  createCompiledTextEmail,
} from './solid-compiled-template';

type HtmlToTextBenchmarkOptions = SolidHtmlToTextOptions &
  ReactHtmlToTextOptions;

type Fixture = {
  readonly name: string;
  readonly html: string;
  readonly options?: HtmlToTextBenchmarkOptions;
  readonly mustContain: readonly string[];
  readonly mustNotContain: readonly string[];
};

type TextEngineName =
  | '@solid-email/render'
  | 'react-email'
  | '@solid-email/html-to-text'
  | 'html-to-text';

type TextEngine = {
  readonly name: TextEngineName;
  readonly operation: 'toPlainText' | 'convert';
  readonly convert: (
    html: string,
    options?: HtmlToTextBenchmarkOptions,
  ) => string;
};

type TextRenderEngineName =
  | '@solid-email/render compiled text template'
  | '@solid-email/render uncompiled renderSync plainText'
  | 'react-email render plainText';

type TextRenderEngine = {
  readonly name: TextRenderEngineName;
  readonly render: () => string | Promise<string>;
};

const campaignRows = Array.from({ length: 24 }, (_, index) => {
  const offer = index + 1;
  return `
    <tr>
      <td class="eyebrow">Offer ${offer}</td>
      <td>
        <h3>Launch bundle ${offer}</h3>
        <p>Save ${10 + (offer % 5) * 5}% on team seats, onboarding, and migration support.</p>
        <a href="https://example.com/offers/${offer}">View offer ${offer}</a>
      </td>
    </tr>`;
}).join('');

const digestItems = Array.from({ length: 18 }, (_, index) => {
  const item = index + 1;
  return `
    <li>
      <strong>Incident ${item}</strong>
      <span>Resolved after ${item * 3} minutes.</span>
      <a href="https://status.example.com/incidents/${item}">https://status.example.com/incidents/${item}</a>
    </li>`;
}).join('');

const fixtures = [
  {
    name: 'marketing-table-email',
    html: `
      <!doctype html>
      <html>
        <body>
          <span data-skip-in-text="true">Preview-only promotion text</span>
          <table role="presentation">
            <tbody>
              <tr>
                <td>
                  <h1>Account security summary</h1>
                  <p>Hello Pat, your weekly security digest is ready.</p>
                  <img src="https://example.com/pixel.gif" alt="Tracking pixel">
                </td>
              </tr>
              ${campaignRows}
            </tbody>
          </table>
          <p><a href="https://example.com/preferences">Manage preferences</a></p>
        </body>
      </html>`,
    mustContain: [
      'Account security summary',
      'Launch bundle 24',
      'Manage preferences https://example.com/preferences',
    ],
    mustNotContain: ['Preview-only promotion text', 'Tracking pixel'],
  },
  {
    name: 'status-digest-list',
    html: `
      <main>
        <h2>Daily status digest</h2>
        <p>All production regions recovered before the reporting window closed.</p>
        <ol>${digestItems}</ol>
        <p>Full status archive: <a href="https://status.example.com">https://status.example.com</a></p>
      </main>`,
    mustContain: [
      'Daily status digest',
      'Incident 18',
      'https://status.example.com/incidents/18',
      'Full status archive: https://status.example.com',
    ],
    mustNotContain: ['[https://status.example.com]'],
  },
  {
    name: 'transactional-receipt',
    html: `
      <article>
        <h1>Receipt #SO-2048</h1>
        <p>Thanks for your order, Mina.</p>
        <table class="line-items">
          <thead><tr><th>Item</th><th>Quantity</th><th>Total</th></tr></thead>
          <tbody>
            <tr><td>Team plan</td><td>12</td><td>$1,200.00</td></tr>
            <tr><td>Migration support</td><td>1</td><td>$450.00</td></tr>
            <tr><td>Compliance export</td><td>1</td><td>$125.00</td></tr>
          </tbody>
        </table>
        <blockquote>Keep this receipt for your records.</blockquote>
        <pre>invoice_id=SO-2048\nregion=us-east-1</pre>
      </article>`,
    options: {
      selectors: [{ selector: 'table.line-items', format: 'dataTable' }],
    },
    mustContain: [
      'Receipt #SO-2048',
      'Migration support',
      'invoice_id=SO-2048',
    ],
    mustNotContain: ['undefined'],
  },
  {
    name: 'custom-selector-email',
    html: `
      <section>
        <p>Visible intro</p>
        <em>Skipped emphasis</em>
        <footer class="legal">Verbose legal footer</footer>
        <a href="https://example.com/custom">Custom CTA</a>
      </section>`,
    options: {
      selectors: [
        { selector: 'em', format: 'skip' },
        { selector: 'footer.legal', format: 'skip' },
      ],
    },
    mustContain: ['Visible intro', 'Custom CTA https://example.com/custom'],
    mustNotContain: ['Skipped emphasis', 'Verbose legal footer'],
  },
] satisfies readonly Fixture[];

function withPlainTextDefaults(
  options?: HtmlToTextBenchmarkOptions,
): HtmlToTextBenchmarkOptions {
  return {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options?.selectors ?? [])],
  } as HtmlToTextBenchmarkOptions;
}

const engines = [
  {
    name: '@solid-email/render',
    operation: 'toPlainText',
    convert: (html, options) => solidEmailToPlainText(html, options),
  },
  {
    name: 'react-email',
    operation: 'toPlainText',
    convert: (html, options) => reactEmailToPlainText(html, options),
  },
  {
    name: '@solid-email/html-to-text',
    operation: 'convert',
    convert: (html, options) =>
      solidHtmlToTextConvert(html, withPlainTextDefaults(options)),
  },
  {
    name: 'html-to-text',
    operation: 'convert',
    convert: (html, options) =>
      reactHtmlToTextConvert(html, withPlainTextDefaults(options)),
  },
] satisfies readonly TextEngine[];

const compiledTextTemplate = compileSync<CompiledTextSlots>(
  () => createCompiledTextEmail(compiledTextTemplateProps),
  { withPlainText: true },
);

const textRenderEngines = [
  {
    name: '@solid-email/render compiled text template',
    render: () =>
      compiledTextTemplate.renderSync(compiledTextRenderData, {
        plainText: true,
      }),
  },
  {
    name: '@solid-email/render uncompiled renderSync plainText',
    render: () =>
      solidEmailRenderSync(
        () => createCompiledTextEmail(compiledTextRenderData),
        {
          plainText: true,
        },
      ),
  },
  {
    name: 'react-email render plainText',
    render: () =>
      reactEmailRender(createReactTextEmail(reactTextRenderData), {
        plainText: true,
      }),
  },
] satisfies readonly TextRenderEngine[];

function convertFixtures(engine: TextEngine): number {
  let outputBytes = 0;

  for (const fixture of fixtures) {
    const text = engine.convert(fixture.html, fixture.options);
    outputBytes += Buffer.byteLength(text);
  }

  return outputBytes;
}

function verifyFixture(engine: TextEngine, fixture: Fixture): string {
  const text = engine.convert(fixture.html, fixture.options);

  assertIncludes(
    `${engine.name}/${fixture.name}`,
    text.toLowerCase(),
    fixture.mustContain.map((expected) => expected.toLowerCase()),
  );

  const normalizedText = text.toLowerCase();
  for (const forbidden of fixture.mustNotContain) {
    if (normalizedText.includes(forbidden.toLowerCase())) {
      throw new Error(
        `${engine.name}/${fixture.name} output unexpectedly includes ${forbidden}\n${text}`,
      );
    }
  }

  return text;
}

async function verifyTextRender(engine: TextRenderEngine): Promise<string> {
  const text = await engine.render();
  assertIncludes(engine.name, text.toLowerCase(), [
    'account security summary',
    'hello pat',
    'keep this digest',
    'handy',
    'open digest security@example.com',
    'release note 18',
    'plan seat 12',
    'owner checklist',
    'rotate webhook secret',
    'unsubscribe https://example.com/unsubscribe',
    '__sm_cnt_runtime____sm_cne_runtime__',
  ]);

  const forbidden = [
    'preview-only alert',
    'mailto:security@example.com',
    'tracking pixel',
  ];
  for (const value of forbidden) {
    if (text.toLowerCase().includes(value)) {
      throw new Error(`${engine.name} output unexpectedly includes ${value}`);
    }
  }

  return text;
}

const verifiedOutputBytes: Record<string, number> = {};
for (const engine of engines) {
  for (const fixture of fixtures) {
    verifiedOutputBytes[`${engine.name} ${fixture.name}`] = Buffer.byteLength(
      verifyFixture(engine, fixture),
    );
  }
}
for (const engine of textRenderEngines) {
  verifiedOutputBytes[engine.name] = Buffer.byteLength(
    await verifyTextRender(engine),
  );
}

logFixtureBytes({
  'input per pass': fixtures.reduce(
    (total, fixture) => total + Buffer.byteLength(fixture.html),
    0,
  ),
  ...verifiedOutputBytes,
});

const options = iterationBenchmarkOptions();
logBenchmarkSettings(options);

let convertedBytes = 0;

describe('html to text conversion', () => {
  for (const engine of engines) {
    bench(
      `${engine.name} ${engine.operation}`,
      () => {
        convertedBytes += convertFixtures(engine);
      },
      options,
    );
  }
});

let renderedTextBytes = 0;

function convertRenderedText(engine: TextRenderEngine): void | Promise<void> {
  const text = engine.render();
  if (typeof text === 'string') {
    renderedTextBytes += Buffer.byteLength(text);
    return;
  }

  return text.then((result) => {
    renderedTextBytes += Buffer.byteLength(result);
  });
}

describe('email plain text rendering', () => {
  for (const engine of textRenderEngines) {
    bench(engine.name, () => convertRenderedText(engine), options);
  }
});

afterAll(() => {
  if (convertedBytes === 0 || renderedTextBytes === 0) {
    throw new Error('Benchmark did not convert any output');
  }
});
