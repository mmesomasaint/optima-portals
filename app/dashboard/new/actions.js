"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function provisionPortal(prevState, formData) {
  const supabase = await createClient();
  const clientName = formData.get("clientName");
  const projectScope = formData.get("projectScope");

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // Verify they have connected Notion
  const { data: integration } = await supabase
    .from("agency_integrations")
    .select("notion_access_token")
    .eq("agency_id", user.id)
    .single();

  if (!integration?.notion_access_token) {
    return { error: "You must connect your Notion workspace in Integrations first." };
  }

  // Create a "Provisioning" placeholder in the database
  // This makes the UI feel instantly responsive before the AI even finishes.
  const { data: newPortal, error: dbError } = await supabase
    .from("active_portals")
    .insert([{
      agency_id: user.id,
      client_name: clientName,
      live_notion_url: null
    }])
    .select()
    .single();

  if (dbError) return { error: "Failed to create database record." };

  // Fire the request to your FastAPI Python Engine
  try {
    // Note: In production, this points to your Render.com URL
    await fetch("https://crispy-journey-4p4r5vp97g7376p9-8000.app.github.dev/api/generate-os", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal_id: newPortal.id, // Pass this so Python knows which row to update when done
        client_name: clientName,
        client_request: projectScope,
        notion_token: integration.notion_access_token, // Pass the token securely server-to-server
        base_page_id: integration.base_notion_page_id
      })
    });
  } catch (error) {
    console.error("FastAPI Engine offline:", error);
    // Even if Python is offline, we don't crash Next.js. We just log it.
    return { error: "AI Engine is currently unreachable. Ensure Python server is running." };
  }

  // Kick them back to the dashboard to watch the status badge pulse
  redirect("/dashboard");
}