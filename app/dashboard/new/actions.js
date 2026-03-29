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
    .select("notion_access_token, base_notion_page_id")
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
    const payload = {
      portal_id: newPortal.id, 
      client_name: clientName,
      client_request: projectScope,
      notion_token: integration.notion_access_token,
      base_page_id: integration.base_notion_page_id
    };
    
    // DEBUG: Print what we are sending BEFORE we send it
    console.log("📦 [NEXT.JS] Sending payload to Python:", payload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-os`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // THE FIX: Use .text() instead of .json() so it never crashes
      const errorText = await response.text(); 
      console.error("🚨 [FASTAPI RESPONSE]:", errorText);
      return { error: `AI Engine rejected the payload: ${errorText}` };
    }

  } catch (error) {
    console.error("🚨 [NEXT.JS NETWORK ERROR]:", error);
    return { error: "AI Engine is unreachable or crashed during fetch." };
  }

  // Kick them back to the dashboard to watch the status badge pulse
  redirect("/dashboard");
}