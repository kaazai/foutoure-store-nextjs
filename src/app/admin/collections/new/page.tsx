'use client';

import { FTRE_CollectionForm } from "@/components/admin/collection-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCollectionPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/collections"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-heading">New Collection</h1>
      </div>

      <div className="max-w-4xl">
        <FTRE_CollectionForm mode="create" />
      </div>
    </div>
  );
} 