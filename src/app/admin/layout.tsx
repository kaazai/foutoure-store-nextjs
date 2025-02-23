'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, Grid, Users } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          redirect('/login');
        }

        // Check if user has admin role (you should implement this check based on your user roles)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.role !== 'admin') {
          redirect('/');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        redirect('/login');
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-white/10">
            <div className="p-6">
              <Link href="/admin" className="font-heading text-xl">
                FOUTOURE ADMIN
              </Link>
            </div>
            <nav className="px-4 py-6">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/products"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/collections"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Grid className="h-5 w-5" />
                    Collections
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    Admin Users
                  </Link>
                </li>
              </ul>
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
    </div>
  );
} 