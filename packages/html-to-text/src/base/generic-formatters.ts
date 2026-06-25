/*
 * Source licence: MIT.
 * Portions Copyright (c) 2012-2019 werk85 <malte@werk85.de>
 * Portions Copyright (c) 2020-2026 KillyMXI <killy@mxii.eu.org>
 */

import { render } from 'dom-serializer';
import type { DomNode, FormatCallback } from '../types.js';

/**
 * Dummy formatter that discards the input and does nothing.
 *
 * @type { FormatCallback }
 */
const formatSkip: FormatCallback = (_elem, _walk, _builder, _formatOptions) => {
  /* do nothing */
};

/**
 * Insert the given string literal inline instead of a tag.
 *
 * @type { FormatCallback }
 */
const formatInlineString: FormatCallback = (
  _elem,
  _walk,
  builder,
  formatOptions,
) => {
  builder.addLiteral(formatOptions.string || '');
};

/**
 * Insert a block with the given string literal instead of a tag.
 *
 * @type { FormatCallback }
 */
const formatBlockString: FormatCallback = (
  _elem,
  _walk,
  builder,
  formatOptions,
) => {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
  });
  builder.addLiteral(formatOptions.string || '');
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
  });
};

/**
 * Process an inline-level element.
 *
 * @type { FormatCallback }
 */
const formatInline: FormatCallback = (elem, walk, builder, _formatOptions) => {
  walk(elem.children, builder);
};

/**
 * Process a block-level container.
 *
 * @type { FormatCallback }
 */
const formatBlock: FormatCallback = (elem, walk, builder, formatOptions) => {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
  });
  walk(elem.children, builder);
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
  });
};

function renderOpenTag(elem: DomNode): string {
  const attrs =
    elem.attribs && (elem.attribs as { length?: number }).length
      ? ' ' +
        Object.entries(elem.attribs)
          .map(([k, v]) => (v === '' ? k : `${k}=${v.replace(/"/g, '&quot;')}`))
          .join(' ')
      : '';
  return `<${elem.name}${attrs}>`;
}

function renderCloseTag(elem: DomNode): string {
  return `</${elem.name}>`;
}

/**
 * Render an element as inline HTML tag, walk through it's children.
 *
 * @type { FormatCallback }
 */
const formatInlineTag: FormatCallback = (
  elem,
  walk,
  builder,
  _formatOptions,
) => {
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
};

/**
 * Render an element as HTML block bag, walk through it's children.
 *
 * @type { FormatCallback }
 */
const formatBlockTag: FormatCallback = (elem, walk, builder, formatOptions) => {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
  });
  builder.startNoWrap();
  builder.addLiteral(renderOpenTag(elem));
  builder.stopNoWrap();
  walk(elem.children, builder);
  builder.startNoWrap();
  builder.addLiteral(renderCloseTag(elem));
  builder.stopNoWrap();
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
  });
};

/**
 * Render an element with all it's children as inline HTML.
 *
 * @type { FormatCallback }
 */
const formatInlineHtml: FormatCallback = (
  elem,
  _walk,
  builder,
  _formatOptions,
) => {
  builder.startNoWrap();
  builder.addLiteral(
    render(elem as never, { decodeEntities: builder.options.decodeEntities }),
  );
  builder.stopNoWrap();
};

/**
 * Render an element with all it's children as HTML block.
 *
 * @type { FormatCallback }
 */
const formatBlockHtml: FormatCallback = (
  elem,
  _walk,
  builder,
  formatOptions,
) => {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
  });
  builder.startNoWrap();
  builder.addLiteral(
    render(elem as never, { decodeEntities: builder.options.decodeEntities }),
  );
  builder.stopNoWrap();
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
  });
};

/**
 * Render inline element wrapped with given strings.
 *
 * @type { FormatCallback }
 */
const formatInlineSurround: FormatCallback = (
  elem,
  walk,
  builder,
  formatOptions,
) => {
  builder.addLiteral(formatOptions.prefix || '');
  walk(elem.children, builder);
  builder.addLiteral(formatOptions.suffix || '');
};

export {
  formatBlock as block,
  formatBlockHtml as blockHtml,
  formatBlockString as blockString,
  formatBlockTag as blockTag,
  formatInline as inline,
  formatInlineHtml as inlineHtml,
  formatInlineString as inlineString,
  formatInlineSurround as inlineSurround,
  formatInlineTag as inlineTag,
  formatSkip as skip,
};
