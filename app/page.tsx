import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function PortalRoot() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The Traffic Cop Logic
  if (user) {
    // Returning logged-in client -> send to Command Center
    redirect("/dashboard");
  } else {
    // Unauthenticated user -> send to Login Gate
    redirect("/login");
  }
}