'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Collection = Database['public']['Tables']['collections']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export default function CollectionProductsPage() {
  const params = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch collection details
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', params.id)
        .single();

      if (collectionError) throw collectionError;
      setCollection(collectionData);

      // Fetch products in this collection
      const { data: productsInCollection, error: productsError } = await supabase
        .from('collection_products')
        .select('product_id')
        .eq('collection_id', params.id);

      if (productsError) throw productsError;

      const productIds = productsInCollection.map(p => p.product_id);

      if (productIds.length > 0) {
        const { data: products, error: productsDataError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsDataError) throw productsDataError;
        setCollectionProducts(products || []);
      } else {
        setCollectionProducts([]);
      }

      // Fetch available products (not in this collection)
      const { data: allProducts, error: allProductsError } = await supabase
        .from('products')
        .select('*');

      if (allProductsError) throw allProductsError;
      
      // Filter out products that are already in the collection
      const availableProductsFiltered = (allProducts || []).filter(
        product => !productIds.includes(product.id)
      );
      setAvailableProducts(availableProductsFiltered);

    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProductToCollection = async (productId: string) => {
    try {
      setIsActionLoading(true);
      const { error } = await supabase
        .from('collection_products')
        .insert({
          collection_id: params.id,
          product_id: productId,
        });

      if (error) throw error;
      await fetchData();
      
    } catch (error) {
      handleError(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const removeProductFromCollection = async (productId: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the collection?')) return;

    try {
      setIsActionLoading(true);
      const { error } = await supabase
        .from('collection_products')
        .delete()
        .eq('collection_id', params.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchData();
      
    } catch (error) {
      handleError(error);
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

  if (!collection) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white/50">Collection not found</div>
      </div>
    );
  }

  return (
    <div>
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/collections"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading">{collection.name}</h1>
          <p className="text-sm text-white/60">Manage products in this collection</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-heading">Products in Collection</h2>
          <button
            onClick={() => setShowAddProducts(!showAddProducts)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            disabled={isActionLoading}
          >
            {showAddProducts ? (
              <>
                <X className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Products
              </>
            )}
          </button>
        </div>

        {showAddProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-white/10 rounded-lg overflow-hidden hover:border-white/20"
              >
                <div className="relative aspect-square bg-white/5">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="text-sm text-white/60">${product.price}</p>
                  <button
                    onClick={() => addProductToCollection(product.id)}
                    className="mt-4 w-full px-4 py-2 bg-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    disabled={isActionLoading}
                  >
                    Add to Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {collectionProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-white/50">
                <p>No products in this collection</p>
                <button
                  onClick={() => setShowAddProducts(true)}
                  className="mt-4 text-white hover:text-red-500 transition-colors"
                >
                  Add some products
                </button>
              </div>
            ) : (
              collectionProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-white/10 rounded-lg overflow-hidden hover:border-white/20"
                >
                  <div className="relative aspect-square bg-white/5">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-white/60">${product.price}</p>
                    <button
                      onClick={() => removeProductFromCollection(product.id)}
                      className="mt-4 w-full px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      disabled={isActionLoading}
                    >
                      Remove from Collection
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 