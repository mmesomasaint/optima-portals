'use client';

import { Users, ArrowRight, LayoutTemplate, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function BlueprintsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Architecture Library
        </h1>
        <p className="text-zinc-400 font-light">Deploy pre-trained Notion operating systems directly to your workspace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Coming Soon Blueprint 1 */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">The Client Nexus</h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            A complete CRM and client portal architecture. Manage deliverables, invoices, and feedback in one synchronized loop.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">In Training</span>
            <button disabled className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              Coming Q3 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coming Soon Blueprint 2 */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
            <LayoutTemplate className="w-6 h-6 text-zinc-300" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">The Content Engine</h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Multi-channel content pipeline. Auto-relate social posts to macro-content, track publishing states, and manage writers.
          </p>
          <div className="flex items-center justify-between">
             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">In Training</span>
            <button disabled className="text-sm font-medium text-zinc-500 flex items-center gap-2">
              Coming Q3 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* The Upsell Banner */}
      <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-emerald-500 font-medium flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" /> Need a custom build today?
          </h4>
          <p className="text-sm text-zinc-400 font-light">Bypass the library and have the AI map your exact workflow.</p>
        </div>
        <Link href="/dashboard/new-deploy" className="shrink-0 px-5 py-2.5 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors">
          Initialize Custom AI
        </Link>
      </div>

    </div>
  );
}