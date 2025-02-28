'use client';

import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { getCollections, type Collection } from "@/lib/collections";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCollections() {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error('Failed to load collections:', error);
        setError('Failed to load collections. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCollections();
  }, []);

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

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="font-heading text-4xl mb-8">Collections</h1>
        {collections.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No collections found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className="group block"
              >
                <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                  <Image
                    src={collection.image || '/images/placeholder.jpg'}
                    alt={collection.name}
                    fill
                    className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-300"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h2 className="font-heading text-2xl group-hover:text-red-500 transition-colors">
                    {collection.name}
                  </h2>
                  <p className="text-gray-400">{collection.description || ''}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 