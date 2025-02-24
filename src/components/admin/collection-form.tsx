'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { Upload, Loader2 } from 'lucide-react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Collection = Database['public']['Tables']['collections']['Row'];

interface CollectionFormProps {
  initialData?: Collection;
  mode: 'create' | 'edit';
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function FTRE_CollectionForm({ initialData, mode }: CollectionFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image || '');
  const { error, handleError, clearError } = useErrorHandler();

  const [formData, setFormData] = useState<Partial<Collection>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'draft',
  });

  const validateImage = (file: File): Error | null => {
    if (file.size > MAX_FILE_SIZE) {
      return new Error('Image size must be less than 5MB');
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return new Error('Only JPEG, PNG and WebP images are allowed');
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        handleError(error);
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = (): Error | null => {
    if (!formData.name?.trim()) {
      return new Error('Name is required');
    }
    if (!formData.description?.trim()) {
      return new Error('Description is required');
    }
    if (mode === 'create' && !imageFile && !initialData?.image) {
      return new Error('Image is required');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      handleError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = initialData?.image || '';

      if (imageFile) {
        // Delete old image if exists
        if (initialData?.image) {
          const oldImagePath = initialData.image.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('collections')
              .remove([oldImagePath]);
          }
        }

        // Upload new image
        const fileExt = imageFile.name.split('.').pop() || '';
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('collections')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('collections')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const collectionData = {
        ...formData,
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('collections')
          .insert([{ ...collectionData, created_at: new Date().toISOString() }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', initialData!.id);
        if (error) throw error;
      }

      router.push('/admin/collections');
      router.refresh();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}

      {/* Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Collection Image
          <span className="text-red-500">*</span>
          <span className="text-sm text-white/50 ml-2">(Max 5MB, JPEG/PNG/WebP)</span>
        </label>
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 bg-white/5 rounded-lg overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-white/30" />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
            required
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
            required
            disabled={isLoading}
            maxLength={500}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
            disabled={isLoading}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Collection' : 'Update Collection'}
        </button>
      </div>
    </form>
  );
} 