import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Admin client to bypass Row Level Security
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  // Get raw body and signature
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Verify the Paystack Signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    console.error("🚨 Invalid Paystack signature");
    return new Response("Invalid signature", { status: 400 });
  }

  // Parse the verified event
  const event = JSON.parse(body);

  try {
    // Handle a successful charge
    if (event.event === "charge.success") {
      const transaction = event.data;
      
      // Extract the agency ID we hid in the metadata
      const agencyId = transaction.metadata.custom_fields.find(
        (field) => field.variable_name === "agency_id"
      ).value;

      // Update Supabase
      await supabaseAdmin
        .from("agencies")
        .update({ 
          stripe_customer_id: transaction.customer.customer_code, // Using this column for Paystack ID
          stripe_subscription_status: "active" 
        })
        .eq("id", agencyId);
        
      console.log(`✅ Payment successful for Agency: ${agencyId}`);
    }
    
    // You can add more cases here for 'subscription.create', 'subscription.disable', etc.
    
  } catch (error) {
    console.error("Database update failed:", error);
    return new Response("Database Error", { status: 500 });
  }

  return new Response("Webhook processed", { status: 200 });
}