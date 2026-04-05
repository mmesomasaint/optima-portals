'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Database, Clock, CheckCircle2, Workflow } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ClientDashboard() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [brief, setBrief] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return; // Layout handles the actual redirect

        const { data: briefData } = await supabase
          .from('operational_briefs')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (briefData) setBrief(briefData);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Welcome back, {brief?.company_name || 'Founder'}.
        </h1>
        <p className="text-zinc-400 font-light">Your bespoke Notion OS is currently in the engineering queue.</p>
      </div>

      {/* The Engine Status Card */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Workflow className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Optima Engine v1.0</h2>
            <div className="flex items-center gap-2 text-sm text-emerald-500 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Processing Architecture
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Step 1: Complete */}
          <div className="bg-white/5 border border-emerald-500/30 rounded-2xl p-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-3" />
            <h3 className="text-sm font-medium text-white mb-1">Brief Ingested</h3>
            <p className="text-xs text-zinc-400 font-light">Requirements securely logged.</p>
          </div>
          
          {/* Step 2: In Progress */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500/50 animate-pulse" />
            <Loader2 className="w-5 h-5 text-emerald-500 mb-3 animate-spin" />
            <h3 className="text-sm font-medium text-white mb-1">Relational Mapping</h3>
            <p className="text-xs text-zinc-400 font-light">AI is constructing databases.</p>
          </div>

          {/* Step 3: Pending */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 opacity-40">
            <Clock className="w-5 h-5 text-zinc-500 mb-3" />
            <h3 className="text-sm font-medium text-white mb-1">Deployment</h3>
            <p className="text-xs text-zinc-400 font-light">Pending final QA review.</p>
          </div>
        </div>
      </div>

      {/* Brief Summary */}
      {brief && (
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-white">
            <Database className="w-5 h-5 text-zinc-500" />
            Submitted Workflow Vector
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-2">Primary Bottleneck</p>
              <p className="text-sm text-zinc-300 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 font-light">
                {brief.primary_bottleneck}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-2">Tools to Integrate</p>
              <p className="text-sm text-zinc-300 bg-white/5 p-5 rounded-2xl border border-white/5 font-light">
                {brief.current_tools}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}