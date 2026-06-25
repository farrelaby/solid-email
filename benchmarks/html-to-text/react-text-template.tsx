/** @jsxRuntime automatic */
/** @jsxImportSource react */
import type { ReactElement, ReactNode } from 'react';
import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from 'react-email';
import {
  standardChecklist,
  standardFooterLinks,
  standardLineItems,
  standardTextSections,
} from './text-render-fixture-data';

export type ReactTextTemplateProps = {
  headline: ReactNode;
  name: ReactNode;
  intro: ReactNode;
  ctaHref: string;
  markerLiteral: ReactNode;
  skipPreview: boolean;
};

export const reactTextRenderData = {
  headline: 'Account security summary',
  name: 'Pat',
  intro: (
    <>
      <Text>Keep this digest</Text>
      <Text>
        <strong>handy</strong>
      </Text>
    </>
  ),
  ctaHref: 'mailto:security@example.com',
  markerLiteral: '__SM_CNT_runtime____SM_CNE_runtime__',
  skipPreview: true,
} satisfies ReactTextTemplateProps;

export function createReactTextEmail(
  props: ReactTextTemplateProps,
): ReactElement {
  return (
    <Html lang="en">
      <Body>
        <Container>
          <Text data-skip-in-text={props.skipPreview ? 'true' : 'false'}>
            Preview-only alert
          </Text>
          <Section>
            <Heading as="h1">{props.headline}</Heading>
            <Text>Hello {props.name}, your digest is ready.</Text>
            {props.intro}
            <Button href="https://example.com/audit">
              Download audit report
            </Button>
            <Text>
              <Link href={props.ctaHref}>Open digest</Link>
            </Text>
            <Text>{props.markerLiteral}</Text>
          </Section>

          <Section>
            <Heading as="h2">Release notes</Heading>
            {standardTextSections.map((section) => (
              <Section key={section.title}>
                <Heading as="h3">{section.title}</Heading>
                <Text>{section.body}</Text>
                <Text>
                  <Link href={section.href}>Read {section.title}</Link>
                </Text>
              </Section>
            ))}
          </Section>

          <Section>
            <Heading as="h2">Plan allocation</Heading>
            {standardLineItems.map((item) => (
              <Row key={item.name}>
                <Column>
                  <Text>{item.name}</Text>
                </Column>
                <Column>
                  <Text>Quantity {item.quantity}</Text>
                </Column>
                <Column>
                  <Text>{item.total}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section>
            <Heading as="h2">Owner checklist</Heading>
            <ol>
              {standardChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </Section>

          <Img src="https://example.com/tracker.gif" alt="Tracking pixel" />
          <Section>
            {standardFooterLinks.map(([label, href], index) => (
              <span key={href}>
                {index > 0 ? ' · ' : ''}
                <Link href={href}>{label}</Link>
              </span>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
