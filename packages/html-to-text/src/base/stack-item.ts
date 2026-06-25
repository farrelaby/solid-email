/*
 * Source licence: MIT.
 * Portions Copyright (c) 2012-2019 werk85 <malte@werk85.de>
 * Portions Copyright (c) 2020-2026 KillyMXI <killy@mxii.eu.org>
 */

import type { CompiledHtmlToTextOptions } from '../types.js';
import { InlineTextBuilder } from './inline-text-builder.js';

type WordTransform = (str: string) => string;
type BuilderOptions = CompiledHtmlToTextOptions;

interface ListStackItemOptions {
  interRowLineBreaks?: number | undefined;
  leadingLineBreaks?: number | undefined;
  maxLineLength?: number | undefined;
  maxPrefixLength?: number | undefined;
  prefixAlign?: 'left' | 'right' | undefined;
}

interface ListItemStackItemOptions {
  leadingLineBreaks?: number | undefined;
  maxLineLength?: number | undefined;
  prefix?: string | undefined;
}

interface TablePrinterCell {
  colspan: number;
  rowspan: number;
  text: string;
}

type TablePrinterRows = TablePrinterCell[][];
type TablePrinter = (tableRows: TablePrinterRows) => string;

class StackItem {
  declare next: StackItem | null;
  declare isPre: boolean | null | undefined;
  declare isNoWrap: boolean | null | undefined;

  constructor(next: StackItem | null = null) {
    this.next = next;
  }

  getRoot(): StackItem {
    return this.next ? this.next : this;
  }
}

class BlockStackItem extends StackItem {
  declare leadingLineBreaks: number;
  declare inlineTextBuilder: InlineTextBuilder;
  declare rawText: string;
  declare stashedLineBreaks: number;

  constructor(
    options: BuilderOptions,
    next: StackItem | null = null,
    leadingLineBreaks = 1,
    maxLineLength: number | undefined = undefined,
  ) {
    super(next);
    this.leadingLineBreaks = leadingLineBreaks;
    this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
    this.rawText = '';
    this.stashedLineBreaks = 0;
    this.isPre = next?.isPre ?? false;
    this.isNoWrap = next?.isNoWrap ?? false;
  }
}

class ListStackItem extends BlockStackItem {
  declare maxPrefixLength: number;
  declare prefixAlign: 'left' | 'right';
  declare interRowLineBreaks: number;

  constructor(
    options: BuilderOptions,
    next: StackItem | null = null,
    {
      interRowLineBreaks = 1,
      leadingLineBreaks = 2,
      maxLineLength = undefined,
      maxPrefixLength = 0,
      prefixAlign = 'left',
    }: ListStackItemOptions = {},
  ) {
    super(options, next, leadingLineBreaks, maxLineLength);
    this.maxPrefixLength = maxPrefixLength;
    this.prefixAlign = prefixAlign;
    this.interRowLineBreaks = interRowLineBreaks;
  }
}

class ListItemStackItem extends BlockStackItem {
  declare next: ListStackItem | null;
  declare prefix: string;

  constructor(
    options: BuilderOptions,
    next: ListStackItem | null = null,
    {
      leadingLineBreaks = 1,
      maxLineLength = undefined,
      prefix = '',
    }: ListItemStackItemOptions = {},
  ) {
    super(options, next, leadingLineBreaks, maxLineLength);
    this.prefix = prefix;
  }
}

class TableStackItem extends StackItem {
  declare rows: TablePrinterRows;

  constructor(next: StackItem | null = null) {
    super(next);
    this.rows = [];
    this.isPre = next?.isPre ?? false;
    this.isNoWrap = next?.isNoWrap ?? false;
  }
}

class TableRowStackItem extends StackItem {
  declare next: TableStackItem | null;
  declare cells: TablePrinterCell[];

  constructor(next: TableStackItem | null = null) {
    super(next);
    this.cells = [];
    this.isPre = next?.isPre ?? false;
    this.isNoWrap = next?.isNoWrap ?? false;
  }
}

class TableCellStackItem extends StackItem {
  declare next: TableRowStackItem | null;
  declare inlineTextBuilder: InlineTextBuilder;
  declare rawText: string;
  declare stashedLineBreaks: number;
  declare leadingLineBreaks: number;

  constructor(
    options: BuilderOptions,
    next: TableRowStackItem | null = null,
    maxColumnWidth: number | undefined = undefined,
  ) {
    super(next);
    this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
    this.rawText = '';
    this.stashedLineBreaks = 0;
    this.isPre = next?.isPre ?? false;
    this.isNoWrap = next?.isNoWrap ?? false;
  }
}

class TransformerStackItem extends StackItem {
  declare next: TransformerStackItem | null;
  declare transform: WordTransform;

  constructor(
    next: TransformerStackItem | null = null,
    transform: WordTransform = undefined as unknown as WordTransform,
  ) {
    super(next);
    this.transform = transform;
  }
}

export type {
  BuilderOptions,
  ListItemStackItemOptions,
  ListStackItemOptions,
  TablePrinter,
  TablePrinterCell,
  TablePrinterRows,
  WordTransform,
};
export {
  BlockStackItem,
  ListItemStackItem,
  ListStackItem,
  StackItem,
  TableCellStackItem,
  TableRowStackItem,
  TableStackItem,
  TransformerStackItem,
};
