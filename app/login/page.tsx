'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Workflow, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      router.refresh();
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Sign in to the Optima Portals engine.</p>
        </div>

        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <form onSubmit={handleLogin} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Work Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="founder@agency.com" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-6 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Access Portal'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">
          Need a custom architecture? <Link href="https://optimalogic.studio" className="text-emerald-500 hover:text-emerald-400 transition-colors">Start here.</Link>
        </p>
      </div>
    </div>
  );
}