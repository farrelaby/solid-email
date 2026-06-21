import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Row,
  Section,
  Text,
} from '@akin01/solid-email';
import { For } from 'solid-js';
import type { PreviewItem } from './preview-data';

export interface SolidPreviewUiProps {
  emailHtml: string;
  items: PreviewItem[];
  runtime: string;
  selected: {
    path: string;
    subtitle: string;
    title: string;
  };
}

export function SolidPreviewUi(props: SolidPreviewUiProps) {
  return (
    <Html lang="en" data-runtime={props.runtime}>
      <Head>
        <title>{props.selected.title}</title>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.shell}>
          <Row>
            <Column style={styles.sidebarColumn}>
              <Section style={styles.sidebar}>
                <Text style={styles.eyebrow}>Solid Email Preview</Text>
                <Heading as="h1" style={styles.sidebarTitle}>
                  Email previews
                </Heading>
                <input
                  aria-label="Search previews"
                  placeholder="Search previews"
                  style={styles.searchInput}
                  value={props.selected.title}
                />
                <Section aria-label="Email previews" style={styles.nav}>
                  <For each={props.items}>
                    {(item) => (
                      <Link
                        href={`/preview/${item.id}`}
                        style={styles.previewLink}
                      >
                        <span style={styles.previewLinkTitle}>
                          {item.title}
                        </span>
                        <span style={styles.previewLinkDescription}>
                          {item.description}
                        </span>
                        <span style={styles.previewLinkMeta}>
                          {item.updatedAt} · {item.tags.join(', ')}
                        </span>
                      </Link>
                    )}
                  </For>
                </Section>
              </Section>
            </Column>
            <Column style={styles.detailColumn}>
              <Section style={styles.toolbar}>
                <Row>
                  <Column>
                    <Text style={styles.eyebrow}>{props.selected.path}</Text>
                    <Heading as="h2" style={styles.detailTitle}>
                      {props.selected.title}
                    </Heading>
                    <Text style={styles.subtitle}>
                      {props.selected.subtitle}
                    </Text>
                  </Column>
                  <Column style={styles.actionsColumn}>
                    <Button href="#desktop" style={styles.toolbarButton}>
                      Desktop
                    </Button>
                    <Button href="#mobile" style={styles.toolbarButton}>
                      Mobile
                    </Button>
                    <Button href="#plain-text" style={styles.toolbarButton}>
                      Plain text
                    </Button>
                  </Column>
                </Row>
              </Section>
              <Section
                aria-label="Rendered email preview"
                style={styles.previewCanvas}
              >
                <Section
                  data-email-bytes={props.emailHtml.length}
                  style={styles.iframeShell}
                >
                  <Text style={styles.previewLabel}>
                    Rendered email preview
                  </Text>
                  <Text style={styles.previewMeta}>
                    {props.emailHtml.length} rendered bytes
                  </Text>
                </Section>
              </Section>
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    margin: 0,
  },
  shell: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '18px',
    margin: '24px auto',
    padding: '0',
    width: '1180px',
  },
  sidebarColumn: {
    backgroundColor: '#111827',
    verticalAlign: 'top',
    width: '340px',
  },
  sidebar: {
    padding: '24px',
  },
  eyebrow: {
    color: '#7c3aed',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    lineHeight: '16px',
    margin: '0 0 8px',
    textTransform: 'uppercase',
  },
  sidebarTitle: {
    color: '#ffffff',
    fontSize: '24px',
    lineHeight: '32px',
    margin: '0 0 16px',
  },
  searchInput: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '10px',
    color: '#ffffff',
    display: 'block',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 18px',
    padding: '10px 12px',
    width: '100%',
  },
  nav: {
    margin: '0',
  },
  previewLink: {
    borderBottom: '1px solid #1f2937',
    color: '#d1d5db',
    display: 'block',
    padding: '12px 0',
    textDecoration: 'none',
  },
  previewLinkTitle: {
    color: '#ffffff',
    display: 'block',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '20px',
  },
  previewLinkDescription: {
    color: '#9ca3af',
    display: 'block',
    fontSize: '12px',
    lineHeight: '18px',
    marginTop: '4px',
  },
  previewLinkMeta: {
    color: '#7c3aed',
    display: 'block',
    fontSize: '11px',
    lineHeight: '16px',
    marginTop: '6px',
  },
  detailColumn: {
    backgroundColor: '#f9fafb',
    verticalAlign: 'top',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '24px',
  },
  detailTitle: {
    color: '#111827',
    fontSize: '28px',
    lineHeight: '36px',
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0',
  },
  actionsColumn: {
    textAlign: 'right',
    verticalAlign: 'top',
    width: '300px',
  },
  toolbarButton: {
    backgroundColor: '#ede9fe',
    borderRadius: '999px',
    color: '#6d28d9',
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 700,
    marginLeft: '8px',
    padding: '8px 12px',
    textDecoration: 'none',
  },
  previewCanvas: {
    padding: '28px',
  },
  previewLabel: {
    color: '#111827',
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '24px',
    margin: '0 0 6px',
  },
  previewMeta: {
    color: '#6b7280',
    fontSize: '13px',
    lineHeight: '20px',
    margin: '0',
  },
  iframeShell: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
  },
} as const;
