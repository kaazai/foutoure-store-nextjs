'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';
import { FTRE_AnalyticsCard } from '@/components/admin/analytics-card';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  topProducts: {
    id: string;
    name: string;
    total_sold: number;
    revenue: number;
  }[];
  revenueData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  ordersData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

interface OrderItem {
  product_id: string;
  products: {
    id: string;
    name: string;
  };
  quantity: number;
  price_at_time: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topProducts: [],
    revenueData: {
      labels: [],
      datasets: [],
    },
    ordersData: {
      labels: [],
      datasets: [],
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        
        // Combine queries into a single transaction
        const { data: results, error } = await supabase.rpc('get_dashboard_stats');
        
        if (error) throw error;

        if (!results) {
          throw new Error('Failed to fetch dashboard statistics');
        }

        const {
          total_revenue,
          total_orders,
          total_customers,
          top_products,
          revenue_data,
          orders_data
        } = results;

        setStats({
          totalRevenue: total_revenue || 0,
          totalOrders: total_orders || 0,
          totalCustomers: total_customers || 0,
          averageOrderValue: total_orders ? total_revenue / total_orders : 0,
          topProducts: top_products || [],
          revenueData: revenue_data || {
            labels: [],
            datasets: [],
          },
          ordersData: orders_data || {
            labels: [],
            datasets: [],
          },
        });
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleError = (error: Error) => {
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      
      <div>
        <h1 className="text-2xl font-heading">Dashboard</h1>
        <p className="text-sm text-white/60">Overview of your store's performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Revenue</p>
              <p className="text-2xl font-heading">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Orders</p>
              <p className="text-2xl font-heading">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-white/60">Total Customers</p>
              <p className="text-2xl font-heading">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-white/60">Avg. Order Value</p>
              <p className="text-2xl font-heading">${stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8">
        <FTRE_AnalyticsCard
          title="Revenue (Last 7 Days)"
          data={stats.revenueData}
        />
        <FTRE_AnalyticsCard
          title="Orders (Last 7 Days)"
          data={stats.ordersData}
        />
      </div>

      {/* Top Products */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="font-heading">Top Selling Products</h2>
        </div>
        <div className="p-6">
          <div className="divide-y divide-white/10">
            {stats.topProducts.map((product) => (
              <div key={product.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-white/60">{product.total_sold} units sold</p>
                </div>
                <p className="font-heading">${product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 