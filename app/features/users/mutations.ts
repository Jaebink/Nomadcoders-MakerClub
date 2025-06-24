import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const updateUser = async (
    client: SupabaseClient<Database>,
    {
        id,
        name,
        username,
    }: {
        id: string,
        name: string,
        username: string,
    }
) => {
    const { error } = await client
        .from("profiles")
        .update({
            name,
            username,
            updated_at: new Date().toISOString(),
        })
        .eq("profile_id", id);
    if (error) {
        throw error;
    }
};