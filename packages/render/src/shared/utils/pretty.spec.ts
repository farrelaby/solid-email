import { describe, expect, it } from 'vitest';
import { pretty } from './pretty';

describe('pretty', () => {
  it('preserves complex characters while formatting html', async () => {
    const output = await pretty(
      '<div><p>情報Ⅰコース担当者様</p><p>Emoji 😀 and entity &amp; text</p></div>',
    );

    expect(output).toContain('情報Ⅰコース担当者様');
    expect(output).toContain('Emoji 😀 and entity &amp; text');
    expect(output).toContain('\n');
  });

  it('does not wrap MSO conditional comments', async () => {
    const comment =
      '<!--[if mso]><i style="mso-font-width:100%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]-->';
    const output = await pretty(`<span>${comment}</span>`);

    expect(output).toContain(comment);
  });

  it('removes null bytes before formatting', async () => {
    const output = await pretty('<div>before\0after</div>');

    expect(output).toContain('beforeafter');
    expect(output).not.toContain('\0');
  });
});
