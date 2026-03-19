"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createPaystackCheckout() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in.");

  // Fetch their agency ID (Mocked here, ensure your users table is linked)
  // const agencyId = user.user_metadata.agency_id; 
  const agencyId = "placeholder-agency-id"; 

  // Initialize Paystack Transaction
  const payload = {
    email: user.email,
    amount: 14900, // Paystack amounts are in the lowest denomination (cents/kobo). $149 = 14900
    currency: "USD", // Force USD billing for international B2B clients
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
    metadata: {
      custom_fields: [
        {
          display_name: "Agency ID",
          variable_name: "agency_id",
          value: agencyId, // CRITICAL: This is how the webhook identifies the user
        }
      ]
    }
  };

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message);
  }

  // Redirect to Paystack's hosted checkout page
  redirect(data.data.authorization_url);
}