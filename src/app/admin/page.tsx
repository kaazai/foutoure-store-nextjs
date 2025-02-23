'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, Grid, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    collections: 0,
    featuredCollections: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: productsCount },
        { count: collectionsCount },
        { count: featuredCount },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true }),
        supabase.from('collections').select('*', { count: 'exact', head: true }).eq('featured', true),
      ]);

      setStats({
        products: productsCount || 0,
        collections: collectionsCount || 0,
        featuredCollections: featuredCount || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Products</p>
              <p className="font-heading text-2xl">{stats.products}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <Grid className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Collections</p>
              <p className="font-heading text-2xl">{stats.collections}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Featured Collections</p>
              <p className="font-heading text-2xl">{stats.featuredCollections}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/products/new"
            className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <h3 className="font-heading text-lg mb-2">Add New Product</h3>
            <p className="text-sm text-gray-400">Create a new product listing</p>
          </a>
          <a
            href="/admin/collections/new"
            className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <h3 className="font-heading text-lg mb-2">Create Collection</h3>
            <p className="text-sm text-gray-400">Curate a new product collection</p>
          </a>
        </div>
      </div>
    </div>
  );
} 