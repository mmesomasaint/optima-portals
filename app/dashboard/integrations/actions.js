"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveMasterPageId(rawUrl) {
  if (!rawUrl) return { error: "URL cannot be empty." };

  let basePageId = "";

  try {
    // Native URL Parsing
    // This instantly strips ?source=copy_link, ?pvs=4, or any future tracking tags
    const parsedUrl = new URL(rawUrl);
    const cleanPath = parsedUrl.pathname; 
    
    // Example cleanPath: "/my-workspace/Agency-Master-Page-8a3b2c1d4e5f6g7h8i9j0k1l2m3n4o5p"

    // Extract the 32-character Notion ID
    // We look for exactly 32 alphanumeric characters at the very end of the clean path
    const idMatch = cleanPath.match(/[a-f0-9]{32}$/i);
    
    if (idMatch) {
      basePageId = idMatch[0];
    } else {
      // Fallback: Sometimes Notion formats it with hyphens. We strip them and check again.
      const deHyphenated = cleanPath.replace(/-/g, '');
      const fallbackMatch = deHyphenated.match(/[a-f0-9]{32}$/i);
      
      if (fallbackMatch) {
        basePageId = fallbackMatch[0];
      } else {
        return { error: "Invalid Notion URL. Could not find the 32-character Page ID." };
      }
    }
    
  } catch (error) {
    // This catches invalid URLs (e.g., if the user just typed "hello")
    return { error: "Please enter a valid https:// URL." };
  }

  // Authenticate and Save to Supabase
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