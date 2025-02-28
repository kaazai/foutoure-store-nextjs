import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

export type Product = Database['public']['Tables']['products']['Row'];

export type FilterOptions = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name';
};

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export function filterProducts(options: FilterOptions = {}, initialProducts: Product[] = []): Product[] {
  let filtered = [...initialProducts];

  // Search filter
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        (product.tags as string[])?.some(tag => tag.toLowerCase().includes(searchLower))
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
      product => Number(product.price) >= options.minPrice!
    );
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter(
      product => Number(product.price) <= options.maxPrice!
    );
  }

  // Sorting
  if (options.sortBy) {
    filtered.sort((a, b) => {
      switch (options.sortBy) {
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  return Array.from(
    new Set(products.map(product => product.category).filter(Boolean) as string[])
  );
} 