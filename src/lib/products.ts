export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: 1,
    name: 'Urban Tech Hoodie',
    price: 189,
    image: '/images/products/hoodie-1.jpg',
    description: 'Minimalist design meets technical performance. A perfect blend of style and functionality for urban environments.',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Hoodies',
    tags: ['streetwear', 'technical', 'urban'],
  },
  {
    id: 2,
    name: 'Cargo Tech Pants',
    price: 159,
    image: '/images/products/pants-1.jpg',
    description: 'Modern cargo pants with a tailored fit. Multiple pockets designed for everyday carry.',
    sizes: ['30', '32', '34', '36'],
    category: 'Pants',
    tags: ['streetwear', 'technical', 'cargo'],
  },
  {
    id: 3,
    name: 'Oversized Tee',
    price: 79,
    image: '/images/products/tee-1.jpg',
    description: 'Premium cotton with an oversized cut. Features minimal branding and a relaxed fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-Shirts',
    tags: ['streetwear', 'basics', 'oversized'],
  },
  {
    id: 4,
    name: 'Tactical Jacket',
    price: 249,
    image: '/images/products/jacket-1.jpg',
    description: 'Weather-resistant jacket with clean lines. Perfect for urban exploration.',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Jackets',
    tags: ['streetwear', 'technical', 'outerwear'],
  },
];

export type FilterOptions = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name';
};

export function filterProducts(options: FilterOptions = {}, initialProducts?: Product[]): Product[] {
  let filtered = [...(initialProducts || products)];

  // Search filter
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Category filter
  if (options.category) {
    filtered = filtered.filter(
      product => product.category === options.category
    );
  }

  // Price range filter
  if (options.minPrice !== undefined) {
    filtered = filtered.filter(
      product => product.price >= options.minPrice!
    );
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter(
      product => product.price <= options.maxPrice!
    );
  }

  // Sorting
  if (options.sortBy) {
    filtered.sort((a, b) => {
      switch (options.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export const categories = Array.from(
  new Set(products.map(product => product.category))
); 