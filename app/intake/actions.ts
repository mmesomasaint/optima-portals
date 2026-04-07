'use server';

export async function verifyPaystackReference(reference: string) {
  if (!reference) return { success: false, message: "No reference provided." };

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      // Security Check: Ensure they actually paid the right amount (e.g., $250.00 = 25000 cents/kobo)
      // if (data.data.amount < 25000) return { success: false, message: "Partial payment detected." };
      
      return { success: true };
    }

    return { success: false, message: "Transaction not successful." };
  } catch (error) {
    console.error("Paystack Verification Error:", error);
    return { success: false, message: "Server error verifying payment." };
  }
}