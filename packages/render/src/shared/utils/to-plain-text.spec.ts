import { describe, expect, it } from 'vitest';
import { toPlainText } from './to-plain-text';

describe('toPlainText', () => {
  describe('default selectors', () => {
    it('formats links without bracketed hrefs', () => {
      const text = toPlainText(
        '<p>Read more</p><a href="https://example.com">Example</a>',
      );

      expect(text).toContain('Example');
      expect(text).toContain('https://example.com');
      expect(text).not.toContain('[https://example.com]');
    });

    it('does not repeat a link href when it matches the link text', () => {
      const text = toPlainText(
        '<a href="https://example.com">https://example.com</a>',
      );

      expect(text.match(/https:\/\/example\.com/g)).toHaveLength(1);
    });
  });

  describe('custom selectors', () => {
    it('preserves image skipping when custom selectors are provided', () => {
      const text = toPlainText(
        '<p>Hello</p><img src="test.jpg" alt="Test Image"><p>World</p>',
        {
          selectors: [
            {
              selector: 'p',
              options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
            },
          ],
        },
      );

      expect(text).toContain('Hello');
      expect(text).toContain('World');
      expect(text).not.toContain('Test Image');
      expect(text).not.toContain('test.jpg');
    });

    it('preserves data-skip-in-text skipping when custom selectors are provided', () => {
      const text = toPlainText(
        '<p>Visible</p><span data-skip-in-text="true">Hidden</span>',
        {
          selectors: [
            {
              selector: 'p',
              options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
            },
          ],
        },
      );

      expect(text).toContain('Visible');
      expect(text).not.toContain('Hidden');
    });

    it('preserves link formatting when custom selectors are provided', () => {
      const text = toPlainText(
        '<p>Text</p><a href="https://example.com">Example</a>',
        {
          selectors: [
            {
              selector: 'p',
              options: { leadingLineBreaks: 1, trailingLineBreaks: 1 },
            },
          ],
        },
      );

      expect(text).toContain('Example');
      expect(text).toContain('https://example.com');
      expect(text).not.toContain('[https://example.com]');
    });

    it('applies custom selectors in addition to defaults', () => {
      const text = toPlainText(
        '<p>Normal</p><em>Emphasized text</em><div class="custom">Custom div</div>',
        {
          selectors: [
            { selector: 'em', format: 'skip' },
            { selector: 'div.custom', format: 'skip' },
          ],
        },
      );

      expect(text).toContain('Normal');
      expect(text).not.toContain('Emphasized text');
      expect(text).not.toContain('Custom div');
    });
  });
});
