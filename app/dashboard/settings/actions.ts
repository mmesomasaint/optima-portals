'use server';

import { createClient as createServerClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function deleteUserAccount() {
  // Verify the user requesting the deletion
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized request." };

  // Initialize the Admin Client to bypass row-level security
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete the user from the master Auth system
  // (Because we added ON DELETE CASCADE earlier, this will also wipe their Notion keys!)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Admin Deletion Error:", error);
    return { error: "Failed to delete account from the server." };
  }

  return { success: true };
}