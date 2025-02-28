'use client';

import { useEffect, useState } from 'react';
import { FTRE_ProductForm } from "@/components/admin/product-form";
import { createClient } from '@/lib/supabase/client';
import type { ProductRow } from '@/lib/supabase/client';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white/50">Product not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-heading">Edit Product</h1>
      </div>

      <div className="max-w-4xl">
        <FTRE_ProductForm mode="edit" initialData={product} />
      </div>
    </div>
  );
} 