'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Grid, Users, LogOut, LayoutDashboard, ShoppingBag, FolderOpen, ShoppingCart } from 'lucide-react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          return redirect('/login');
        }

        // Check if user has admin role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profile || profile.role !== 'admin') {
          return redirect('/');
        }

      } catch (error) {
        handleError(error);
        return redirect('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10">
          <div className="p-6">
            <Link href="/admin" className="font-heading text-xl">
              FOUTOURE ADMIN
            </Link>
          </div>
          <nav className="px-4 py-6">
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Package className="h-5 w-5" />
                Products
              </Link>
              <Link
                href="/admin/collections"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors",
                  pathname === "/admin/collections" && "bg-white/10"
                )}
              >
                <FolderOpen className="h-4 w-4" />
                Collections
              </Link>
              <Link
                href="/admin/orders"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors",
                  pathname === "/admin/orders" && "bg-white/10"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <Users className="h-5 w-5" />
                Admin Users
              </Link>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 fixed bottom-0 w-56 bg-black p-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 w-full hover:bg-white/5 rounded-lg transition-colors text-red-500"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 