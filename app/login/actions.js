"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function login(prevState, formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(prevState, formData) {
  if (!formData || typeof formData.get !== "function") {
    console.error("signup action received invalid formData", formData);
    return { error: "Invalid form submission data." };
  }

  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");
  const agencyName = formData.get("agencyName");

  if (!agencyName) return { error: "Agency name is required." };

  // 1. Create the Auth User securely
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // 2. Provision their Agency profile in our database
  if (data.user) {
    // Initialize the admin client to safely bypass RLS during signup
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error: dbError } = await supabaseAdmin
      .from("agencies")
      .insert([{ 
        id: data.user.id, // IMPORTANT: Link the agency to the new user!
        name: agencyName 
      }]);
      
    // Aggressive Error Handling: If the database insert fails, we need to rollback the auth user creation to prevent orphaned accounts.
    if (dbError) {
      console.error("Failed to provision agency record:", dbError);
      
      // Delete the auth user we just created so they aren't stuck in limbo
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        data.user.id
      );

      if (deleteError) {
        // This is a rare edge case where both the insert AND the deletion failed.
        console.error("CRITICAL: Failed to rollback user creation:", deleteError);
      }

      // Return a friendly error to the UI so the user knows it failed
      return { error: "Failed to set up your agency. Please try signing up again." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}