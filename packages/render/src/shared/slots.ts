import type { JSX } from 'solid-js';
import { ssr } from 'solid-js/web';

const MARKER_PREFIX = '__SM_';
const CONTENT_START = `${MARKER_PREFIX}CNT_`;
const CONTENT_END = `${MARKER_PREFIX}CNE_`;
const ATTR_PREFIX = `${MARKER_PREFIX}ATR_`;

export type SlotPrimitive = string | number | boolean | null | undefined;
export type SlotValue = SlotPrimitive | JSX.Element | SlotValue[];
export type SlotRecord = Record<string, SlotValue>;

function encodeName(name: string): string {
  return encodeURIComponent(name);
}

export function decodeName(encoded: string): string {
  return decodeURIComponent(encoded);
}

export function makeContentMarker(name: string, defaultValue?: string): string {
  const encoded = encodeName(name);
  const start = `${CONTENT_START}${encoded}__`;
  if (defaultValue !== undefined) {
    return `${start}${defaultValue}${CONTENT_END}${encoded}__`;
  }
  return `${start}${CONTENT_END}${encoded}__`;
}

export function makeAttrMarker(name: string): string {
  return `${ATTR_PREFIX}${encodeName(name)}__`;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface SlotOccurrence {
  full: string;
  hasDefault: boolean;
  defaultValue: string;
}

export function buildSlotLookup(html: string): {
  content: Map<string, SlotOccurrence[]>;
  attr: Map<string, string[]>;
} {
  const contentSlots = new Map<string, SlotOccurrence[]>();
  const attrSlots = new Map<string, string[]>();

  const nameChars = '[A-Za-z0-9._~%-]+';

  const contentRegex = new RegExp(
    `${escapeRegex(CONTENT_START)}(${nameChars})__([\\s\\S]*?)${escapeRegex(CONTENT_END)}\\1__`,
    'g',
  );
  let match: RegExpExecArray | null;
  while (true) {
    match = contentRegex.exec(html);
    if (match === null) break;
    const name = decodeName(match[1] ?? '');
    const innerContent = match[2] ?? '';
    const existing = contentSlots.get(name);
    if (existing) {
      existing.push({
        full: match[0],
        hasDefault: innerContent.length > 0,
        defaultValue: innerContent,
      });
    } else {
      contentSlots.set(name, [
        {
          full: match[0],
          hasDefault: innerContent.length > 0,
          defaultValue: innerContent,
        },
      ]);
    }
  }

  const attrRegex = new RegExp(
    `${escapeRegex(ATTR_PREFIX)}(${nameChars})__`,
    'g',
  );
  while (true) {
    match = attrRegex.exec(html);
    if (match === null) break;
    const name = decodeName(match[1] ?? '');
    const existing = attrSlots.get(name);
    if (existing) {
      existing.push(match[0]);
    } else {
      attrSlots.set(name, [match[0]]);
    }
  }

  return { content: contentSlots, attr: attrSlots };
}

export function Slot(props: {
  name: string;
  children?: JSX.Element;
}): JSX.Element {
  const encoded = encodeName(props.name);
  const start = ssr(`${CONTENT_START}${encoded}__`) as unknown as JSX.Element;
  const end = ssr(`${CONTENT_END}${encoded}__`) as unknown as JSX.Element;
  if (props.children !== undefined && props.children !== null) {
    return [start, props.children, end] as unknown as JSX.Element;
  }
  return [start, end] as unknown as JSX.Element;
}

export function slot(name: string): string {
  return makeAttrMarker(name);
}

export interface SlotDefinition<T extends SlotRecord> {
  content: <K extends keyof T & string>(
    name: K,
    defaultValue?: string,
  ) => string;
  attr: <K extends keyof T & string>(name: K) => string;
}

export function defineSlots<T extends SlotRecord>(): SlotDefinition<T> {
  return {
    content: (name, defaultValue) =>
      makeContentMarker(name as string, defaultValue),
    attr: (name) => makeAttrMarker(name as string),
  };
}
