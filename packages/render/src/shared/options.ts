import type { HtmlToTextOptions } from '@solid-email/html-to-text';

type PlainTextDisabled = {
  plainText?: false;
};

type PlainTextEnabled = {
  plainText?: true;
  htmlToTextOptions?: HtmlToTextOptions;
};

type PlainTextOptions = PlainTextDisabled | PlainTextEnabled;

export type Options = {
  pretty?: boolean;
} & PlainTextOptions;

export type RenderSyncOptions = {
  pretty?: false;
} & PlainTextOptions;

export type CompileOptions = {
  withPlainText?: boolean;
  htmlToTextOptions?: HtmlToTextOptions;
};

export type CompileSyncOptions = CompileOptions;

export type CompiledRenderOptions = {
  pretty?: boolean;
  plainText?: boolean;
};

export type CompiledRenderSyncOptions = {
  pretty?: false;
  plainText?: boolean;
};
