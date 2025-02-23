'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Package, Grid, Users } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
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
  );
} 