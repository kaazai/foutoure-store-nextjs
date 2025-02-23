'use client';

import { useCart } from '@/context/cart-context';
import { X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const getProductImage = (id: number) => {
  const imageMap: Record<number, string> = {
    1: '/images/products/hoodie-1.jpg',
    2: '/images/products/pants-1.jpg',
    3: '/images/products/tee-1.jpg',
    4: '/images/products/jacket-1.jpg',
  };
  return imageMap[id];
};

export function FTRE_CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeItem, updateQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-black border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="font-heading text-xl">Cart</h2>
            <button onClick={onClose} className="p-2 hover:text-red-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Your cart is empty</p>
                <Link 
                  href="/shop" 
                  className="mt-4 text-white hover:text-red-500 transition-colors font-heading"
                  onClick={onClose}
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-white/10">
                    <div className="relative w-24 aspect-[3/4] bg-gray-900">
                      <Image
                        src={getProductImage(item.id)}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-heading">{item.name}</h3>
                          <p className="text-sm text-gray-400">Size: {item.size}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                            className="p-1 hover:text-red-500 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-1 hover:text-red-500 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-heading">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/10 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-heading text-lg">Total</span>
                <span className="font-heading text-lg">${state.total}</span>
              </div>
              <button className="w-full bg-white text-black py-4 font-heading hover:bg-red-500 hover:text-white transition-colors">
                CHECKOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 