'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Database, CheckCircle2, Workflow, AlertTriangle, Link2, Zap, ArrowUpRight, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OnboardingTour from '@/components/mini/OnboardingTour';

export default function ClientDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState<string>('Founder');
  const [isLoading, setIsLoading] = useState(true);
  const [isIgniting, setIsIgniting] = useState(false);
  const [engineError, setEngineError] = useState('');
  
  // We now store ALL briefs, not just one
  const [briefs, setBriefs] = useState<any[]>([]);
  const [integration, setIntegration] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Identify the Agency Owner's Name for the Welcome Message
        const metadataName = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        if (metadataName) {
          setUserName(metadataName);
        } else if (session.user.email) {
          // Fallback: If no name was provided at signup, capitalize the first part of their email
          const emailName = session.user.email.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }

        // 1. Fetch ALL Briefs, ordered by newest first
        const { data: briefData } = await supabase
          .from('operational_briefs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (briefData) setBriefs(briefData);

        // 2. Fetch the Integrations
        const { data: integrationData } = await supabase
          .from('agency_integrations')
          .select('*')
          .eq('agency_id', session.user.id)
          .maybeSingle();

        if (integrationData) setIntegration(integrationData);

      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [supabase]);

  // Derived State
  const isNotionReady = !!(integration?.notion_access_token && integration?.base_notion_page_id);
  const latestBrief = briefs.length > 0 ? briefs[0] : null;
  const deployedWorkspaces = briefs.filter(b => b.status === 'completed' && b.live_notion_url);

  // If the engine is running, check the database every 3 seconds for the result
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (latestBrief?.status === 'processing') {
      interval = setInterval(async () => {
        const { data, error } = await supabase
          .from('operational_briefs')
          .select('status, live_notion_url, data_relationships')
          .eq('id', latestBrief.id)
          .single();
          
        if (data && (data.status === 'completed' || data.status === 'failed')) {
          // The engine finished! Update the UI and stop polling.
          setBriefs(prevBriefs => {
            const updated = [...prevBriefs];
            updated[0] = { ...updated[0], ...data };
            return updated;
          });
          setIsIgniting(false);
        }
      }, 3000); 
    }
    
    return () => clearInterval(interval); // Cleanup when unmounted or finished
  }, [latestBrief?.status, latestBrief?.id, supabase]);

  const handleIgniteEngine = async () => {
    if (!latestBrief || !isNotionReady) return;
    setIsIgniting(true);
    setEngineError(''); // Clear previous errors

    try {
      const engineUrl = process.env.NEXT_PUBLIC_API_URL;
      if (engineUrl) {
        await fetch(`${engineUrl}/api/generate-os`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brief_id: latestBrief.id })
        });
        
        // Optimistically update UI so it instantly shows "Processing"
        const updatedBriefs = [...briefs];
        updatedBriefs[0] = { ...latestBrief, status: 'processing' };
        setBriefs(updatedBriefs);
      } else {
        setEngineError("System Error: API URL is missing. Please contact support.");
      }
    } catch (err) {
      console.error("Webhook failed:", err);
      setEngineError("Failed to connect to the LangGraph Engine.");
    } finally {
      setIsIgniting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-12">
      <OnboardingTour isNotionReady={isNotionReady} briefStatus={latestBrief?.status} />

      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Welcome back, {userName}.
        </h1>
        <p className="text-zinc-400 font-light">Optima Engine Command Center.</p>
      </div>

      {/* --- THE LOGIC GATE (For the newest brief only) --- */}
      {latestBrief?.status === 'pending_ai_build' && !isNotionReady && (
        <div id="tour-step-1" className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-medium text-white">Action Required: Connect Notion</h2>
          </div>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Your operational brief is ready, but the AI engine cannot build your workspace until you grant it access to your Notion account and provide a Master URL.
          </p>
          <Link href="/dashboard/integrations">
            <button id="tour-step-1-btn" className="px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Go to Integrations
            </button>
          </Link>
        </div>
      )}

      {latestBrief?.status === 'pending_ai_build' && isNotionReady && (
        <div id="tour-step-2" className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 mb-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <Zap className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Systems Ready for Deployment</h2>
          <p className="text-sm text-zinc-400 font-light mb-6 max-w-lg mx-auto">
            Your Notion workspace is connected. The LangGraph engine is primed to process your new brief for <span className="text-white font-medium">{latestBrief.workspace_name || latestBrief.company_name}</span>.
          </p>

          {/* Inline Error Display */}
          {engineError && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-red-400 text-xs max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {engineError}
            </div>
          )}

          <button 
            onClick={handleIgniteEngine}
            disabled={isIgniting}
            className="px-8 py-3.5 bg-emerald-500 text-black text-sm font-bold rounded-xl hover:bg-emerald-400 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isIgniting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ignite AI Engine'}
          </button>
        </div>
      )}

      {/* --- THE ENGINE TRACKER (Only shows when the newest brief is processing or failed) --- */}
      {(latestBrief?.status === 'processing' || latestBrief?.status === 'failed') && (
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <Workflow className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white">Optima Engine v1.0</h2>
                <div className="flex items-center gap-2 text-sm mt-1">
                  {latestBrief.status === 'failed' ? (
                    <span className="text-red-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Build Failed</span>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Processing Architecture
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-black border border-white/5 rounded-2xl p-5 relative z-10 font-mono text-xs">
            <p className="text-zinc-500 mb-2">// ENGINE TELEMETRY LOGS</p>
            <p className={latestBrief.status === 'failed' ? 'text-red-400' : 'text-zinc-300'}>
              &gt; {latestBrief.data_relationships || "Awaiting system response..."}
            </p>
          </div>
        </div>
      )}

      {/* --- DEPLOYED WORKSPACES ARCHIVE --- */}
      {deployedWorkspaces.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-zinc-400" /> Deployed Architectures
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deployedWorkspaces.map((workspace) => (
              <div key={workspace.id} className="bg-[#050505] border border-white/10 rounded-3xl p-6 group hover:border-white/20 transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {/* The new dual-title layout */}
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mb-1">{workspace.company_name}</p>
                    <h4 className="text-white font-medium text-lg">{workspace.workspace_name || workspace.company_name}</h4>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3 h-3" /> 
                      {new Date(workspace.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                
                <p className="text-sm text-zinc-400 font-light line-clamp-2 mb-6 flex-1">
                  Bottleneck Solved: {workspace.primary_bottleneck}
                </p>
                
                <a 
                  href={workspace.live_notion_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-3 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group-hover:bg-white/10"
                >
                  Open Notion Workspace <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}