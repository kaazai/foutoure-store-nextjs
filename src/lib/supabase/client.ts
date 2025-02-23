import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type CollectionRow = Database['public']['Tables']['collections']['Row'];
export type CollectionProductRow = Database['public']['Tables']['collection_products']['Row'];
export type AdminUserRow = Database['public']['Tables']['admin_users']['Row']; 