'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentProducts: any[];
  recentOrders: any[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentProducts: [],
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch total orders and revenue
        const { data: orders, count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

        // Fetch recent products
        const { data: recentProducts } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent orders
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue,
          recentProducts: recentProducts || [],
          recentOrders: recentOrders || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-heading">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Products</p>
              <p className="text-2xl font-heading">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Orders</p>
              <p className="text-2xl font-heading">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Revenue</p>
              <p className="text-2xl font-heading">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-white/60">${product.price}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    product.status === 'published'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}
                >
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-white/60">${order.total}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    order.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : order.status === 'processing'
                      ? 'bg-blue-500/20 text-blue-500'
                      : order.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 