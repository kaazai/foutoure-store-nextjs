'use client';

import { Copy, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export function FTRE_ErrorToast({ message, onClose }: ErrorToastProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-black border border-red-500 text-white px-6 py-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-4">
      <p className="text-red-500">{message}</p>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleCopy} 
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          title="Copy error message"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 