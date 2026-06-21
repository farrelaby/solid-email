import {
  campaign,
  features,
  products,
  updates,
} from '../rendering/fixture-data';

export interface PreviewItem {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  tags: string[];
}

export const previewItems: PreviewItem[] = [
  ...features.map((feature, index) => ({
    id: `feature-${index + 1}`,
    title: feature.title,
    description: feature.body,
    updatedAt: `2026-06-${String(index + 10).padStart(2, '0')}`,
    tags: ['feature', 'benchmark'],
  })),
  ...products.map((product, index) => ({
    id: `product-${index + 1}`,
    title: product.title,
    description: `${product.price} plan preview using ${product.image}`,
    updatedAt: `2026-06-${String(index + 14).padStart(2, '0')}`,
    tags: ['product', 'email'],
  })),
  ...updates.map((update, index) => ({
    id: `update-${index + 1}`,
    title: update.title,
    description: update.body,
    updatedAt: `2026-06-${String(index + 17).padStart(2, '0')}`,
    tags: ['release', index % 2 === 0 ? 'stable' : 'canary'],
  })),
];

export const selectedPreview = {
  title: campaign.headline,
  subtitle: campaign.preview,
  path: 'launch-week/marketing-email',
};
