'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Building2, Workflow, Lock, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Initialize the Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function IntakePipeline() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // The Payload State
  const [formData, setFormData] = useState({
    companyName: '',
    teamSize: '',
    currentTools: '',
    primaryBottleneck: '',
    dataRelationships: '',
    email: '',
    password: ''
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create the Secure User Account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Authentication failed to return a user.");

      // Inject the Operational Brief into the Database
      const { error: dbError } = await supabase
        .from('operational_briefs')
        .insert([
          {
            user_id: authData.user.id,
            company_name: formData.companyName,
            team_size: formData.teamSize,
            current_tools: formData.currentTools,
            primary_bottleneck: formData.primaryBottleneck,
            data_relationships: "Not specified in V1 form", // Fallback for the column we skipped
            status: 'pending_ai_build'
          }
        ]);

      if (dbError) throw new Error(dbError.message);

      // Teleport the user to their new Dashboard
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Pipeline Error:", error);
      alert(`Deployment Failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
          <Workflow className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">Optima Logic.</span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: step >= i ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* The Form Card */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basics */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-zinc-400" />
                  <h2 className="text-2xl font-medium text-white">Company Basics</h2>
                </div>
                <p className="text-zinc-500 text-sm mb-6">Let's start with who we are building for.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Company Name</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Lumina Agency" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Team Size</label>
                    <select value={formData.teamSize} onChange={e => setFormData({...formData, teamSize: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                      <option value="" className="bg-black">Select size...</option>
                      <option value="1-5" className="bg-black">1 - 5 employees</option>
                      <option value="6-15" className="bg-black">6 - 15 employees</option>
                      <option value="16+" className="bg-black">16+ employees</option>
                    </select>
                  </div>
                </div>
                
                <button onClick={handleNext} disabled={!formData.companyName} className="w-full mt-8 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Logic */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                 <div className="flex items-center gap-3 mb-6">
                  <Workflow className="w-6 h-6 text-zinc-400" />
                  <h2 className="text-2xl font-medium text-white">Operational Logic</h2>
                </div>
                <p className="text-zinc-500 text-sm mb-6">Tell the AI engine what needs to be fixed.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Current Tools (To be replaced/integrated)</label>
                    <input type="text" value={formData.currentTools} onChange={e => setFormData({...formData, currentTools: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Asana, Google Sheets, Slack..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">What is your biggest operational bottleneck?</label>
                    <textarea value={formData.primaryBottleneck} onChange={e => setFormData({...formData, primaryBottleneck: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none" placeholder="e.g. We lose track of client feedback because it's scattered across emails..." />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={handleBack} className="px-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNext} disabled={!formData.primaryBottleneck} className="flex-1 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    Final Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Account Creation */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                 <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-2xl font-medium text-white">Secure Your Portal</h2>
                </div>
                <p className="text-zinc-500 text-sm mb-6">Create an account to track your AI build progress and access your final workspace.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Work Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="founder@agency.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Password</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors" placeholder="••••••••" />
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button type="button" onClick={handleBack} className="px-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Architecture'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}