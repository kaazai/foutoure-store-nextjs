'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { FTRE_CartDrawer } from './cart-drawer';

export function FTRE_ShopHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 w-full border-b border-white/10 bg-black z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl">
            FOUTOURE
          </Link>

          <nav className="flex items-center gap-8 font-heading text-sm">
            <Link href="/shop" className="hover:text-red-500 transition-colors">
              SHOP
            </Link>
            <Link href="/collections" className="hover:text-red-500 transition-colors">
              COLLECTIONS
            </Link>
            <button 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <FTRE_CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
} 