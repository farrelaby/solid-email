/*
 * Source licence: MIT.
 * Portions Copyright (c) 2012-2019 werk85 <malte@werk85.de>
 * Portions Copyright (c) 2020-2026 KillyMXI <killy@mxii.eu.org>
 */

import type { TablePrinterCell } from './types.js';

type TableLayout = (TablePrinterCell | undefined)[][];

function getRow(
  matrix: TableLayout,
  j: number,
): (TablePrinterCell | undefined)[] {
  if (!matrix[j]) {
    matrix[j] = [];
  }
  return matrix[j] ?? [];
}

function transposeInPlace(matrix: TableLayout, maxSize: number): void {
  for (let i = 0; i < maxSize; i++) {
    const rowI = getRow(matrix, i);
    for (let j = 0; j < i; j++) {
      const rowJ = getRow(matrix, j);
      if (rowI[j] || rowJ[i]) {
        const temp = rowI[j];
        rowI[j] = rowJ[i];
        rowJ[i] = temp;
      }
    }
  }
}

function putCellIntoLayout(
  cell: TablePrinterCell,
  layout: TableLayout,
  baseRow: number,
  baseCol: number,
): void {
  for (let r = 0; r < cell.rowspan; r++) {
    const layoutRow = getRow(layout, baseRow + r);
    for (let c = 0; c < cell.colspan; c++) {
      layoutRow[baseCol + c] = cell;
    }
  }
}

function getOrInitOffset(offsets: number[], index: number): number {
  if (offsets[index] === undefined) {
    offsets[index] = index === 0 ? 0 : 1 + getOrInitOffset(offsets, index - 1);
  }
  return offsets[index] ?? 0;
}

function updateOffset(
  offsets: number[],
  base: number,
  span: number,
  value: number,
): void {
  const target = base + span;
  const offset = getOrInitOffset(offsets, base) + value;
  if (getOrInitOffset(offsets, target) < offset) {
    offsets[target] = offset;
  }
}

/**
 * Render a table into a string.
 * Cells can contain multiline text and span across multiple rows and columns.
 *
 * Modifies cells to add lines array.
 *
 * @param { TablePrinterCell[][] } tableRows Table to render.
 * @param { number } rowSpacing Number of spaces between columns.
 * @param { number } colSpacing Number of empty lines between rows.
 * @returns { string }
 */
function tableToString(
  tableRows: TablePrinterCell[][],
  rowSpacing: number,
  colSpacing: number,
): string {
  const layout: TableLayout = [];
  let colNumber = 0;
  const rowNumber = tableRows.length;
  const rowOffsets: number[] = [0];
  // Fill the layout table and row offsets row-by-row.
  for (let j = 0; j < rowNumber; j++) {
    const layoutRow = getRow(layout, j);
    const cells = tableRows[j] ?? [];
    let x = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell) {
        continue;
      }
      while (layoutRow[x]) {
        x++;
      }
      putCellIntoLayout(cell, layout, j, x);
      x += cell.colspan;
      cell.lines = cell.text.includes('\n')
        ? cell.text.split('\n')
        : [cell.text];
      const cellHeight = cell.lines.length;
      updateOffset(rowOffsets, j, cell.rowspan, cellHeight + rowSpacing);
    }
    colNumber = layoutRow.length > colNumber ? layoutRow.length : colNumber;
  }

  transposeInPlace(layout, rowNumber > colNumber ? rowNumber : colNumber);

  const outputLines: string[] = [];
  const colOffsets: number[] = [0];
  // Fill column offsets and output lines column-by-column.
  for (let x = 0; x < colNumber; x++) {
    let y = 0;
    let cell: TablePrinterCell | undefined;
    const layoutColumn = layout[x] ?? [];
    const rowsInThisColumn = Math.min(rowNumber, layoutColumn.length);
    while (y < rowsInThisColumn) {
      cell = layoutColumn[y];
      if (cell) {
        if (!cell.rendered) {
          let cellWidth = 0;
          const cellLines = cell.lines ?? [];
          for (let j = 0; j < cellLines.length; j++) {
            const line = cellLines[j] ?? '';
            const lineOffset = (rowOffsets[y] ?? 0) + j;
            const outputLine = outputLines[lineOffset] || '';
            const colOffset = colOffsets[x] ?? 0;
            outputLines[lineOffset] =
              (outputLine.length < colOffset
                ? outputLine.padEnd(colOffset)
                : outputLine) + line;
            cellWidth = line.length > cellWidth ? line.length : cellWidth;
          }
          updateOffset(colOffsets, x, cell.colspan, cellWidth + colSpacing);
          cell.rendered = true;
        }
        y += cell.rowspan;
      } else {
        const lineOffset = rowOffsets[y] ?? 0;
        outputLines[lineOffset] = outputLines[lineOffset] || '';
        y++;
      }
    }
  }

  return outputLines.join('\n');
}

export { tableToString };
