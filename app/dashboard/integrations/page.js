import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Webhook, CheckCircle2 } from "lucide-react";
import Notion from "@/components/icons/notion";

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if they already have an integration saved
  const { data: integration, error } = await supabase
    .from("agency_integrations")
    .select("notion_access_token")
    .eq("agency_id", user.id) // Assuming user.id matches the agency id
    .maybeSingle();

  // See what Supabase is complaining about
  if (error) {
    console.error("Supabase Read Error:", error);
  }

  const isNotionConnected = !!integration?.notion_access_token;

  // Build the Notion OAuth URL
  // We pass the user ID in the 'state' parameter as a security measure
  const notionAuthUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/notion/callback&state=${user.id}`;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Integrations</h1>
        <p className="text-zinc-500 mt-1">Connect your core operational tools to the Optima engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        
        {/* --- NOTION INTEGRATION CARD --- */}
        <Card className="border-zinc-200 shadow-sm relative overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4 border border-zinc-200">
                <Notion className="w-8 h-8 text-zinc-900" />
              </div>
              {isNotionConnected && (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </Badge>
              )}
            </div>
            <CardTitle>Notion Workspace</CardTitle>
            <CardDescription className="text-zinc-500 mt-2">
              Required. Allows our AI agent to provision databases, map relations, and manage client permissions on your behalf.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 border-t border-zinc-100 bg-zinc-50/50">
            {isNotionConnected ? (
              <div className="flex gap-3">
                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full">
                  Disconnect Workspace
                </Button>
              </div>
            ) : (
              <a href={notionAuthUrl} className="block w-full">
                <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800">
                  <Link2 className="w-4 h-4 mr-2" /> Connect Notion
                </Button>
              </a>
            )}
          </CardContent>
        </Card>

        {/* --- ZAPIER CARD (Placeholder) --- */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
             <div className="w-12 h-12 bg-[#FF4A00]/10 rounded-lg flex items-center justify-center mb-4 border border-[#FF4A00]/20">
                <Webhook className="w-6 h-6 text-[#FF4A00]" />
              </div>
            <CardTitle>Zapier / Make.com</CardTitle>
            <CardDescription className="text-zinc-500 mt-2">
              Automatically trigger portal creation when a new client signs a contract in your CRM or pays an invoice.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 border-t border-zinc-100 bg-zinc-50/50">
            <Button variant="outline" className="w-full text-zinc-500" disabled>
              Configuration Available in Pro
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}