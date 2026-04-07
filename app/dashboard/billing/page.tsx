'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { CreditCard, Loader2, CheckCircle2, Receipt, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || '');
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [supabase]);

  const handleManageBilling = async () => {
    setIsRedirecting(true);
    // TODO: When ready, ping your backend to generate a Paystack Customer Portal link
    // and redirect the user there. For now, we simulate a network delay.
    setTimeout(() => {
      setIsRedirecting(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto pb-12">
      
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight mb-3 text-white">Billing & License</h1>
        <p className="text-zinc-400 font-light">Manage your Optima Logic subscription and payment methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Current Plan */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[#050505] border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-medium text-white">Optima OS Access</h2>
                </div>
                <p className="text-sm text-zinc-400 font-light ml-13">Venture Studio License</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
              <div className="bg-black border border-white/5 rounded-2xl p-5">
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-1">Billed To</p>
                <p className="text-sm text-white font-medium truncate">{email}</p>
              </div>
              <div className="bg-black border border-white/5 rounded-2xl p-5">
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-1">Billing Cycle</p>
                <p className="text-sm text-white font-medium">Lifetime / Single Purchase</p>
              </div>
            </div>

            <button 
              onClick={handleManageBilling}
              disabled={isRedirecting}
              className="px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Manage Payment Method'}
            </button>
          </div>

          {/* INVOICE HISTORY */}
          <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">Billing History</h2>
                <p className="text-xs text-zinc-500 font-light">Download your recent invoices.</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <Receipt className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-sm text-white font-medium mb-1">No invoices yet</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Your future receipts and invoices from Paystack will appear here automatically.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Plan Features */}
        <div className="space-y-6">
          <div className="bg-black border border-white/10 rounded-3xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-4">Plan Features</h3>
            
            <ul className="space-y-4">
              {[
                "Unlimited LangGraph Generations",
                "Fully Relational Databases",
                "Automated API Mapping",
                "Priority Engine Queue",
                "Email Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span>Secure payments by Paystack</span>
              </div>
              <Link 
                href="/dashboard/new-deploy"
                className="w-full py-3 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                Deploy Additional System <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}