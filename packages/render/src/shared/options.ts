import type { HtmlToTextOptions } from 'html-to-text';

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
