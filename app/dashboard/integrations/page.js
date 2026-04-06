import { createClient } from "@/utils/supabase/server";
import { Link2, Webhook, CheckCircle2 } from "lucide-react";
import Notion from "@/components/icons/notion";
import DisconnectButton from "./DisconnectButton";
import MasterUrlInput from "./masterurlinput";

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch integration data
  const { data: integration, error } = await supabase
    .from("agency_integrations")
    .select("notion_access_token, base_notion_page_id")
    .eq("agency_id", user?.id) 
    .maybeSingle();

  if (error) {
    console.error("Supabase Read Error:", error);
  }

  const isNotionConnected = !!integration?.notion_access_token;
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/notion/callback&state=${user?.id}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Integrations
        </h1>
        <p className="text-zinc-400 font-light">Connect your core operational tools to the Optima engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- NOTION INTEGRATION CARD --- */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <Notion className="w-6 h-6 text-white" />
            </div>
            {isNotionConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-medium text-white mb-2">Notion Workspace</h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Required. Allows our AI agent to provision databases, map relations, and manage client permissions on your behalf.
          </p>

          <MasterUrlInput initialUrl={integration?.base_notion_page_id || ""} isNotionConnected={isNotionConnected} />

          <div className="mt-auto pt-6 border-t border-white/10">
            {isNotionConnected ? (
              <DisconnectButton />
            ) : (
              <a href={notionAuthUrl} className="block w-full">
                <button className="w-full py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                  <Link2 className="w-4 h-4" /> Connect Notion
                </button>
              </a>
            )}
          </div>
        </div>

        {/* --- ZAPIER CARD (Placeholder) --- */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col opacity-50">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-[#FF4A00]/10 border border-[#FF4A00]/20 rounded-2xl flex items-center justify-center">
              <Webhook className="w-6 h-6 text-[#FF4A00]" />
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-white mb-2">Zapier / Make.com</h3>
          <p className="text-sm text-zinc-400 font-light mb-6">
            Automatically trigger portal creation when a new client signs a contract in your CRM or pays an invoice.
          </p>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button disabled className="w-full py-3.5 text-sm font-medium text-zinc-500 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed">
              Configuration Available in Pro
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}