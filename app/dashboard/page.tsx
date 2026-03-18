import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Activity, Folder, Clock, Search } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverview() {
  const supabase = await createClient();
  
  // 1. Authenticate and get the agency's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Fetch the active portals from Supabase
  // In a brand new account, this will be empty, so we handle the empty state gracefully.
  const { data: portals, error } = await supabase
    .from("active_portals")
    .select("*")
    // .eq("agency_id", user?.id) // Uncomment this when your foreign keys are mapped perfectly
    .order("created_at", { ascending: false })
    .limit(10);

  // Mock data fallback for UI development if your database is currently empty
  const displayPortals = portals && portals?.length && portals?.length > 0 ? portals : [
    { id: 1, client_name: "Acme Corp", template_name: "Standard Retainer OS", status: "active", live_notion_url: "https://notion.so/acme", created_at: new Date().toISOString() },
    { id: 2, client_name: "TechFlow Agency", template_name: "Web Build Portal", status: "provisioning", live_notion_url: null, created_at: new Date().toISOString() },
    { id: 3, client_name: "Elevate Design", template_name: "Standard Retainer OS", status: "archived", live_notion_url: "https://notion.so/elevate", created_at: new Date(Date.now() - 864000000).toISOString() },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Portals Overview</h1>
          <p className="text-zinc-500 mt-1">Manage and deploy your client Notion workspaces.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm h-10 px-5">
            <Plus className="w-4 h-4 mr-2" /> Provision New Portal
          </Button>
        </Link>
      </div>

      {/* --- METRICS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">Active Workspaces</p>
              <p className="text-3xl font-bold text-zinc-900">12</p>
            </div>
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
              <Folder className="w-6 h-6 text-zinc-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">Deploying Now</p>
              <p className="text-3xl font-bold text-zinc-900">1</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500 mb-1">Hours Saved (Est)</p>
              <p className="text-3xl font-bold text-green-600">48h</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- DATA TABLE --- */}
      <Card className="border-zinc-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Deployments</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text" 
                placeholder="Search clients..." 
                className="pl-9 pr-4 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <div className="divide-y divide-zinc-100">
          {displayPortals?.map((portal) => (
            <div key={portal.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-10 h-10 bg-zinc-100 rounded-md items-center justify-center text-zinc-500 font-bold text-sm uppercase">
                  {portal.client_name.substring(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{portal.client_name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Template: {portal.template_name || "Custom Built"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                {/* Status Badge Logic */}
                {portal.status === "active" && <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none font-medium">Active</Badge>}
                {portal.status === "provisioning" && <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none font-medium animate-pulse">Provisioning...</Badge>}
                {portal.status === "archived" && <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-100 border-none font-medium">Archived</Badge>}
                
                {/* Action Button */}
                {portal.status === "active" ? (
                  <Link href={portal.live_notion_url || "#"} target="_blank" className="text-zinc-500 hover:text-zinc-900 transition-colors p-2">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="w-8 h-8"></div> // Spacer to keep alignment when button is missing
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
    </div>
  );
}