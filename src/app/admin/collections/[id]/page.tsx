'use client';

import { useEffect, useState } from 'react';
import { FTRE_CollectionForm } from "@/components/admin/collection-form";
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from 'next/navigation';

type Collection = Database['public']['Tables']['collections']['Row'];

export default function EditCollectionPage() {
  const params = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setCollection(data);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white/50">Collection not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/collections"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-heading">Edit Collection</h1>
      </div>

      <div className="max-w-4xl">
        <FTRE_CollectionForm mode="edit" initialData={collection} />
      </div>
    </div>
  );
} 