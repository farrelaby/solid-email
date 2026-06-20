import {
  convert,
  type HtmlToTextOptions,
  type SelectorDefinition,
} from 'html-to-text';

// Text-export note: images and
// preview-only nodes are skipped, and links render without duplicated hrefs.
export const plainTextSelectors: SelectorDefinition[] = [
  { selector: 'img', format: 'skip' },
  { selector: '[data-skip-in-text=true]', format: 'skip' },
  {
    selector: 'a',
    options: { linkBrackets: false, hideLinkHrefIfSameAsText: true },
  },
];

export function toPlainText(html: string, options?: HtmlToTextOptions) {
  return convert(html, {
    wordwrap: false,
    ...options,
    selectors: [...plainTextSelectors, ...(options?.selectors ?? [])],
  });
}
