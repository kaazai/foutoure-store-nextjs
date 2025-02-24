'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';
import { Loader2, Shield, ShieldOff } from 'lucide-react';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FTRE_ErrorToast } from '@/components/ui/error-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const supabase = createClient();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: 'admin' | 'user') => {
    if (currentRole === 'admin' && !window.confirm('Are you sure you want to remove admin privileges from this user?')) {
      return;
    }

    try {
      setIsActionLoading(true);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      handleError(error);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div>
      {error && <FTRE_ErrorToast message={error.message} onClose={clearError} />}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading">Admin Users</h1>
          <p className="text-sm text-white/60">Manage admin privileges</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => toggleAdminRole(user.id, user.role)}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors
                      ${user.role === 'admin'
                        ? 'text-red-500 hover:bg-red-500/10'
                        : 'text-blue-500 hover:bg-blue-500/10'
                      }
                    `}
                    disabled={isActionLoading}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <ShieldOff className="h-4 w-4" />
                        Remove Admin
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Make Admin
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 