import {
  renderToString,
  renderToStringAsync,
} from 'solid-js/web/dist/server.js';
import type {
  CompiledRenderOptions,
  CompiledRenderSyncOptions,
  CompileOptions,
  CompileSyncOptions,
} from './options';
import type { Renderable } from './render';
import {
  normalizeRenderable,
  removeSolidResourceScripts,
  renderOutput,
  renderSyncOutput,
} from './render';
import {
  buildMarkerRegex,
  replaceSlots,
  replaceSlotsSync,
  type SlotLookup,
  validateSlots,
} from './slot-replacer';
import { buildSlotLookup, type SlotValue } from './slots';
import {
  createPlainTextTemplate,
  type PlainTextTemplate,
  renderTextTemplate,
  renderTextTemplateSync,
} from './text-template';
import { toPlainText } from './utils/to-plain-text';

export type { SlotRecord, SlotValue } from './slots';

export class CompiledTemplate<
  TSlots extends Record<string, SlotValue> = Record<string, SlotValue>,
> {
  private readonly html: string;
  private readonly htmlToTextOptions?: CompileOptions['htmlToTextOptions'];
  private readonly slotLookup: SlotLookup;
  private readonly markerRegex: RegExp;
  private readonly plainTextTemplate?: PlainTextTemplate;

  constructor(html: string, options: CompileOptions = {}) {
    this.html = html;
    this.htmlToTextOptions = options.htmlToTextOptions;
    this.slotLookup = buildSlotLookup(html);
    this.markerRegex = buildMarkerRegex(this.slotLookup);

    if (options.withPlainText) {
      this.plainTextTemplate = createPlainTextTemplate({
        html,
        options: options.htmlToTextOptions,
        contentSlots: this.slotLookup.content,
        attrSlots: this.slotLookup.attr,
      });
    }
  }

  async render(data: TSlots, options?: CompiledRenderOptions): Promise<string> {
    if (options?.plainText) {
      return this.renderPlainText(data);
    }

    const result = await this.replaceHtmlSlots(data);

    return renderOutput(result, options?.pretty ? { pretty: true } : undefined);
  }

  renderSync(data: TSlots, options?: CompiledRenderSyncOptions): string {
    if (options?.pretty) {
      throw new Error('renderSync does not support pretty output; use render.');
    }

    if (options?.plainText) {
      return this.renderPlainTextSync(data);
    }

    return renderSyncOutput(this.replaceHtmlSlotsSync(data));
  }

  private async replaceHtmlSlots(data: TSlots): Promise<string> {
    return replaceSlots({
      result: this.html,
      data,
      lookup: this.slotLookup,
      markerRegex: this.markerRegex,
      validate: true,
    });
  }

  private replaceHtmlSlotsSync(data: TSlots): string {
    return replaceSlotsSync({
      result: this.html,
      data,
      lookup: this.slotLookup,
      markerRegex: this.markerRegex,
      validate: true,
    });
  }

  private async renderPlainText(data: TSlots): Promise<string> {
    if (this.plainTextTemplate?.usable) {
      validateSlots(data, this.slotLookup);
      return renderTextTemplate(
        this.plainTextTemplate.nodes,
        data,
        this.htmlToTextOptions,
      );
    }

    return toPlainText(
      await this.replaceHtmlSlots(data),
      this.htmlToTextOptions,
    );
  }

  private renderPlainTextSync(data: TSlots): string {
    if (this.plainTextTemplate?.usable) {
      validateSlots(data, this.slotLookup);
      return renderTextTemplateSync(
        this.plainTextTemplate.nodes,
        data,
        this.htmlToTextOptions,
      );
    }

    return toPlainText(this.replaceHtmlSlotsSync(data), this.htmlToTextOptions);
  }
}

export async function compile<
  TSlots extends Record<string, SlotValue> = Record<string, SlotValue>,
>(
  node: Renderable,
  options?: CompileOptions,
): Promise<CompiledTemplate<TSlots>> {
  const html = removeSolidResourceScripts(
    await renderToStringAsync(normalizeRenderable(node)),
  );
  return new CompiledTemplate<TSlots>(html, options);
}

export function compileSync<
  TSlots extends Record<string, SlotValue> = Record<string, SlotValue>,
>(node: Renderable, options?: CompileSyncOptions): CompiledTemplate<TSlots> {
  if ((options as { pretty?: boolean } | undefined)?.pretty) {
    throw new Error('compileSync does not support pretty output; use compile.');
  }
  const html = removeSolidResourceScripts(
    renderToString(normalizeRenderable(node)),
  );
  return new CompiledTemplate<TSlots>(html, options);
}
