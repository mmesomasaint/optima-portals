'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowRight, Workflow, Database, Zap } from 'lucide-react';

export default function NewDeployPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl">
      
      <div className="mb-10">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
          <Plus className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Deploy a new architecture.
        </h1>
        <p className="text-zinc-400 font-light leading-relaxed">
          Need a dedicated Employee Onboarding OS? A Content Engine? Spin up a new instance of the AI to map a completely different operational workflow.
        </p>
      </div>

      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-medium text-white">Optima Engine Instance</h3>
            <ul className="space-y-3">
              {[
                { icon: Database, text: "Independent relational database" },
                { icon: Workflow, text: "Custom mapped to new requirements" },
                { icon: Zap, text: "24-hour priority deployment" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-light">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">$250</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-6">One-Time</div>
            
            {/* REPLACE WITH YOUR SECOND PAYSTACK LINK */}
            <a 
              href={process.env.NEXT_PUBLIC_PAYSTACK_SHOP_URLB || "https://paystack.com/pay/new-brief"}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Initialize Instance <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}