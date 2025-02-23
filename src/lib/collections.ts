import { Product, products } from './products';

export type Collection = {
  id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  productIds: number[];
};

export const collections: Collection[] = [
  {
    id: 'tech-essentials',
    name: 'Tech Essentials',
    description: 'Performance-driven essentials for the modern urbanite. Technical fabrics meet minimalist design.',
    image: '/images/collections/tech-essentials.jpg',
    featured: true,
    productIds: [1, 4], // Urban Tech Hoodie, Tactical Jacket
  },
  {
    id: 'minimal-basics',
    name: 'Minimal Basics',
    description: 'Timeless pieces with a contemporary twist. Clean lines and versatile styling options.',
    image: '/images/collections/minimal-basics.jpg',
    featured: true,
    productIds: [3], // Oversized Tee
  },
  {
    id: 'urban-utility',
    name: 'Urban Utility',
    description: 'Functional streetwear with a purpose. Designed for both style and practicality.',
    image: '/images/collections/urban-utility.jpg',
    featured: false,
    productIds: [2, 4], // Cargo Tech Pants, Tactical Jacket
  },
];

export function getCollectionProducts(collectionId: string): Product[] {
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) return [];
  return products.filter(product => collection.productIds.includes(product.id));
}

export function getFeaturedCollections(): Collection[] {
  return collections.filter(collection => collection.featured);
} 