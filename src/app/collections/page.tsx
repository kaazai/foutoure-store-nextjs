import { FTRE_ShopHeader } from "@/components/shop/shop-header";
import { collections } from "@/lib/collections";
import Image from "next/image";
import Link from "next/link";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <FTRE_ShopHeader />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="font-heading text-4xl mb-8">Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group block"
            >
              <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-300"
                />
                {collection.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-sm font-heading">
                    FEATURED
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="font-heading text-2xl group-hover:text-red-500 transition-colors">
                  {collection.name}
                </h2>
                <p className="text-gray-400">{collection.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 