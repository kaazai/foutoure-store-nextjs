import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type CollectionRow = Database['public']['Tables']['collections']['Row'];
export type CollectionProductRow = Database['public']['Tables']['collection_products']['Row'];
export type AdminUserRow = Database['public']['Tables']['admin_users']['Row']; 