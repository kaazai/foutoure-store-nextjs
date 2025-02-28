'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export function FTRE_ErrorToast({ message, onClose }: ErrorToastProps) {
  useEffect(() => {
    if (message) {
      // Show the error toast with custom content
      const toastId = toast.error(
        <div className="flex items-start gap-4">
          <p className="flex-1">{message}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(message);
              toast.success('Error copied to clipboard');
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      );
      
      // Clear the error state after the toast is shown
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Wait for 3 seconds before clearing

      return () => {
        clearTimeout(timer);
        toast.dismiss(toastId);
      };
    }
  }, [message, onClose]);

  return null;
} 