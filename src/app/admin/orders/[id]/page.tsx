'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderWithDetails = Order & {
  profile: { email: string };
  order_items: Array<{
    id: string;
    quantity: number;
    price_at_time: number;
    product: {
      id: string;
      name: string;
      image: string;
    };
  }>;
  notes?: string;
  shipping_address: string;
  billing_address: string;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles (
            email
          ),
          order_items (
            id,
            quantity,
            price_at_time,
            product:products (
              id,
              name,
              image
            )
          )
        `)
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setOrder(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    try {
      setIsActionLoading(true);
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchOrder();
    } catch (err) {
      handleError(err);
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
        <p className="text-white/50">Order not found</p>
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
          <p className="text-sm text-white/60">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="col-span-2 space-y-8">
          {/* Order Items */}
          <div className="bg-white/5 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-heading">Order Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {order.order_items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded overflow-hidden">
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${item.product.id}`}
                            className="hover:text-red-500 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4">
                      ${item.price_at_time}
                    </td>
                    <td className="px-6 py-4">
                      ${(item.quantity * item.price_at_time).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-white/5">
                  <td colSpan={3} className="px-6 py-4 text-right font-medium">
                    Total Amount:
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${order.total_amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className="bg-white/5 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="font-heading">Customer Notes</h2>
              </div>
              <div className="px-6 py-4">
                <p className="text-white/80">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-8">
          {/* Status */}
          <div className="bg-white/5 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-heading">Order Status</h2>
            </div>
            <div className="p-6">
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
                disabled={isActionLoading}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white/5 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="font-heading">Customer Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p>{order.profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Shipping Address</p>
                <p>{order.shipping_address}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Billing Address</p>
                <p>{order.billing_address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 