import { createClient } from "@/utils/supabase/server";
import { User, Lock, Shield, AlertTriangle } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-3xl">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Settings
        </h1>
        <p className="text-zinc-400 font-light">Manage your security and account preferences.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-emerald-500" /> Account Identity
          </h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">Registered Email</label>
              <input 
                type="text" 
                disabled 
                value={user?.email || ""} 
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-zinc-400 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-zinc-500 font-light">
              To change your primary login email, please contact studio support.
            </p>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-zinc-400" /> Security
          </h3>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 mt-12">
          <h3 className="text-lg font-medium text-red-400 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Permanently delete your account and wipe all operational brief data from the Optima Engine. This action cannot be undone.
          </p>
          <button className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}