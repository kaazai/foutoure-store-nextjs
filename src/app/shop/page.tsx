'use client';

import { useState } from 'react';
import { FTRE_ProductGrid } from "@/components/shop/product-grid";
import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { Search } from 'lucide-react';
import { FilterOptions } from '@/lib/products';

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4">
        <div className="pt-24 pb-8">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-[300px] bg-transparent border border-white/20 px-4 py-2 pr-10 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <select
              value={filters.sortBy || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                sortBy: e.target.value as FilterOptions['sortBy']
              }))}
              className="bg-transparent border border-white/20 px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Active Filters */}
          {(filters.search || filters.sortBy) && (
            <div className="mt-4 flex gap-2">
              {filters.search && (
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, search: undefined }));
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 bg-red-500/10 border border-red-500 text-sm hover:bg-red-500 transition-colors"
                >
                  Search: {filters.search} ×
                </button>
              )}
              {filters.sortBy && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: undefined }))}
                  className="px-3 py-1 bg-red-500/10 border border-red-500 text-sm hover:bg-red-500 transition-colors"
                >
                  Sort: {filters.sortBy.replace('-', ' ')} ×
                </button>
              )}
              {(filters.search || filters.sortBy) && (
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 border border-white/20 text-sm hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        <FTRE_ProductGrid filters={filters} />
      </div>
    </main>
  );
} 