'use client';

import { useState } from 'react';
import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { notFound } from "next/navigation";
import Image from "next/image";
import { useCart } from '@/context/cart-context';

const products = [
  {
    id: 1,
    name: 'Urban Tech Hoodie',
    price: 189,
    image: '/images/products/hoodie-1.jpg',
    description: 'Minimalist design meets technical performance. A perfect blend of style and functionality for urban environments.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Cargo Tech Pants',
    price: 159,
    image: '/images/products/pants-1.jpg',
    description: 'Modern cargo pants with a tailored fit. Multiple pockets designed for everyday carry.',
    sizes: ['30', '32', '34', '36'],
  },
  {
    id: 3,
    name: 'Oversized Tee',
    price: 79,
    image: '/images/products/tee-1.jpg',
    description: 'Premium cotton with an oversized cut. Features minimal branding and a relaxed fit.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Tactical Jacket',
    price: 249,
    image: '/images/products/jacket-1.jpg',
    description: 'Weather-resistant jacket with clean lines. Perfect for urban exploration.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addItem } = useCart();
  const product = products.find(p => p.id === parseInt(params.id));
  
  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4] bg-gray-900">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-3xl">{product.name}</h1>
              <p className="text-gray-400 mt-2">${product.price}</p>
            </div>

            <p className="text-gray-300">{product.description}</p>

            <div className="space-y-4">
              <h2 className="font-heading text-lg">Size</h2>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-3 border font-heading transition-colors ${
                      selectedSize === size
                        ? 'border-red-500 bg-red-500/10 text-red-500'
                        : 'border-white/20 hover:border-red-500 hover:bg-red-500/10'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-4 font-heading transition-colors ${
                selectedSize
                  ? 'bg-white text-black hover:bg-red-500 hover:text-white'
                  : 'bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              {selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 