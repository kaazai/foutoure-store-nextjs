'use client';

import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { FTRE_ProductGrid } from "@/components/shop/product-grid";
import { Collection, getCollection, getCollectionProducts } from "@/lib/collections";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/products";
import { Metadata } from "next";

export default function CollectionPage() {
  const params = useParams();
  const id = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCollectionData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const collectionData = await getCollection(id);
        
        if (!collectionData) {
          setIsLoading(false);
          return notFound();
        }
        
        setCollection(collectionData);
        
        // Update document title
        document.title = `${collectionData.name} | FOUTOURE Collections`;
        
        const productsData = await getCollectionProducts(id);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to load collection data:', error);
        setError('Failed to load collection data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCollectionData();
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

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <FTRE_ShopHeader />
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-heading mb-4">Error</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="min-h-screen bg-black text-white">
        <FTRE_ShopHeader />
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-heading mb-4">Collection not found</h2>
            <p className="text-gray-400">The collection you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        {/* Collection Header */}
        <div className="relative aspect-[21/9] bg-gray-900 overflow-hidden mb-12">
          <Image
            src={collection.image || '/images/placeholder.jpg'}
            alt={collection.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="font-heading text-4xl md:text-5xl mb-4">
              {collection.name}
            </h1>
            <p className="text-gray-200 max-w-2xl">
              {collection.description || ''}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl mb-8">Collection Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No products found in this collection
            </div>
          ) : (
            <FTRE_ProductGrid 
              filters={{ 
                sortBy: 'name'
              }} 
              products={products}
            />
          )}
        </div>
      </div>
    </main>
  );
} 