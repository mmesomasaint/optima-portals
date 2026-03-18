"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

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
    const { error: dbError } = await supabase
      .from("agencies")
      .insert([{ name: agencyName }]);
      
    if (dbError) console.error("Failed to provision agency record:", dbError);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}