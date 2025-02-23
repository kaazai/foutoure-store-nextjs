'use client';

import Image from 'next/image';
import Link from 'next/link';
import { filterProducts, type FilterOptions, type Product } from '@/lib/products';

type ProductGridProps = {
  filters?: FilterOptions;
  products?: Product[];
};

export function FTRE_ProductGrid({ filters = {}, products: initialProducts }: ProductGridProps) {
  const filteredProducts = filterProducts(filters, initialProducts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {filteredProducts.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-400">
          No products found
        </div>
      ) : (
        filteredProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/shop/product/${product.id}`}
            className="group"
          >
            <div className="relative aspect-[3/4] bg-gray-900">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-300"
              />
            </div>
            <div className="mt-4 flex justify-between items-baseline">
              <h3 className="font-heading text-lg">{product.name}</h3>
              <p className="text-sm text-gray-400">${product.price}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
} 