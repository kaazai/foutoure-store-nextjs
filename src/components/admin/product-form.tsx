'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { useRouter } from 'next/navigation';
import { Upload, Loader2 } from 'lucide-react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductFormProps {
  initialData?: Product;
  mode: 'create' | 'edit';
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function FTRE_ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image || '');
  const { error, handleError, clearError } = useErrorHandler();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    sizes: initialData?.sizes || [],
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft',
  });

  const validateImage = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return 'Image size must be less than 5MB';
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG and WebP images are allowed';
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        handleError(new Error(error));
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!formData.name?.trim()) {
      return new Error('Name is required');
    }
    if (!formData.description?.trim()) {
      return new Error('Description is required');
    }
    if (mode === 'create' && !imageFile && !initialData?.image) {
      return new Error('Image is required');
    }
    if (!formData.price || formData.price <= 0) {
      return new Error('Price must be greater than 0');
    }
    if (!formData.category?.trim()) {
      return new Error('Category is required');
    }
    if (!formData.sizes?.length) {
      return new Error('At least one size is required');
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
              .from('products')
              .remove([oldImagePath]);
          }
        }

        // Upload new image
        const fileExt = imageFile.name.split('.').pop() || '';
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        ...formData,
        image: imageUrl,
        sizes: formData.sizes || [],
        tags: formData.tags || [],
        updated_at: new Date().toISOString(),
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('products')
          .insert([{ ...productData, created_at: new Date().toISOString() }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData!.id);
        if (error) throw error;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
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
          Product Image
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
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
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

        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Price
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
            required
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
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

      {/* Category and Status */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Category
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
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

      {/* Sizes */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Sizes
          <span className="text-red-500">*</span>
          <span className="text-sm text-white/50 ml-2">(Comma separated)</span>
        </label>
        <input
          type="text"
          value={formData.sizes?.join(', ') || ''}
          onChange={(e) => {
            const sizesArray = e.target.value
              .split(',')
              .map(size => size.trim())
              .filter(Boolean);
            setFormData({ ...formData, sizes: sizesArray });
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
          placeholder="S, M, L, XL"
          disabled={isLoading}
        />
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Tags
          <span className="text-sm text-white/50 ml-2">(Comma separated)</span>
        </label>
        <input
          type="text"
          value={formData.tags?.join(', ') || ''}
          onChange={(e) => {
            const tagsArray = e.target.value
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean);
            setFormData({ ...formData, tags: tagsArray });
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20"
          placeholder="summer, new-arrival, featured"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </button>
      </div>
    </form>
  );
} 