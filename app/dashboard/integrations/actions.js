"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveMasterPageId(rawUrl) {
  if (!rawUrl) return { error: "URL cannot be empty." };

  let basePageId = "";

  try {
    const parsedUrl = new URL(rawUrl);
    const cleanPath = parsedUrl.pathname; 

    const idMatch = cleanPath.match(/[a-f0-9]{32}$/i);
    
    if (idMatch) {
      basePageId = idMatch[0];
    } else {
      const deHyphenated = cleanPath.replace(/-/g, '');
      const fallbackMatch = deHyphenated.match(/[a-f0-9]{32}$/i);
      
      if (fallbackMatch) {
        basePageId = fallbackMatch[0];
      } else {
        return { error: "Invalid Notion URL. Could not find the 32-character Page ID." };
      }
    }
    
  } catch (error) {
    return { error: "Please enter a valid https:// URL." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error: dbError } = await supabase
    .from("agency_integrations")
    .upsert({
      agency_id: user.id,
      base_notion_page_id: basePageId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'agency_id' }); 

  if (dbError) {
    console.error("Database error:", dbError);
    return { error: "Failed to save the Master Page ID to the database." };
  }

  return { success: true, basePageId };
}