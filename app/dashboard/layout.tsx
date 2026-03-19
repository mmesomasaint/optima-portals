import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Webhook, CreditCard, Settings, LogOut, Layers } from "lucide-react";

export default async function DashboardLayout({ children } : { children: React.ReactNode }) {
  // THE SECURITY GATE: Server-side auth check
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If they aren't logged in, instantly kick them back to the login page
  if (error || !user) {
    redirect("/login");
  }

  // Fetch the Agency's name for the UI
  const { data: agency } = await supabase
    .from("agencies")
    .select("name, stripe_subscription_status")
    .eq("id", user.id) // Assuming user.id matches the agency id, or use the correct relational query
    .single();

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* --- PERSISTENT SIDEBAR --- */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col border-r border-zinc-800">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 mb-6">
          <Layers className="w-5 h-5 text-white mr-3" />
          <span className="font-bold text-white tracking-tight">Optima Portals</span>
        </div>

        {/* Agency Info */}
        <div className="px-6 mb-8">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Active Workspace</p>
          <p className="text-sm font-medium text-white truncate">{agency?.name || "Your Agency"}</p>
          {agency?.stripe_subscription_status === 'trialing' && (
            <span className="inline-block mt-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] uppercase font-bold rounded">
              14-Day Trial
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-4 h-4 mr-3" /> Portals
          </Link>
          <Link href="/dashboard/templates" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <Users className="w-4 h-4 mr-3" /> Blueprints
          </Link>
          <Link href="/dashboard/integrations" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <Webhook className="w-4 h-4 mr-3" /> API & Zapier
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-1">
          <Link href="/dashboard/billing" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <CreditCard className="w-4 h-4 mr-3" /> Billing
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <Settings className="w-4 h-4 mr-3" /> Settings
          </Link>
          
          {/* We will wire this up to a server action later */}
          <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors mt-2">
            <LogOut className="w-4 h-4 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- DYNAMIC MAIN CONTENT --- */}
      {/* This is where the specific pages (Portals, Integrations, etc.) will render */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-full p-8">
          {children}
        </div>
      </main>

    </div>
  );
}