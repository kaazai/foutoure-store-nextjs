'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

type OrderWithDetails = Order & {
  profiles: { email: string };
  order_items: (OrderItem & { products: Product })[];
};

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            email
          ),
          order_items (
            *,
            products (
              *
            )
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      setIsActionLoading(true);
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', params.id);

      if (error) throw error;
      await fetchOrder();
    } catch (error) {
      handleError(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white/50">Order not found</div>
      </div>
    );
  }

  return (
    <div>
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-white/60">View order details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="col-span-2 space-y-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-heading mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-white/5">
                    {item.products.image && (
                      <Image
                        src={item.products.image}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.products.name}</h3>
                    <p className="text-sm text-white/60">
                      Quantity: {item.quantity} × ${item.products.price}
                    </p>
                    <p className="text-sm font-medium">
                      Total: ${(item.quantity * item.products.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-lg font-heading mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Customer</span>
                <span>{order.profiles.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Total Amount</span>
                <span className="font-medium">${order.total_amount}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm text-white/60 mb-2">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value as any)}
                className="w-full bg-transparent border border-white/10 rounded px-3 py-2"
                disabled={isActionLoading}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 