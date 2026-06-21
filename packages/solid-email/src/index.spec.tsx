import { describe, expect, it } from 'vitest';
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
    const compiled = await compile(
      () => (
        <Html>
          <Body>
            <Text>Hello {slots.content('name', 'World')}</Text>
          </Body>
        </Html>
      ),
      { pretty: false },
    );

    const html = await compiled.render({ name: 'Solid' });
    expect(html).toContain('Hello Solid');
    expect(html).not.toContain('__SM_');

    const syncCompiled = compileSync(
      () => (
        <Html>
          <Body>
            <Text>Sync {slots.content('name', 'email')}</Text>
          </Body>
        </Html>
      ),
      { pretty: false },
    );

    const syncHtml = syncCompiled.renderSync({ name: 'template' });
    expect(syncHtml).toContain('Sync template');
  });
});
