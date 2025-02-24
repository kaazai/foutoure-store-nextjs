import { useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { StorageError } from '@supabase/storage-js';

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setError(error);
    } else if (typeof error === 'string') {
      setError(new Error(error));
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      setError(new Error((error as { message: string }).message));
    } else {
      setError(new Error('An unexpected error occurred'));
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
} 