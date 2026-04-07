'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Workflow, ArrowRight, Loader2, Database } from 'lucide-react';

export default function NewBriefPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    workspaceName: '',
    teamSize: '',
    currentTools: '',
    primaryBottleneck: '',
  });

  // Verify session on load
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      // Inject the new Operational Brief
      const { data: insertedBrief, error: dbError } = await supabase
        .from('operational_briefs')
        .insert([
          {
            user_id: userId,
            workspace_name: formData.workspaceName,
            team_size: formData.teamSize,
            current_tools: formData.currentTools,
            primary_bottleneck: formData.primaryBottleneck,
            data_relationships: "Initializing AI build sequence...",
            status: 'pending_ai_build'
          }
        ])
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);
      if (!insertedBrief) throw new Error("Failed to retrieve the new brief ID.");

      // Teleport back to Command Center
      router.refresh();
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Pipeline Error:", error);
      alert(`Deployment Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-2xl mx-auto">
      
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Database className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-medium tracking-tight mb-3 text-white">
          Configure New Instance
        </h1>
        <p className="text-zinc-400 font-light">
          Define the operational parameters for your new architecture.
        </p>
      </div>

      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4 border-b border-white/10 pb-6">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Workspace Name</label>
              <input required type="text" value={formData.workspaceName} onChange={e => setFormData({...formData, workspaceName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Content Team Portal" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Team Size</label>
              <select required value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                <option value="" className="bg-black">Select size...</option>
                <option value="1-5" className="bg-black">1 - 5 employees</option>
                <option value="6-15" className="bg-black">6 - 15 employees</option>
                <option value="16+" className="bg-black">16+ employees</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Tools to Replace/Integrate</label>
              <input required type="text" value={formData.currentTools} onChange={e => setFormData({...formData, currentTools: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Asana, Google Sheets, Slack..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Primary Bottleneck</label>
              <textarea required value={formData.primaryBottleneck} onChange={e => setFormData({...formData, primaryBottleneck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none" placeholder="What needs to be fixed?" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || !formData.workspaceName || !formData.primaryBottleneck} className="w-full mt-8 py-3.5 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch Engine Build'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  );
}