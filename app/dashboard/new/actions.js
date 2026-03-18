"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function provisionPortal(prevState, formData) {
  const supabase = await createClient();
  const clientName = formData.get("clientName");
  const projectScope = formData.get("projectScope");

  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 2. Verify they have connected Notion
  const { data: integration } = await supabase
    .from("agency_integrations")
    .select("notion_access_token")
    .eq("agency_id", user.id)
    .single();

  if (!integration?.notion_access_token) {
    return { error: "You must connect your Notion workspace in Integrations first." };
  }

  // 3. Create a "Provisioning" placeholder in the database
  // This makes the UI feel instantly responsive before the AI even finishes.
  const { data: newPortal, error: dbError } = await supabase
    .from("active_portals")
    .insert([{
      agency_id: user.id,
      client_name: clientName,
      status: "provisioning",
      live_notion_url: null
    }])
    .select()
    .single();

  if (dbError) return { error: "Failed to create database record." };

  // 4. Fire the request to your FastAPI Python Engine
  try {
    // Note: In production, this points to your Render.com URL
    await fetch("http://127.0.0.1:8000/api/generate-os", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal_id: newPortal.id, // Pass this so Python knows which row to update when done
        client_name: clientName,
        client_request: projectScope,
        notion_token: integration.notion_access_token // Pass the token securely server-to-server
      })
    });
  } catch (error) {
    console.error("FastAPI Engine offline:", error);
    // Even if Python is offline, we don't crash Next.js. We just log it.
    return { error: "AI Engine is currently unreachable. Ensure Python server is running." };
  }

  // 5. Kick them back to the dashboard to watch the status badge pulse
  redirect("/dashboard");
}