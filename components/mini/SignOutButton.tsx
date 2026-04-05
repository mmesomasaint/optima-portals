'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); // Clear the client cache
  };

  return (
    <button 
      onClick={handleSignOut}
      className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all mt-2"
    >
      <LogOut className="w-4 h-4 mr-3" /> Sign Out
    </button>
  );
}