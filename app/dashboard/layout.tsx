import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, Settings, LogOut, Workflow, Plus } from "lucide-react";
import { SidebarNav } from "@/components/mini/SidebarNav";
import { SignOutButton } from "@/components/mini/SignOutButton";
import { SidebarBottomNav } from "@/components/mini/SidebarBottomNav";

export default async function DashboardLayout({ children } : { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: brief, error: briefError } = await supabase
  .from("operational_briefs")
  .select("company_name, status")
  .eq("user_id", user.id) 
  .maybeSingle();

  return (
    <div className="flex h-screen bg-[#000000] font-sans text-white overflow-hidden">
      
      <aside className="w-64 bg-[#050505] flex flex-col border-r border-white/10 relative z-20">
        
        <div className="h-20 flex items-center px-6 border-b border-white/10 mb-6">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 mr-3">
            <Workflow className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">Optima Portals</span>
        </div>

        <div className="px-6">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Active Workspace</p>
          <p className="text-sm font-medium text-zinc-200 truncate">{brief?.company_name || "New Agency"}</p>
          
          {/* THE UPSELL BUTTON */}
          <Link 
            href="/dashboard/new-deploy" 
            className="my-8 w-full flex items-center justify-center px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1.5" /> Deploy New System
          </Link>
        </div>

        {/* The dynamic client-side navigation */}
        <SidebarNav />
        
        {/* The dynamic client-side bottom navigation */}
        <SidebarBottomNav />
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="h-full p-8 md:p-12 relative z-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}