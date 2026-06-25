export const standardTextSections = Array.from({ length: 18 }, (_, index) => {
  const item = index + 1;
  return {
    title: `Release note ${item}`,
    body: `Capability ${item} shipped with audit logging, rollback controls, and workspace policy enforcement for distributed teams.`,
    href: `https://example.com/releases/${item}`,
  };
});

export const standardLineItems = Array.from({ length: 12 }, (_, index) => {
  const item = index + 1;
  return {
    name: `Plan seat ${item}`,
    quantity: item + 2,
    total: `$${(item * 37).toFixed(2)}`,
  };
});

export const standardChecklist = [
  'Confirm billing contact before renewal',
  'Download compliance export for archive',
  'Review suspicious sign-in notifications',
  'Invite finance reviewers to workspace',
  'Rotate webhook secret for production',
  'Schedule migration rehearsal with support',
  'Pin recovery codes in the admin vault',
  'Enable digest delivery for owners',
] as const;

export const standardFooterLinks = [
  ['Preferences', 'https://example.com/preferences'],
  ['Security', 'https://example.com/security'],
  ['Billing', 'https://example.com/billing'],
  ['Support', 'https://example.com/support'],
  ['Docs', 'https://example.com/docs'],
  ['Unsubscribe', 'https://example.com/unsubscribe'],
] as const;
