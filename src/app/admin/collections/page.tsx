'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Collection = Database['public']['Tables']['collections']['Row'];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (collection: Collection) => {
    try {
      setIsActionLoading(true);
      const newStatus = collection.status === 'published' ? 'draft' : 'published';
      const { error } = await supabase
        .from('collections')
        .update({ status: newStatus })
        .eq('id', collection.id);

      if (error) throw error;
      await fetchCollections();
    } catch (error) {
      handleError(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const deleteCollection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;

    try {
      setIsActionLoading(true);
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCollections();
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

  return (
    <div>
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-heading">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
          aria-disabled={isActionLoading}
          tabIndex={isActionLoading ? -1 : undefined}
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          <p>No collections found.</p>
          <p className="text-sm mt-2">Create your first collection to get started.</p>
        </div>
      ) : (
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-white/10 rounded overflow-hidden">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{collection.name}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white/60 truncate max-w-[200px]">
                      {collection.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        collection.status === 'published'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}
                    >
                      {collection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/collections/${collection.id}/products`}
                        className="p-2 hover:bg-white/10 rounded"
                        title="Manage Products"
                      >
                        <Plus className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => toggleStatus(collection)}
                        className="p-2 hover:bg-white/10 rounded"
                        title={collection.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {collection.status === 'published' ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <Link
                        href={`/admin/collections/${collection.id}`}
                        className="p-2 hover:bg-white/10 rounded"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteCollection(collection.id)}
                        className="p-2 hover:bg-white/10 rounded text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 