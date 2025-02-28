'use client';

import { useState, useEffect } from 'react';
import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from '@/context/cart-context';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/products';
import { Loader2 } from 'lucide-react';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  
  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();
        
        if (error) {
          console.error('Error fetching product:', error);
          setIsLoading(false);
          return notFound();
        }
        
        if (!data) {
          console.error('Product not found');
          setIsLoading(false);
          return notFound();
        }
        
        setProduct(data);
        // Update document title
        document.title = `${data.name} | FOUTOURE`;
      } catch (error) {
        console.error('Failed to load product:', error);
        setIsLoading(false);
        return notFound();
      }
      
      setIsLoading(false);
    }

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <FTRE_ShopHeader />
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      </main>
    );
  }
  
  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white">
        <FTRE_ShopHeader />
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-heading mb-4">Product not found</h2>
            <p className="text-gray-400">The product you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image || '/images/placeholder.jpg',
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4] bg-gray-900">
            <Image
              src={product.image || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-3xl">{product.name}</h1>
              <p className="text-gray-400 mt-2">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-gray-300">{product.description || 'No description available.'}</p>

            <div className="space-y-4">
              <h2 className="font-heading text-lg">Size</h2>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes && product.sizes.map((size) => (
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