import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { Product, getProducts } from './products';

export type Collection = Database['public']['Tables']['collections']['Row'];

export async function getCollections(): Promise<Collection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
  
  return data || [];
}

export async function getCollection(id: string): Promise<Collection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();
  
  if (error) {
    console.error(`Error fetching collection ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function getCollectionProducts(collectionId: string): Promise<Product[]> {
  const supabase = createClient();
  
  // First get the product IDs in this collection
  const { data: collectionProductsData, error: collectionProductsError } = await supabase
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', collectionId);
  
  if (collectionProductsError || !collectionProductsData.length) {
    console.error(`Error fetching product IDs for collection ${collectionId}:`, collectionProductsError);
    return [];
  }
  
  const productIds = collectionProductsData.map(item => item.product_id);
  
  // Then fetch the actual products
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .in('id', productIds)
    .eq('status', 'published');
  
  if (productsError) {
    console.error(`Error fetching products for collection ${collectionId}:`, productsError);
    return [];
  }
  
  return productsData || [];
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  const collections = await getCollections();
  // For now, return all published collections as featured
  // You can add a 'featured' field to the collections table later if needed
  return collections;
} 