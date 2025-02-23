import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { FTRE_ProductGrid } from "@/components/shop/product-grid";
import { collections, getCollectionProducts } from "@/lib/collections";
import { notFound } from "next/navigation";
import Image from "next/image";

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = collections.find(c => c.id === params.id);
  
  if (!collection) {
    notFound();
  }

  const products = getCollectionProducts(collection.id);

  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        {/* Collection Header */}
        <div className="relative aspect-[21/9] bg-gray-900 overflow-hidden mb-12">
          <Image
            src={collection.image}
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
              {collection.description}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl mb-8">Collection Products</h2>
          <FTRE_ProductGrid 
            filters={{ 
              category: undefined,
              sortBy: 'name'
            }} 
            products={products}
          />
        </div>
      </div>
    </main>
  );
} 