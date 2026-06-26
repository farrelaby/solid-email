import { describe, expect, it } from 'vitest';
import * as client from './client';
import {
  Body as ClientBody,
  Button as ClientButton,
  CodeBlock as ClientCodeBlock,
  CodeInline as ClientCodeInline,
  Column as ClientColumn,
  Container as ClientContainer,
  Font as ClientFont,
  Head as ClientHead,
  Heading as ClientHeading,
  Hr as ClientHr,
  Html as ClientHtml,
  Img as ClientImg,
  Link as ClientLink,
  Markdown as ClientMarkdown,
  Preview as ClientPreview,
  Row as ClientRow,
  Section as ClientSection,
  Text as ClientText,
} from './client';
import {
  Body,
  Button,
  CodeBlock,
  CodeInline,
  Column,
  Container,
  compile,
  compileSync,
  defineSlots,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Preview,
  Row,
  render,
  renderSync,
  Section,
  Tailwind,
  Text,
  toPlainText,
} from './index';

const componentExports = {
  Body,
  Button,
  CodeBlock,
  CodeInline,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Markdown,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
};

const clientComponentExports = {
  Body: ClientBody,
  Button: ClientButton,
  CodeBlock: ClientCodeBlock,
  CodeInline: ClientCodeInline,
  Column: ClientColumn,
  Container: ClientContainer,
  Font: ClientFont,
  Head: ClientHead,
  Heading: ClientHeading,
  Hr: ClientHr,
  Html: ClientHtml,
  Img: ClientImg,
  Link: ClientLink,
  Markdown: ClientMarkdown,
  Preview: ClientPreview,
  Row: ClientRow,
  Section: ClientSection,
  Text: ClientText,
};

describe('public entrypoint', () => {
  it('exports every public component from the package root', () => {
    for (const [name, component] of Object.entries(componentExports)) {
      expect(component, name).toBeTypeOf('function');
    }
  });

  it('re-exports render utilities from the package root', async () => {
    const html = await render(() => (
      <Html>
        <Body>
          <Text>Entrypoint render</Text>
        </Body>
      </Html>
    ));
    const syncHtml = renderSync(() => <Text>Entrypoint sync render</Text>);
    const text = toPlainText('<h1>Entrypoint text</h1>');

    expect(html).toContain('Entrypoint render');
    expect(syncHtml).toContain('Entrypoint sync render');
    expect(text).toContain('ENTRYPOINT TEXT');
  });

  it('re-exports compile and slot utilities from the package root', async () => {
    const slots = defineSlots<{ name: string }>();
    const compiled = await compile(() => (
      <Html>
        <Body>
          <Text>Hello {slots.content('name', 'World')}</Text>
        </Body>
      </Html>
    ));

    const html = await compiled.render({ name: 'Solid' });
    expect(html).toContain('Hello Solid');
    expect(html).not.toContain('__SM_');

    const syncCompiled = compileSync(() => (
      <Html>
        <Body>
          <Text>Sync {slots.content('name', 'email')}</Text>
        </Body>
      </Html>
    ));

    const syncHtml = syncCompiled.renderSync({ name: 'template' });
    expect(syncHtml).toContain('Sync template');
  });
});

describe('client entrypoint', () => {
  it('exports DOM-safe preview components without render utilities or Tailwind', () => {
    for (const [name, component] of Object.entries(clientComponentExports)) {
      expect(component, name).toBeTypeOf('function');
    }

    expect('render' in client).toBe(false);
    expect('compile' in client).toBe(false);
    expect('Tailwind' in client).toBe(false);
  });
});
