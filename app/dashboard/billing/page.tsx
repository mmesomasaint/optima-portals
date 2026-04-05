import { createClient } from "@/utils/supabase/server";
import { CreditCard, Receipt, Download, CheckCircle2, ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl">
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3 text-white">
          Billing & Licenses
        </h1>
        <p className="text-zinc-400 font-light">Manage your Optima Engine instances and payment history.</p>
      </div>

      {/* Active License Card */}
      <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-medium text-white">Optima Engine Instance</h3>
            </div>
            <p className="text-sm text-zinc-400 font-light ml-13">One-time architecture deployment.</p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-2xl font-bold text-white">$250</p>
              <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mt-1">Paid in Full</p>
            </div>
            <Link 
              href="/dashboard/new-deploy"
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              Deploy Another <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" /> Payment Method
            </h3>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-black rounded flex items-center justify-center border border-white/10">
                <span className="text-[10px] font-bold text-white tracking-widest">VISA</span>
              </div>
              <div>
                <p className="text-sm text-white font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-zinc-500">Expires 12/28</p>
              </div>
            </div>
            <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              Edit
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-4 font-light leading-relaxed">
            Payments are securely processed via Paystack. We do not store your full card details on our servers.
          </p>
        </div>

        {/* Billing History */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-zinc-400" /> Invoice History
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer">
              <div>
                <p className="text-sm text-white font-medium mb-1">Engine Deployment</p>
                <p className="text-xs text-zinc-500">Today</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-300 font-medium">$250.00</span>
                <Download className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}