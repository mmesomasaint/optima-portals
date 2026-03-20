import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  // Get the URL parameters Notion sent us
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const agencyId = searchParams.get("state"); // We passed the user's ID in the state param

  if (!code || !agencyId) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=missing_params`, request.url));
  }

  // Exchange the temporary code for the permanent access token
  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  
  // Notion requires Basic Auth using Base64 encoding for this specific request
  const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/notion/callback`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Notion OAuth Error:", data);
      return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=notion_rejection`, request.url));
    }


    // Create an ADMIN CLIENT to bypass RLS and save the token securely in supabase.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Make sure this is in your .env file!
    );
    
    // Using upsert in case they are reconnecting an existing integration
    const { error: dbError } = await supabaseAdmin
      .from("agency_integrations")
      .upsert({
        agency_id: agencyId,
        notion_access_token: data.access_token,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'agency_id' });

    if (dbError) throw new Error(dbError.message);

    // Redirect them back to the UI with a success message
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?success=true`, request.url));

  } catch (error) {
    console.error("Token Exchange Failed:", error);
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations?error=server_fault`, request.url));
  }
}